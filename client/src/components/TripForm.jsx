import { useState } from "react";
import { Sparkles, Send, RefreshCw, Compass, Clock, Heart, DollarSign, X } from "lucide-react";
import DestinationStrip from "./DestinationStrip";

const VIBES = [
  { id: "adventure", label: "🧗 Adventure", append: "focus on outdoor adventures and hiking" },
  { id: "romantic", label: "💍 Romantic", append: "romantic ambiance with candlelit dinners" },
  { id: "leisure", label: "🌴 Relaxing", append: "laid-back relaxation, beaches and cafes" },
  { id: "family", label: "👨‍👩‍👧 Family", append: "kid-friendly attractions and easy transit" },
  { id: "budget", label: "🎒 Budget", append: "budget-friendly stays and street food" },
  { id: "luxury", label: "✨ Luxury", append: "5-star luxury hotels and fine dining" },
];

const DURATIONS = ["3 Days", "5 Days", "7 Days", "10 Days", "14 Days"];

const QUICK_PROMPTS = [
  "7-day Japan under ₹2L",
  "Paris romantic 5 days",
  "Dubai luxury weekend",
  "Bali 10 days backpacking",
  "Swiss Alps scenic rail tour",
];

export default function TripForm({ onSubmit, onAbort, isLoading }) {
  const [query, setQuery] = useState("");
  const [threadId, setThreadId] = useState("aarohi_user");
  const [selectedDuration, setSelectedDuration] = useState("7 Days");
  const [selectedVibe, setSelectedVibe] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim(), threadId.trim());
    }
  };

  const handleVibeClick = (vibe) => {
    if (selectedVibe === vibe.id) {
      setSelectedVibe(null);
    } else {
      setSelectedVibe(vibe.id);
      if (!query.toLowerCase().includes(vibe.id)) {
        setQuery((prev) => (prev ? `${prev}, with ${vibe.append}` : `A trip with ${vibe.append}`));
      }
    }
  };

  const handleDurationClick = (duration) => {
    setSelectedDuration(duration);
    if (!query) {
      setQuery(`A ${duration} trip to `);
    } else if (!query.toLowerCase().includes(duration.toLowerCase())) {
      setQuery((prev) => `${duration} ` + prev.replace(/\b\d+\s*days?\b/i, "").trim());
    }
  };

  const generateNewThread = () => {
    const newId = `user_${Math.random().toString(36).substring(2, 8)}`;
    setThreadId(newId);
  };

  return (
    <section id="trip-builder" className="glass-panel p-6 sm:p-8 lg:p-10 border border-white/10 relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-lg shadow-brand-500/30">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Trip Customizer
                <span className="text-[0.65rem] font-semibold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
                  AI Ready
                </span>
              </h2>
              <p className="text-xs text-text-muted">Fill your preferences or pick a quick destination</p>
            </div>
          </div>

          {/* Session / Memory control */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-dark-900/80 px-3 py-1.5 backdrop-blur-md">
            <span className="text-[0.68rem] font-bold text-text-muted uppercase tracking-wider">Memory Thread:</span>
            <input
              type="text"
              value={threadId}
              onChange={(e) => setThreadId(e.target.value)}
              className="w-28 bg-transparent text-xs font-semibold text-cyan-300 outline-none"
              title="Session ID saved in Supabase PostgreSQL"
            />
            <button
              type="button"
              onClick={generateNewThread}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors"
              title="Reset memory and start fresh session"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Filter bar: Duration & Style */}
        <div className="space-y-4 mb-6">
          {/* Duration Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-text-muted mr-1">
              <Clock className="h-3.5 w-3.5" /> Duration:
            </span>
            {DURATIONS.map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => handleDurationClick(dur)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 border ${
                  selectedDuration === dur
                    ? "border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-md shadow-cyan-500/20"
                    : "border-white/10 bg-dark-900/50 text-text-secondary hover:border-white/20 hover:text-white"
                }`}
              >
                {dur}
              </button>
            ))}
          </div>

          {/* Vibe / Style Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-text-muted mr-1">
              <Heart className="h-3.5 w-3.5" /> Style:
            </span>
            {VIBES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => handleVibeClick(v)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 border ${
                  selectedVibe === v.id
                    ? "border-brand-400 bg-brand-500/20 text-brand-200 shadow-md shadow-brand-500/20"
                    : "border-white/10 bg-dark-900/50 text-text-secondary hover:border-white/20 hover:text-white"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Query Textarea */}
        <div className="relative mb-4 group">
          <textarea
            id="trip-query-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Plan a complete 7-day Japan trip including flights, hotels and sightseeing under ₹2 lakhs"
            rows={4}
            className="w-full resize-none rounded-2xl border border-white/10 bg-dark-950/70 p-4 sm:p-5 text-sm sm:text-base leading-relaxed text-white placeholder:text-text-muted outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-dark-950 focus:ring-4 focus:ring-cyan-500/10 shadow-inner"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Prompts Row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Quick:</span>
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setQuery(prompt)}
              className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-xs text-text-muted hover:text-cyan-300 hover:border-cyan-400/30 hover:bg-cyan-500/5 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="generate-plan-btn"
            type="submit"
            disabled={isLoading || !query.trim()}
            className="btn-primary w-full sm:flex-1 py-4 text-base"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>AI Agents Collaborating…</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Autonomous Travel Plan</span>
              </>
            )}
          </button>

          {isLoading && onAbort && (
            <button
              type="button"
              onClick={onAbort}
              className="w-full sm:w-auto px-5 py-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-semibold hover:bg-red-500/20 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Destination Grid */}
      <DestinationStrip onSelect={(q) => setQuery(q)} />
    </section>
  );
}
