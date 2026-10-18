import { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TripForm from "./components/TripForm";
import AgentPipeline from "./components/AgentPipeline";
import TravelPlan from "./components/TravelPlan";
import { streamTravelPlan } from "./api/travelApi";

const INITIAL_AGENT_STATUS = {
  flight_agent: { status: "pending", data: "" },
  hotel_agent: { status: "pending", data: "" },
  itinerary_agent: { status: "pending", data: "" },
  final_agent: { status: "pending", data: "" },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState(INITIAL_AGENT_STATUS);
  const [pipelineVisible, setPipelineVisible] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const [lastThreadId, setLastThreadId] = useState("");

  const abortRef = useRef(null);

  const handleAbort = () => {
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSubmit = (query, threadId) => {
    // Reset state
    setIsLoading(true);
    setError(null);
    setResult(null);
    setPipelineVisible(true);
    setLastQuery(query);
    setLastThreadId(threadId);

    // Set all agents to pending, then mark first as running
    const freshStatuses = { ...INITIAL_AGENT_STATUS };
    freshStatuses.flight_agent = { status: "running", data: "" };
    setAgentStatuses(freshStatuses);

    // Smooth scroll down to the agent pipeline
    setTimeout(() => {
      const pipelineEl = document.getElementById("agent-pipeline-view");
      if (pipelineEl) {
        pipelineEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);

    const agentOrder = ["flight_agent", "hotel_agent", "itinerary_agent", "final_agent"];

    const abort = streamTravelPlan(query, threadId, {
      onPipelineStart: () => {
        // Pipeline started
      },

      onAgentUpdate: (data) => {
        setAgentStatuses((prev) => {
          const updated = { ...prev };

          // Mark current agent as complete with received data
          updated[data.agent] = {
            status: "complete",
            data: data.data,
          };

          // Mark next agent as running
          const nextIdx = agentOrder.indexOf(data.agent) + 1;
          if (nextIdx < agentOrder.length) {
            updated[agentOrder[nextIdx]] = {
              status: "running",
              data: "",
            };
          }

          return updated;
        });
      },

      onPipelineComplete: (data) => {
        setResult(data);
        setIsLoading(false);

        // Smooth scroll to final travel plan
        setTimeout(() => {
          const planEl = document.getElementById("final-plan-view");
          if (planEl) {
            planEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 200);
      },

      onError: (err) => {
        console.error("Pipeline error:", err);
        setError(err.message || "Something went wrong communicating with the AI pipeline.");
        setIsLoading(false);
      },
    });

    abortRef.current = abort;
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white relative bg-grid-pattern selection:bg-brand-500 selection:text-white">
      {/* Ambient background light orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-brand-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed bottom-10 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 blur-[180px] pointer-events-none rounded-full" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24 pt-28">
        <Hero />

        {/* Input Form Section */}
        <div className="mt-6">
          <TripForm onSubmit={handleSubmit} onAbort={handleAbort} isLoading={isLoading} />
        </div>

        {/* Error Notification */}
        {error && (
          <div className="animate-fade-in-up mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200 backdrop-blur-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-red-400 block mb-0.5">Pipeline Execution Notice:</span>
              <p className="text-xs text-red-300/90">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Agent Pipeline */}
        <div id="agent-pipeline-view">
          <AgentPipeline agentStatuses={agentStatuses} visible={pipelineVisible} />
        </div>

        {/* Final Travel Plan Display */}
        <div id="final-plan-view">
          <TravelPlan
            result={result}
            query={lastQuery}
            threadId={lastThreadId}
            visible={!!result}
          />
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-white/5 bg-dark-950/80 py-12 text-center relative z-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-white">Tri<span className="gradient-text">ply</span></span>
            <span className="text-xs text-text-muted">• Autonomous Travel Planner</span>
          </div>

          <p className="text-xs text-text-muted max-w-md">
            Architected with React 19, Tailwind CSS v4, Node.js Express, Python FastAPI, LangGraph, Groq LLaMA 3.3, and Supabase PostgreSQL.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            <span className="pill-badge bg-white/5 text-text-muted">LangGraph Checkpointer</span>
            <span className="pill-badge bg-white/5 text-text-muted">Server-Sent Events</span>
            <span className="pill-badge bg-white/5 text-text-muted">Multi-Agent Cooperation</span>
          </div>

          <p className="text-[0.7rem] text-text-muted mt-2">
            © {new Date().getFullYear()} Triply. MIT Licensed.
          </p>
        </div>
      </footer>
    </div>
  );
}
