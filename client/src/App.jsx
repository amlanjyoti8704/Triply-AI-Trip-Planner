import { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TripForm from "./components/TripForm";
import DestinationStrip from "./components/DestinationStrip";
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
  const [threadId, setThreadId] = useState("user_2004");
  const [activeFormQuery, setActiveFormQuery] = useState("");

  const abortRef = useRef(null);

  const handleAbort = () => {
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
    }
    setIsLoading(false);
  };

  const handleNewThread = () => {
    const newId = `user_${Math.random().toString(36).substring(2, 8)}`;
    setThreadId(newId);
  };

  const handleSelectDestination = (destQuery) => {
    setActiveFormQuery(destQuery);
  };

  const handleSubmit = (query, currentThreadId) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setPipelineVisible(true);
    setLastQuery(query);
    setLastThreadId(currentThreadId);

    // Reset agents to pending, mark first as running
    const freshStatuses = { ...INITIAL_AGENT_STATUS };
    freshStatuses.flight_agent = { status: "running", data: "" };
    setAgentStatuses(freshStatuses);

    // Smooth scroll down to agent pipeline
    setTimeout(() => {
      const pipelineEl = document.getElementById("agent-pipeline-view");
      if (pipelineEl) {
        pipelineEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);

    const agentOrder = ["flight_agent", "hotel_agent", "itinerary_agent", "final_agent"];

    const abort = streamTravelPlan(query, currentThreadId, {
      onPipelineStart: () => {},

      onAgentUpdate: (data) => {
        setAgentStatuses((prev) => {
          const updated = { ...prev };

          updated[data.agent] = {
            status: "complete",
            data: data.data,
          };

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
    <div className="min-h-screen w-full bg-dark-950 text-white relative selection:bg-brand-500/30 selection:text-white">
      {/* Cinematic ambient background */}
      <div className="ambient-bg w-full h-full overflow-hidden" />
      <div className="dot-mesh w-full h-full overflow-hidden" />

      {/* Top Header */}
      <Navbar threadId={threadId} onNewThread={handleNewThread} />

      {/* Main Page Content */}
      <main className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24">
        {/* Hero Section */}
        <Hero />

        {/* Search & Configuration Console */}
        <div className="mt-2 w-full">
          <TripForm
            key={activeFormQuery}
            externalQuery={activeFormQuery}
            threadId={threadId}
            onSubmit={handleSubmit}
            onAbort={handleAbort}
            isLoading={isLoading}
          />
        </div>

        {/* Featured Curated Destinations (Standalone section) */}
        <DestinationStrip onSelect={handleSelectDestination} />

        {/* Error notification */}
        {error && (
          <div className="animate-fade-in-up mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200 backdrop-blur-xl flex items-center justify-between shadow-xl">
            <div>
              <span className="font-bold text-red-400 text-xs uppercase tracking-wider block mb-1">
                Pipeline Notice
              </span>
              <p className="text-sm text-red-200/90">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Real-Time Agent Pipeline */}
        <div id="agent-pipeline-view">
          <AgentPipeline agentStatuses={agentStatuses} visible={pipelineVisible} />
        </div>

        {/* Final Travel Itinerary */}
        <div id="final-plan-view">
          <TravelPlan
            result={result}
            query={lastQuery}
            threadId={lastThreadId}
            visible={!!result}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-dark-950/80 py-12 text-center relative z-10 backdrop-blur-xl">
        <div className="mx-auto w-full px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white">
              Tri<span className="gradient-text">ply</span>
            </span>
            <span className="rounded-md bg-brand-500/15 border border-brand-400/30 px-1.5 py-0.5 text-[0.62rem] font-bold text-brand-300 tracking-wide uppercase">
              AI
            </span>
          </div>

          <p className="text-xs text-text-secondary max-w-md leading-relaxed">
            Autonomous multi-agent travel planning platform. Powered by LangGraph, live airline APIs, curated hotel discovery, and stateful memory.
          </p>

          <div className="flex items-center gap-4 text-xs text-text-muted mt-2">
            <span>© {new Date().getFullYear()} Triply Intelligence.</span>
            <span>•</span>
            <a
              href="https://github.com/amlanjyoti8704/Triply-AI-Trip-Planner"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors no-underline"
            >
              Source Code
            </a>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
