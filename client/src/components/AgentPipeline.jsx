/**
 * AgentPipeline — renders real-time status cards for each agent
 * as SSE events stream in from the backend.
 */

const AGENT_ORDER = ["flight_agent", "hotel_agent", "itinerary_agent", "final_agent"];

const AGENT_META = {
  flight_agent: {
    icon: "✈️",
    label: "Flight Agent",
    description: "Searching flights via AviationStack API",
    gradient: "from-sky-500/20 to-blue-600/20",
    borderColor: "border-sky-500/30",
    accentColor: "text-sky-400",
  },
  hotel_agent: {
    icon: "🏨",
    label: "Hotel Agent",
    description: "Discovering hotels via Tavily Search",
    gradient: "from-emerald-500/20 to-teal-600/20",
    borderColor: "border-emerald-500/30",
    accentColor: "text-emerald-400",
  },
  itinerary_agent: {
    icon: "🗓️",
    label: "Itinerary Agent",
    description: "Crafting day-by-day itinerary with Groq LLM",
    gradient: "from-amber-500/20 to-orange-600/20",
    borderColor: "border-amber-500/30",
    accentColor: "text-amber-400",
  },
  final_agent: {
    icon: "🧠",
    label: "Final Agent",
    description: "Compiling your complete travel plan",
    gradient: "from-violet-500/20 to-purple-600/20",
    borderColor: "border-violet-500/30",
    accentColor: "text-violet-400",
  },
};

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent-400/30 border-t-accent-400" />
  );
}

function DotPulse() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-text-muted"
          style={{
            animation: "dotPulse 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </span>
  );
}

function AgentCard({ agentKey, status, data }) {
  const meta = AGENT_META[agentKey];
  if (!meta) return null;

  const isComplete = status === "complete";
  const isRunning = status === "running";
  const isPending = status === "pending";

  return (
    <div
      className={`
        animate-fade-in-up overflow-hidden rounded-xl border transition-all duration-500
        ${isComplete ? meta.borderColor : "border-dark-600/50"}
        ${isRunning ? "animate-pulse-glow" : ""}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center gap-3 px-5 py-3.5
          ${isComplete ? `bg-gradient-to-r ${meta.gradient}` : "bg-dark-800/60"}
        `}
      >
        <span className="text-xl">{meta.icon}</span>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${isComplete ? meta.accentColor : "text-text-primary"}`}>
            {meta.label}
          </p>
          <p className="text-xs text-text-muted">{meta.description}</p>
        </div>
        <div>
          {isComplete && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">
              ✓
            </span>
          )}
          {isRunning && <Spinner />}
          {isPending && <DotPulse />}
        </div>
      </div>

      {/* Body — show agent output when complete */}
      {isComplete && data && (
        <div className="border-t border-dark-600/30 bg-dark-900/40 px-5 py-4">
          <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-text-secondary">
            {data}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function AgentPipeline({ agentStatuses, visible }) {
  if (!visible) return null;

  return (
    <section className="animate-fade-in-up mt-8">
      {/* Section header */}
      <div className="mb-4 flex items-center gap-2 border-b border-dark-600/40 pb-3">
        <span className="text-lg">🤖</span>
        <h2 className="text-sm font-semibold tracking-wider text-text-primary uppercase">
          Agent Pipeline — Live
        </h2>
      </div>

      {/* Agent cards */}
      <div className="stagger-children space-y-3">
        {AGENT_ORDER.map((agentKey) => {
          const info = agentStatuses[agentKey] || { status: "pending", data: "" };
          return (
            <AgentCard
              key={agentKey}
              agentKey={agentKey}
              status={info.status}
              data={info.data}
            />
          );
        })}
      </div>
    </section>
  );
}
