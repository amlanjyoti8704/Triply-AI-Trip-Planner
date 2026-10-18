import { Plane, Hotel, Calendar, Brain, Sparkles, Compass, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-10">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-brand-600/20 via-cyan-500/15 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-violet-600/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Hero Container */}
      <div className="relative mx-auto max-w-5xl text-center px-4">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur-xl mb-6 shadow-lg shadow-cyan-500/10">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="tracking-wider uppercase">Next-Gen Multi-Agent Architecture</span>
          <span className="text-cyan-500">•</span>
          <span className="text-white/80">LangGraph Powered</span>
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          Dream Trips Planned by{" "}
          <span className="gradient-text block mt-1">Autonomous AI Agents</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up mx-auto max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed mb-10">
          Describe where you want to go. Four cooperative agents search live flights,
          discover handpicked stays, and structure an unforgettable day-by-day itinerary
          streamed directly to your screen.
        </p>

        {/* Agent Cards Showcase */}
        <div className="animate-fade-in-up grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
          <AgentBadge
            icon={<Plane className="h-4 w-4 text-sky-400" />}
            name="Flight Agent"
            sub="AviationStack Live"
            border="border-sky-500/20 hover:border-sky-500/40"
            bg="bg-sky-500/5"
          />
          <AgentBadge
            icon={<Hotel className="h-4 w-4 text-emerald-400" />}
            name="Hotel Agent"
            sub="Tavily Web Search"
            border="border-emerald-500/20 hover:border-emerald-500/40"
            bg="bg-emerald-500/5"
          />
          <AgentBadge
            icon={<Calendar className="h-4 w-4 text-amber-400" />}
            name="Itinerary Agent"
            sub="Groq LLaMA 3.3 70B"
            border="border-amber-500/20 hover:border-amber-500/40"
            bg="bg-amber-500/5"
          />
          <AgentBadge
            icon={<Brain className="h-4 w-4 text-violet-400" />}
            name="Final Agent"
            sub="Supabase Memory"
            border="border-violet-500/20 hover:border-violet-500/40"
            bg="bg-violet-500/5"
          />
        </div>

        {/* Stats Row */}
        <div className="animate-fade-in-up flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-text-muted border-t border-white/5 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-text-secondary font-medium">PostgreSQL Checkpointer</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <span className="text-text-secondary font-medium">Real-Time SSE Streaming</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-text-secondary font-medium">End-to-End Full Stack</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentBadge({ icon, name, sub, border, bg }) {
  return (
    <div
      className={`glass-panel p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 ${border} ${bg} hover:scale-105 hover:shadow-xl`}
    >
      <div className="mb-2 p-2 rounded-xl bg-white/5">{icon}</div>
      <span className="text-xs font-bold text-white tracking-tight">{name}</span>
      <span className="text-[0.65rem] font-medium text-text-muted mt-0.5">{sub}</span>
    </div>
  );
}
