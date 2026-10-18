"""
Flight search tool using AviationStack API.
Returns formatted flight data for the travel planning pipeline.
"""

import os
import requests
from dotenv import load_dotenv

_root_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
load_dotenv(_root_env)
load_dotenv()

API_KEY = os.getenv("AVIATIONSTACK_API_KEY")


def search_flights(query: str) -> str:
    """Search for flights using AviationStack API."""

    url = "http://api.aviationstack.com/v1/flights"

    params = {
        "access_key": API_KEY,
        "limit": 5
    }

    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        return f"Error fetching flights: {str(e)}"

    flights = []

    if "data" in data:
        for flight in data["data"][:5]:
            airline = flight.get("airline", {}).get("name", "Unknown")
            dep_airport = flight.get("departure", {}).get("airport", "Unknown")
            dep_iata = flight.get("departure", {}).get("iata", "")
            arr_airport = flight.get("arrival", {}).get("airport", "Unknown")
            arr_iata = flight.get("arrival", {}).get("iata", "")
            status = flight.get("flight_status", "Unknown")
            flight_number = flight.get("flight", {}).get("iata", "N/A")
            dep_time = flight.get("departure", {}).get("estimated", "N/A")
            arr_time = flight.get("arrival", {}).get("estimated", "N/A")

            flights.append(
                f"Flight {flight_number} — {airline}\n"
                f"  From: {dep_airport} ({dep_iata})\n"
                f"  To:   {arr_airport} ({arr_iata})\n"
                f"  Departure: {dep_time}\n"
                f"  Arrival:   {arr_time}\n"
                f"  Status: {status}"
            )

    if not flights:
        return "No flight data available at this time."

    return "\n\n".join(flights)
