import { useState } from "react";
import { Plane, Hotel, Calendar, Brain, CheckCircle2, Loader2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const AGENT_ORDER = ["flight_agent", "hotel_agent", "itinerary_agent", "final_agent"];

const AGENT_CONFIG = {
  flight_agent: {
    icon: Plane,
    label: "Flight Agent",
    tool: "AviationStack API",
    description: "Searching live airline databases for routes and availability",
    color: "sky",
    borderActive: "border-sky-500/25",
    bgGlow: "bg-sky-500/[0.06]",
    badgeBg: "bg-sky-500/15",
    badgeText: "text-sky-300",
    badgeBorder: "border-sky-500/25",
    iconColor: "text-sky-400",
  },
  hotel_agent: {
    icon: Hotel,
    label: "Hotel Agent",
    tool: "Tavily Search",
    description: "Finding top-rated stays and location-centric accommodations",
    color: "emerald",
    borderActive: "border-emerald-500/25",
    bgGlow: "bg-emerald-500/[0.06]",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-300",
    badgeBorder: "border-emerald-500/25",
    iconColor: "text-emerald-400",
  },
  itinerary_agent: {
    icon: Calendar,
    label: "Itinerary Agent",
    tool: "Groq LLM",
    description: "Crafting a day-by-day plan with attractions and timing",
    color: "amber",
    borderActive: "border-amber-500/25",
    bgGlow: "bg-amber-500/[0.06]",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-300",
    badgeBorder: "border-amber-500/25",
    iconColor: "text-amber-400",
  },
  final_agent: {
    icon: Brain,
    label: "Final Agent",
    tool: "PostgreSQL Memory",
    description: "Synthesizing the complete itinerary with cost breakdown",
    color: "violet",
    borderActive: "border-violet-500/25",
    bgGlow: "bg-violet-500/[0.06]",
    badgeBg: "bg-violet-500/15",
    badgeText: "text-violet-300",
    badgeBorder: "border-violet-500/25",
    iconColor: "text-violet-400",
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

  const completedCount = AGENT_ORDER.filter((key) => agentStatuses[key]?.status === "complete").length;
  const progressPercent = Math.round((completedCount / AGENT_ORDER.length) * 100);

  const toggleExpand = (agentKey) => {
    setExpandedAgents((prev) => ({ ...prev, [agentKey]: !prev[agentKey] }));
  };

  return (
    <section className="card-luxury p-6 sm:p-8 mt-10 relative overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>Agent Pipeline Orchestration</span>
              <span className="text-xs font-bold text-brand-300 bg-brand-500/15 px-2.5 py-0.5 rounded-lg border border-brand-400/30">
                {completedCount}/4 Completed
              </span>
            </h3>
            <p className="text-xs text-text-secondary mt-1">Real-time live streaming outputs from autonomous travel agents</p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-brand-300 tabular-nums">{progressPercent}%</span>
            <div className="w-36 h-2 rounded-full bg-dark-950/80 overflow-hidden border border-white/10 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400 transition-all duration-700 ease-out rounded-full shadow-lg shadow-brand-500/50"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Agent cards */}
      <div className="space-y-3">
        {AGENT_ORDER.map((agentKey) => {
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
              className={`rounded-2xl border transition-all duration-400 overflow-hidden ${
                isComplete
                  ? `${cfg.borderActive} ${cfg.bgGlow}`
                  : isRunning
                  ? "border-cyan-400/30 bg-dark-900/80 ring-1 ring-cyan-400/15"
                  : "border-white/[0.04] bg-dark-950/30 opacity-50"
              }`}
            >
              {/* Header bar */}
              <div
                onClick={() => (isComplete ? toggleExpand(agentKey) : null)}
                className={`p-4 flex items-center justify-between gap-3 ${isComplete ? "cursor-pointer hover:bg-white/[0.02]" : ""} transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                      isComplete
                        ? `${cfg.badgeBg} ${cfg.badgeBorder}`
                        : isRunning
                        ? "bg-cyan-500/15 border-cyan-400/25"
                        : "bg-white/[0.03] border-white/[0.04]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isComplete ? cfg.iconColor : isRunning ? "text-cyan-400" : "text-text-muted"}`} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold tracking-tight ${isPending ? "text-text-muted" : "text-white"}`}>{cfg.label}</h4>
                      <span className="text-[0.6rem] font-medium text-text-muted px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.04] hidden sm:inline">
                        {cfg.tool}
                      </span>
                    </div>
                    <p className="text-[0.68rem] text-text-muted mt-0.5 hidden sm:block">{cfg.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isComplete && (
                    <span className="flex items-center gap-1 text-[0.68rem] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/15">
                      <CheckCircle2 className="h-3 w-3" /> Done
                    </span>
                  )}

                  {isRunning && (
                    <span className="flex items-center gap-1 text-[0.68rem] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20 agent-running-bar">
                      <Loader2 className="h-3 w-3 animate-spin" /> Working
                    </span>
                  )}

                  {isPending && (
                    <span className="text-[0.62rem] font-medium text-text-muted/60">
                      Queued
                    </span>
                  )}

                  {isComplete && (
                    <button className="text-text-muted hover:text-white p-0.5 transition-colors">
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable content */}
              {isComplete && isExpanded && data && (
                <div className="border-t border-white/[0.04] bg-dark-950/60 p-4">
                  {agentKey === "flight_agent" && <FlightRenderer rawData={data} />}
                  {agentKey === "hotel_agent" && <HotelRenderer rawData={data} />}
                  {(agentKey === "itinerary_agent" || agentKey === "final_agent") && (
                    <div className="text-xs leading-relaxed text-text-secondary whitespace-pre-wrap font-mono bg-dark-950/60 p-4 rounded-xl border border-white/[0.04] max-h-64 overflow-y-auto">
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

/* ── Sub-renderers ── */

function FlightRenderer({ rawData }) {
  const flightBlocks = rawData
    .split("\n\n")
    .map((b) => b.trim())
    .filter(Boolean);

  if (!flightBlocks.length || rawData.includes("Error") || rawData.includes("No flight data")) {
    return <p className="text-xs text-text-muted">{rawData}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {flightBlocks.map((block, i) => (
        <div key={i} className="p-3 rounded-xl border border-sky-500/15 bg-sky-500/[0.04]">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.04]">
            <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
              <Plane className="h-3 w-3" />
              {block.split("\n")[0] || "Flight"}
            </span>
            <span className="text-[0.58rem] font-medium text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <pre className="text-[0.68rem] text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {items.map((item, i) => {
        const titleMatch = item.match(/\*\*(.*?)\*\*/);
        const title = titleMatch ? titleMatch[1] : `Hotel #${i + 1}`;
        const urlMatch = item.match(/https?:\/\/[^\s]+/);
        const url = urlMatch ? urlMatch[0] : null;
        const snippet = item.replace(/^\d+\.\s+\*\*.*?\*\*\s*/, "").replace(/https?:\/\/[^\s]+/, "").trim();

        return (
          <div key={i} className="p-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04]">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-white line-clamp-1">{title}</span>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400/70 hover:text-emerald-300 shrink-0"
                  title="View source"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <p className="text-[0.68rem] text-text-muted line-clamp-3 leading-relaxed">{snippet}</p>
          </div>
        );
      })}
    </div>
  );
}
