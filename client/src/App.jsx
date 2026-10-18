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

    const agentOrder = ["flight_agent", "hotel_agent", "itinerary_agent", "final_agent"];
    let completedCount = 0;

    const abort = streamTravelPlan(query, threadId, {
      onPipelineStart: () => {
        // Pipeline started — first agent is already marked running
      },

      onAgentUpdate: (data) => {
        completedCount++;

        setAgentStatuses((prev) => {
          const updated = { ...prev };

          // Mark this agent as complete
          updated[data.agent] = {
            status: "complete",
            data: data.data,
          };

          // Mark the next agent as running (if any)
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
      },

      onError: (err) => {
        console.error("Pipeline error:", err);
        setError(err.message || "Something went wrong");
        setIsLoading(false);
      },
    });

    abortRef.current = abort;
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 pb-20 pt-24">
        <Hero />

        <div className="mt-10">
          <TripForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="animate-fade-in-up mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            <span className="mr-2 font-semibold">⚠️ Error:</span>
            {error}
          </div>
        )}

        {/* Agent pipeline */}
        <AgentPipeline agentStatuses={agentStatuses} visible={pipelineVisible} />

        {/* Final result */}
        <TravelPlan
          result={result}
          query={lastQuery}
          threadId={lastThreadId}
          visible={!!result}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-700/40 bg-dark-950 py-8 text-center">
        <p className="text-xs text-text-muted">
          Built with{" "}
          <span className="font-medium text-text-secondary">React</span> ·{" "}
          <span className="font-medium text-text-secondary">Express</span> ·{" "}
          <span className="font-medium text-text-secondary">FastAPI</span> ·{" "}
          <span className="font-medium text-text-secondary">LangGraph</span> ·{" "}
          <span className="font-medium text-text-secondary">PostgreSQL</span>
        </p>
        <p className="mt-1 text-xs text-text-muted">
          © {new Date().getFullYear()} Triply — AI Trip Planner
        </p>
      </footer>
    </div>
  );
}
