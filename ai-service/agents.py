"""
LangGraph multi-agent travel planning pipeline.

Defines the agent graph: flight → hotel → itinerary → final
Each agent node updates the shared TravelState and can be streamed.
"""

import os
from typing import TypedDict, Annotated
import operator

import psycopg
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.postgres import PostgresSaver
from langchain_core.messages import (
    AnyMessage,
    HumanMessage,
    AIMessage,
    SystemMessage,
)
from langchain_groq import ChatGroq
from dotenv import load_dotenv

from tools.tavily_tool import tavily_search
from tools.flight_tool import search_flights

# Load .env from project root or local dir
_root_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
load_dotenv(_root_env)
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# ── LLM ──────────────────────────────────────────────────────────────────────
llm = ChatGroq(model="llama-3.3-70b-versatile")


# ── State ────────────────────────────────────────────────────────────────────
class TravelState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    user_query: str
    flight_results: str
    hotel_results: str
    itinerary: str
    llm_calls: int


# ── Agent Nodes ──────────────────────────────────────────────────────────────

def flight_agent(state: TravelState):
    """Search for flights using AviationStack API."""
    query = state["user_query"]
    flight_data = search_flights(query)
    return {
        "flight_results": flight_data,
        "messages": [AIMessage(content="Flight results fetched")],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }


def hotel_agent(state: TravelState):
    """Search for hotels using Tavily web search."""
    query = f"Best hotels for {state['user_query']}"
    hotel_results = tavily_search(query)
    return {
        "hotel_results": hotel_results,
        "messages": [AIMessage(content="Hotel information fetched")],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }


def itinerary_agent(state: TravelState):
    """Generate a detailed travel itinerary using Groq LLM."""
    prompt = f"""
Create a detailed, day-by-day travel itinerary.

User Query:
{state['user_query']}

Flight Results:
{state['flight_results']}

Hotel Results:
{state['hotel_results']}

Please include:
- Day-by-day schedule with activities
- Recommended restaurants and local food
- Transportation tips between locations
- Estimated costs where possible
- Must-see attractions and hidden gems
"""
    response = llm.invoke([
        SystemMessage(content="You are an expert travel planner who creates detailed, practical itineraries."),
        HumanMessage(content=prompt),
    ])
    return {
        "itinerary": response.content,
        "messages": [response],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }


def final_agent(state: TravelState):
    """Combine all results into a polished final travel plan."""
    final_prompt = f"""
Generate a comprehensive, well-organized final travel plan that combines all the information below.

Format it with clear sections:
1. Trip Overview
2. Flight Details
3. Hotel Recommendations
4. Day-by-Day Itinerary
5. Budget Summary
6. Travel Tips

Flights:
{state['flight_results']}

Hotels:
{state['hotel_results']}

Itinerary:
{state['itinerary']}

Original request: {state['user_query']}
"""
    response = llm.invoke([
        SystemMessage(content="You are a senior travel consultant. Produce a polished, comprehensive travel plan."),
        HumanMessage(content=final_prompt),
    ])
    return {
        "messages": [response],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }


from langgraph.checkpoint.memory import MemorySaver

# ── Graph Construction ──────────────────────────────────────────────────────

def build_graph():
    """Build and return the compiled LangGraph with persistent checkpointer."""
    graph = StateGraph(TravelState)

    graph.add_node("flight_agent", flight_agent)
    graph.add_node("hotel_agent", hotel_agent)
    graph.add_node("itinerary_agent", itinerary_agent)
    graph.add_node("final_agent", final_agent)

    graph.add_edge(START, "flight_agent")
    graph.add_edge("flight_agent", "hotel_agent")
    graph.add_edge("hotel_agent", "itinerary_agent")
    graph.add_edge("itinerary_agent", "final_agent")
    graph.add_edge("final_agent", END)

    checkpointer = None
    if DATABASE_URL:
        try:
            conn = psycopg.connect(DATABASE_URL)
            checkpointer = PostgresSaver(conn)
            checkpointer.setup()
            print("✅ Connected to PostgreSQL for conversation persistence.")
        except Exception as e:
            print(f"⚠️ PostgreSQL connection not available ({e}). Falling back to in-memory checkpointer.")
            checkpointer = MemorySaver()
    else:
        print("ℹ️ DATABASE_URL not configured. Using in-memory checkpointer.")
        checkpointer = MemorySaver()

    return graph.compile(checkpointer=checkpointer)


# Module-level compiled app (created once on import)
app = build_graph()

