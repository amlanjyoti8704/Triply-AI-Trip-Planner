"""
Transit search tool supporting both Flights and Trains.
Integrates AviationStack API, Tavily search, and LLM route parsing to deliver
both flight options and train routes with fares and travel times.
"""

import os
import json
import requests
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

from tools.tavily_tool import tavily_search

_root_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
load_dotenv(_root_env)
load_dotenv()

AVIATIONSTACK_KEY = os.getenv("AVIATIONSTACK_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")


def extract_route_info(query: str) -> dict:
    """Use fast LLM to extract origin, destination, airport IATAs, and railway stations."""
    try:
        llm = ChatGroq(model=GROQ_MODEL, temperature=0.1)
        prompt = f"""Extract transit route information from this travel query.
Return ONLY a valid JSON object without markdown fences, with these exact keys:
- origin: (city/place name where trip begins, default to 'Delhi' if unspecified)
- destination: (main destination city/place)
- origin_iata: (3-letter IATA code of nearest commercial airport to origin, e.g. IXR for Ranchi, DEL for Delhi, BOM for Mumbai)
- dest_iata: (3-letter IATA code of nearest commercial airport to destination, e.g. DED for Kedarnath/Rishikesh, DEL for Delhi, HND for Tokyo)
- origin_station: (primary railway station name & code, e.g. 'Ranchi Junction (RNC)')
- dest_station: (nearest railway station name & code, e.g. 'Haridwar (HW) / Rishikesh (YNRK)')
- is_rail_viable: (boolean: true if overland train travel is physically viable, false for overseas/trans-oceanic)

User Query: "{query}"
"""
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        if content.startswith("```"):
            lines = content.split("\n")
            content = "\n".join(lines[1:-1] if lines[-1].startswith("```") else lines[1:])
        return json.loads(content)
    except Exception as e:
        print(f"Route extraction fallback: {e}")
        return {
            "origin": "Origin",
            "destination": query,
            "origin_iata": None,
            "dest_iata": None,
            "origin_station": None,
            "dest_station": None,
            "is_rail_viable": True,
        }


def search_aviationstack(dep_iata: str, arr_iata: str = None) -> list:
    """Query AviationStack API with specific IATA filters."""
    if not AVIATIONSTACK_KEY or not dep_iata:
        return []

    url = "http://api.aviationstack.com/v1/flights"
    params = {
        "access_key": AVIATIONSTACK_KEY,
        "dep_iata": dep_iata,
        "limit": 4,
    }
    if arr_iata:
        params["arr_iata"] = arr_iata

    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        data = res.json()
        flights = []
        for f in data.get("data", [])[:3]:
            airline = f.get("airline", {}).get("name", "Airline")
            dep_apt = f.get("departure", {}).get("airport", dep_iata)
            arr_apt = f.get("arrival", {}).get("airport", arr_iata or "Dest")
            dep_code = f.get("departure", {}).get("iata", dep_iata)
            arr_code = f.get("arrival", {}).get("iata", arr_iata or "")
            flight_num = f.get("flight", {}).get("iata", "")
            status = f.get("flight_status", "Scheduled")
            flights.append(
                f"- **{airline} {flight_num}**: {dep_apt} ({dep_code}) ➔ {arr_apt} ({arr_code}) | Status: {status}"
            )
        return flights
    except Exception as e:
        print(f"AviationStack error: {e}")
        return []


def search_transit(query: str) -> str:
    """
    Comprehensive transit search:
    1. Extracts origin, destination, airports, and stations.
    2. Searches flights (AviationStack live tracker + Tavily fare/airline search).
    3. Searches trains (Tavily rail search for train names, numbers, travel time, fares).
    4. Compiles a comparison so user can choose their preferred travel mode.
    """
    route = extract_route_info(query)
    origin = route.get("origin", "Origin")
    destination = route.get("destination", "Destination")
    origin_iata = route.get("origin_iata")
    dest_iata = route.get("dest_iata")
    origin_station = route.get("origin_station") or origin
    dest_station = route.get("dest_station") or destination
    is_rail_viable = route.get("is_rail_viable", True)

    sections = []

    # ── 1. FLIGHT DETAILS ────────────────────────────────────────────────────
    flight_lines = []
    flight_lines.append(f"### ✈️ Flight Options ({origin} ➔ {destination})")

    # Try AviationStack live flights
    live_flights = []
    if origin_iata and dest_iata:
        live_flights = search_aviationstack(origin_iata, dest_iata)
        if not live_flights:
            # Try from origin to major hub (e.g. DEL)
            live_flights = search_aviationstack(origin_iata, "DEL")

    if live_flights:
        flight_lines.append("**Live Flights Tracked:**")
        flight_lines.extend(live_flights)

    # Search web for flight routes, airlines, fares, and transit tips
    flight_search_query = f"flights from {origin} to {destination} or {dest_iata or ''} airlines duration fare 2026"
    flight_web_data = tavily_search(flight_search_query, max_retries=2)
    flight_lines.append("\n**Airlines, Schedules & Estimated Fares:**")
    flight_lines.append(flight_web_data)

    sections.append("\n".join(flight_lines))

    # ── 2. TRAIN DETAILS ─────────────────────────────────────────────────────
    if is_rail_viable:
        train_lines = []
        train_lines.append(f"### 🚆 Train Options ({origin_station} ➔ {dest_station})")
        train_search_query = f"trains from {origin} to {dest_station} train numbers schedule timetable fare"
        train_web_data = tavily_search(train_search_query, max_retries=2)
        train_lines.append(train_web_data)
        sections.append("\n".join(train_lines))

    # ── 3. COMPARISON & RECOMMENDATION ───────────────────────────────────────
    comp_lines = []
    comp_lines.append(f"### ⚖️ Transit Comparison: Flight vs. Train")
    comp_lines.append(
        f"• **Destination Access**: {destination} nearest airport is **{dest_iata or 'regional airport'}**; "
        f"nearest major railhead is **{dest_station}**.\n"
        f"• **Time vs Budget Choice**:\n"
        f"  - **Choose Flight**: Best for rapid transit; minimizes travel fatigue.\n"
        f"  - **Choose Train**: Cost-effective, scenic, and often drops you closer to base stations without strict baggage or airport transfer delays."
    )
    sections.append("\n".join(comp_lines))

    return "\n\n---\n\n".join(sections)
