import { useState } from "react";
import { Sparkles, Clock, Compass, X, ArrowRight } from "lucide-react";

const VIBES = [
  { id: "adventure", label: "🧗 Adventure", append: "focus on outdoor adventures and hiking" },
  { id: "romantic", label: "💍 Romantic", append: "romantic ambiance with scenic views and candlelit dinners" },
  { id: "leisure", label: "🌴 Relaxing", append: "laid-back relaxation, tranquil beaches and serene cafes" },
  { id: "family", label: "👨‍👩‍👧 Family", append: "kid-friendly attractions, family suites and comfortable transit" },
  { id: "budget", label: "🎒 Budget", append: "budget-friendly stays, public transit and street food gems" },
  { id: "luxury", label: "✨ Luxury", append: "5-star luxury boutique hotels, private transfers and fine dining" },
  { id: "culinary", label: "🍜 Culinary", append: "food tour with local culinary hotspots, wine tastings and markets" },
];

const DURATIONS = ["3 Days", "5 Days", "7 Days", "10 Days", "14 Days"];

const QUICK_PROMPTS = [
  { label: "🇯🇵 7-day Japan under ₹2L", query: "Plan a complete 7-day Japan trip to Tokyo & Kyoto with flights from Delhi, boutique hotels, and day trips under ₹2 lakhs" },
  { label: "🇫🇷 5-day Romantic Paris", query: "5-day romantic Paris getaway exploring the Louvre, Eiffel Tower, cafes and boutique hotels for a couple" },
  { label: "🇦🇪 Luxury Dubai Weekend", query: "4-day luxury Dubai weekend trip with Burj Khalifa, desert safari and private beach clubs" },
  { label: "🇮🇩 10-day Bali Adventure", query: "10-day Bali trip covering Ubud rice terraces, Canggu surf spots, temples and Nusa Penida boat tour" },
  { label: "🇨🇭 Swiss Alps Rail Tour", query: "7-day scenic Swiss Alps winter vacation including Glacier Express, Zermatt Matterhorn and cozy ski chalets" },
];

export default function TripForm({ onSubmit, onAbort, isLoading, externalQuery, threadId }) {
  const [query, setQuery] = useState(externalQuery || "");
  const [selectedDuration, setSelectedDuration] = useState("7 Days");
  const [selectedVibe, setSelectedVibe] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim(), threadId || "aarohi_user");
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

  return (
    <section id="trip-builder" className="card-luxury p-6 sm:p-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/10 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 blur-[90px] pointer-events-none rounded-full" />

      <form onSubmit={handleSubmit} className="relative z-10">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-brand-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Craft Your Custom Itinerary
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Specify your destination, dates, budget or preferences, and let the 4 agents assemble the plan.
            </p>
          </div>
        </div>

        {/* Filter Selection Rows */}
        <div className="space-y-4 mb-5">
          {/* Duration Selector */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              <Clock className="h-3.5 w-3.5 text-brand-400" />
              <span>Trip Duration</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {DURATIONS.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => handleDurationClick(dur)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 border ${
                    selectedDuration === dur
                      ? "border-brand-400 bg-brand-500/20 text-brand-300 shadow-md shadow-brand-500/15"
                      : "border-white/[0.08] bg-white/[0.03] text-text-secondary hover:border-white/20 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style Selector */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Travel Style & Vibe</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {VIBES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleVibeClick(v)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 border ${
                    selectedVibe === v.id
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-md shadow-cyan-500/15"
                      : "border-white/[0.08] bg-white/[0.03] text-text-secondary hover:border-white/20 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="relative mb-4">
          <textarea
            id="trip-query-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Plan a 7-day trip to Tokyo and Kyoto for 2 people with flights from Delhi, boutique hotels, scenic train passes, and authentic sushi spots — budget ₹2.5 lakhs"
            rows={3}
            className="w-full resize-none rounded-2xl border border-white/[0.12] bg-dark-950/70 p-4 sm:p-5 text-sm sm:text-base leading-relaxed text-white placeholder:text-text-muted/60 outline-none input-focus-ring font-[var(--font-body)]"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-text-muted hover:text-white hover:bg-white/[0.12] transition-colors"
              title="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mb-6">
          <div className="text-[0.68rem] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>Inspiration Prompts:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => setQuery(prompt.query)}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-white hover:border-brand-400/40 hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
              >
                <span>{prompt.label}</span>
                <ArrowRight className="h-3 w-3 opacity-40" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="generate-plan-btn"
            type="submit"
            disabled={isLoading || !query.trim()}
            className="btn-primary w-full sm:flex-1 py-3.5 text-sm sm:text-base font-bold shadow-xl"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                <span>Orchestrating 4 Agents...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-amber-300" />
                <span>Generate Complete Travel Plan</span>
              </>
            )}
          </button>

          {isLoading && onAbort && (
            <button
              type="button"
              onClick={onAbort}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-red-500/30 bg-red-500/15 text-red-200 text-sm font-bold hover:bg-red-500/25 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
