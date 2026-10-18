import { Plane, Hotel, Calendar, Brain, ArrowDown, Sparkles } from "lucide-react";

const AGENTS = [
  {
    step: "01",
    icon: Plane,
    label: "Flight Scout",
    sub: "Live routes & airline fares",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  {
    step: "02",
    icon: Hotel,
    label: "Stay Curator",
    sub: "Boutique & luxury lodging",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    step: "03",
    icon: Calendar,
    label: "Itinerary Architect",
    sub: "Day-by-day tailored plans",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    step: "04",
    icon: Brain,
    label: "Master Synthesis",
    sub: "Harmonized budget & bookings",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
];

export default function Hero() {
  return (
    <section className="relative w-full max-w-full pt-6 sm:pt-8 pb-8 text-center">
      <div className="relative mx-auto w-full max-w-full px-2">
        {/* Eyebrow badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3.5 py-1 backdrop-blur-md mb-5 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span className="text-[0.68rem] font-bold uppercase tracking-wider text-brand-300">
            Autonomous Multi-Agent Travel Orchestration
          </span>
        </div>

        {/* Main Title */}
        <h1 className="animate-fade-in-up text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.12] mb-4">
          Your dream trip,{" "}
          <span className="gradient-text">curated by AI.</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up mx-auto max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed mb-8 font-[var(--font-body)]">
          Tell us where you want to wander. Four autonomous AI agents collaborate in real-time to
          scout flights, handpick unique stays, craft day-by-day itineraries, and optimize your complete budget.
        </p>

        {/* Agent Workflow Showcase - Compact 4-col */}
        <div className="animate-fade-in-up grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-6 text-left">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.label}
                className={`group relative rounded-2xl border ${agent.border} ${agent.bg} p-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08] ${agent.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[0.6rem] font-bold text-text-muted font-mono tracking-wider">
                    {agent.step}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                  {agent.label}
                </h4>
                <p className="text-[0.65rem] text-text-muted mt-0.5 leading-snug line-clamp-1">
                  {agent.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Scroll hint */}
        <a
          href="#trip-builder"
          className="animate-fade-in-up inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-white transition-colors no-underline"
        >
          <span>Configure your journey below</span>
          <ArrowDown className="h-3 w-3 animate-float text-brand-400" />
        </a>
      </div>
    </section>
  );
}
