import { useState } from "react";
import { Plane, Hotel, Calendar, Brain, CheckCircle2, Loader2, ChevronDown, ChevronUp, ExternalLink, Activity } from "lucide-react";

const AGENT_ORDER = ["flight_agent", "hotel_agent", "itinerary_agent", "final_agent"];

const AGENT_CONFIG = {
  flight_agent: {
    icon: Plane,
    label: "Flight Agent",
    tool: "AviationStack API",
    description: "Scanning live airline databases for schedule, routes and real-time availability",
    color: "sky",
    borderClass: "border-sky-500/30",
    glowClass: "shadow-sky-500/10",
    gradientClass: "from-sky-500/15 via-blue-600/10 to-transparent",
    badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  },
  hotel_agent: {
    icon: Hotel,
    label: "Hotel Agent",
    tool: "Tavily Search Engine",
    description: "Finding top-rated hotels, boutique stays, and location-centric accommodations",
    color: "emerald",
    borderClass: "border-emerald-500/30",
    glowClass: "shadow-emerald-500/10",
    gradientClass: "from-emerald-500/15 via-teal-600/10 to-transparent",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  itinerary_agent: {
    icon: Calendar,
    label: "Itinerary Agent",
    tool: "Groq LLaMA 3.3 70B",
    description: "Designing a synchronized day-by-day plan with attractions, timings and food stops",
    color: "amber",
    borderClass: "border-amber-500/30",
    glowClass: "shadow-amber-500/10",
    gradientClass: "from-amber-500/15 via-orange-600/10 to-transparent",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  final_agent: {
    icon: Brain,
    label: "Final Agent",
    tool: "PostgreSQL Memory",
    description: "Synthesizing full itinerary, cost breakdown, travel essentials and saving context",
    color: "violet",
    borderClass: "border-violet-500/30",
    glowClass: "shadow-violet-500/10",
    gradientClass: "from-violet-500/15 via-purple-600/10 to-transparent",
    badgeClass: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
};

export default function AgentPipeline({ agentStatuses, visible }) {
  const [expandedAgents, setExpandedAgents] = useState({
    flight_agent: true,
    hotel_agent: true,
    itinerary_agent: false,
    final_agent: false,
  });

  if (!visible) return null;

  // Calculate progress percentage
  const completedCount = AGENT_ORDER.filter((key) => agentStatuses[key]?.status === "complete").length;
  const progressPercent = Math.round((completedCount / AGENT_ORDER.length) * 100);

  const toggleExpand = (agentKey) => {
    setExpandedAgents((prev) => ({ ...prev, [agentKey]: !prev[agentKey] }));
  };

  return (
    <section className="glass-panel p-6 sm:p-8 mt-10 border border-white/10 relative overflow-hidden animate-fade-in-up">
      {/* Header & Progress Bar */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 text-cyan-400 border border-brand-500/30">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Live Agent Orchestration
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[0.68rem] font-bold text-cyan-300 border border-cyan-500/30">
                  {completedCount} / 4 Completed
                </span>
              </h3>
              <p className="text-xs text-text-muted">LangGraph streaming updates sequentially to client</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-cyan-400">{progressPercent}%</span>
            <div className="w-36 h-2 rounded-full bg-dark-900 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Agents Timeline List */}
      <div className="space-y-4">
        {AGENT_ORDER.map((agentKey, index) => {
          const cfg = AGENT_CONFIG[agentKey];
          const status = agentStatuses[agentKey]?.status || "pending";
          const data = agentStatuses[agentKey]?.data || "";
          const isComplete = status === "complete";
          const isRunning = status === "running";
          const isPending = status === "pending";
          const isExpanded = expandedAgents[agentKey] ?? isComplete;
          const Icon = cfg.icon;

          return (
            <div
              key={agentKey}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isComplete
                  ? `${cfg.borderClass} bg-dark-900/70 shadow-lg ${cfg.glowClass}`
                  : isRunning
                  ? "border-cyan-400/50 bg-dark-900/90 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-400/30"
                  : "border-white/5 bg-dark-950/40 opacity-70"
              }`}
            >
              {/* Card Header Bar */}
              <div
                onClick={() => (isComplete ? toggleExpand(agentKey) : null)}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                  isComplete ? `bg-gradient-to-r ${cfg.gradientClass}` : ""
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      isComplete
                        ? `${cfg.badgeClass}`
                        : isRunning
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                        : "bg-white/5 text-text-muted border-white/5"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white tracking-tight">{cfg.label}</h4>
                      <span className="text-[0.65rem] font-semibold text-text-muted px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                        {cfg.tool}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 hidden sm:block">{cfg.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isComplete && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Done
                    </span>
                  )}

                  {isRunning && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-500/30 animate-pulse">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" /> Running
                    </span>
                  )}

                  {isPending && (
                    <span className="text-[0.68rem] font-medium text-text-muted px-2 py-0.5 rounded bg-white/5">
                      Waiting
                    </span>
                  )}

                  {isComplete && (
                    <button className="text-text-muted hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Preview Area */}
              {isComplete && isExpanded && data && (
                <div className="border-t border-white/5 bg-dark-950/80 p-5">
                  {agentKey === "flight_agent" && <FlightRenderer rawData={data} />}
                  {agentKey === "hotel_agent" && <HotelRenderer rawData={data} />}
                  {(agentKey === "itinerary_agent" || agentKey === "final_agent") && (
                    <div className="prose-invert max-w-none text-xs leading-relaxed text-text-secondary whitespace-pre-wrap font-mono bg-black/40 p-4 rounded-xl border border-white/5 max-h-72 overflow-y-auto">
                      {data}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Specialized Sub-renderers ────────────────────────────────────────────────

function FlightRenderer({ rawData }) {
  const flightBlocks = rawData
    .split("\n\n")
    .map((b) => b.trim())
    .filter(Boolean);

  if (!flightBlocks.length || rawData.includes("Error") || rawData.includes("No flight data")) {
    return <p className="text-xs text-text-muted">{rawData}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {flightBlocks.map((block, i) => (
        <div key={i} className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <Plane className="h-3.5 w-3.5" />
              {block.split("\n")[0] || "Flight"}
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
          <pre className="text-[0.72rem] text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
            {block.split("\n").slice(1).join("\n")}
          </pre>
        </div>
      ))}
    </div>
  );
}

function HotelRenderer({ rawData }) {
  const items = rawData
    .split(/\n\n(?=\d+\.\s+\*\*)/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length || rawData.includes("Error") || rawData.includes("No search results")) {
    return <p className="text-xs text-text-muted">{rawData}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item, i) => {
        const titleMatch = item.match(/\*\*(.*?)\*\*/);
        const title = titleMatch ? titleMatch[1] : `Hotel #${i + 1}`;
        const urlMatch = item.match(/https?:\/\/[^\s]+/);
        const url = urlMatch ? urlMatch[0] : null;
        const snippet = item.replace(/^\d+\.\s+\*\*.*?\*\*\s*/, "").replace(/https?:\/\/[^\s]+/, "").trim();

        return (
          <div key={i} className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-white line-clamp-1">{title}</span>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 p-1"
                    title="View Hotel Source"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <p className="text-[0.72rem] text-text-muted line-clamp-3 leading-relaxed">{snippet}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
