"""
FastAPI server that exposes the LangGraph travel-planning pipeline
via Server-Sent Events (SSE) for real-time agent streaming.

Endpoints:
  POST /ai/plan          — stream agent updates as SSE
  GET  /ai/health        — health check
"""

import json
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse
from langchain_core.messages import HumanMessage
from pydantic import BaseModel

from agents import app as langgraph_app


# ── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(application: FastAPI):
    """Startup / shutdown hooks."""
    print("🚀 AI Service ready — LangGraph pipeline loaded")
    yield
    print("🛑 AI Service shutting down")


# ── App ──────────────────────────────────────────────────────────────────────

fastapi_app = FastAPI(
    title="Triply AI Service",
    description="LangGraph multi-agent travel planning API",
    version="1.0.0",
    lifespan=lifespan,
)

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ───────────────────────────────────────────────────────────────────

class PlanRequest(BaseModel):
    query: str
    thread_id: str = "default_user"


# ── Agent metadata ───────────────────────────────────────────────────────────

AGENT_META = {
    "flight_agent":    {"icon": "✈️",  "label": "Flight Agent",    "description": "Searching flights via AviationStack"},
    "hotel_agent":     {"icon": "🏨", "label": "Hotel Agent",     "description": "Searching hotels via Tavily"},
    "itinerary_agent": {"icon": "🗓️",  "label": "Itinerary Agent", "description": "Generating day-by-day itinerary"},
    "final_agent":     {"icon": "🧠", "label": "Final Agent",     "description": "Compiling final travel plan"},
}


# ── SSE Stream ───────────────────────────────────────────────────────────────

import threading

async def plan_event_generator(query: str, thread_id: str):
    """
    Run the LangGraph pipeline in a background thread and yield SSE events
    in real time as each agent node completes.
    """
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = {
        "messages": [HumanMessage(content=query)],
        "user_query": query,
        "flight_results": "",
        "hotel_results": "",
        "itinerary": "",
        "llm_calls": 0,
    }

    # Send pipeline start event
    yield {
        "event": "pipeline_start",
        "data": json.dumps({
            "agents": list(AGENT_META.keys()),
            "query": query,
        }),
    }

    loop = asyncio.get_running_loop()
    queue = asyncio.Queue()

    def run_pipeline():
        try:
            for chunk in langgraph_app.stream(
                initial_state,
                config=config,
                stream_mode="updates",
            ):
                loop.call_soon_threadsafe(queue.put_nowait, ("chunk", chunk))
            loop.call_soon_threadsafe(queue.put_nowait, ("done", None))
        except Exception as e:
            loop.call_soon_threadsafe(queue.put_nowait, ("error", e))

    threading.Thread(target=run_pipeline, daemon=True).start()

    collected = {
        "flight_results": "",
        "hotel_results": "",
        "itinerary": "",
        "final_response": "",
        "llm_calls": 0,
    }

    try:
        while True:
            msg_type, payload = await queue.get()

            if msg_type == "error":
                raise payload
            if msg_type == "done":
                break

            # Process chunk from completed agent node
            chunk = payload
            for node_name, state_update in chunk.items():
                meta = AGENT_META.get(node_name, {"icon": "🔧", "label": node_name, "description": ""})

                agent_data = ""
                if node_name == "flight_agent":
                    agent_data = state_update.get("flight_results", "")
                    collected["flight_results"] = agent_data
                elif node_name == "hotel_agent":
                    agent_data = state_update.get("hotel_results", "")
                    collected["hotel_results"] = agent_data
                elif node_name == "itinerary_agent":
                    agent_data = state_update.get("itinerary", "")
                    collected["itinerary"] = agent_data
                elif node_name == "final_agent":
                    msgs = state_update.get("messages", [])
                    agent_data = msgs[-1].content if msgs else ""
                    collected["final_response"] = agent_data

                collected["llm_calls"] = state_update.get("llm_calls", collected["llm_calls"])

                # Yield agent completion event immediately
                yield {
                    "event": "agent_update",
                    "data": json.dumps({
                        "agent": node_name,
                        "status": "complete",
                        "label": meta["label"],
                        "icon": meta["icon"],
                        "description": meta["description"],
                        "data": agent_data,
                        "llm_calls": collected["llm_calls"],
                    }),
                }

        # Yield final completion event with all collected data
        yield {
            "event": "pipeline_complete",
            "data": json.dumps({
                "flight_results": collected["flight_results"],
                "hotel_results": collected["hotel_results"],
                "itinerary": collected["itinerary"],
                "final_response": collected["final_response"],
                "llm_calls": collected["llm_calls"],
            }),
        }

    except Exception as e:
        yield {
            "event": "pipeline_error",
            "data": json.dumps({"error": str(e)}),
        }



# ── Routes ───────────────────────────────────────────────────────────────────

@fastapi_app.get("/ai/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "triply-ai-service"}


@fastapi_app.post("/ai/plan")
async def plan_trip(request: PlanRequest):
    """
    Stream the travel planning pipeline via Server-Sent Events.
    Each agent emits an event when it completes.
    """
    return EventSourceResponse(
        plan_event_generator(request.query, request.thread_id)
    )


# ── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:fastapi_app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
