import { useState } from "react";
import DestinationStrip from "./DestinationStrip";

const QUICK_PROMPTS = [
  "7-day Japan under ₹2L",
  "Paris trip for 5 days",
  "Dubai weekend getaway",
  "Bali backpacking 10 days",
];

export default function TripForm({ onSubmit, isLoading }) {
  const [query, setQuery] = useState("");
  const [threadId, setThreadId] = useState("user_triply");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim(), threadId.trim());
    }
  };

  const fillQuery = (text) => {
    setQuery(text);
  };

  return (
    <section className="animate-fade-in-up glass-card p-6 md:p-8" style={{ animationDelay: "0.15s" }}>
      <form onSubmit={handleSubmit}>
        {/* Section label */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg">🗺️</span>
          <h2 className="text-sm font-semibold tracking-wider text-accent-400 uppercase">
            Describe Your Trip
          </h2>
        </div>

        {/* Quick prompts */}
        <div className="mb-4 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => fillQuery(prompt)}
              className="rounded-full border border-dark-500/60 bg-dark-700/50 px-3.5 py-1.5 text-xs font-medium text-text-secondary transition-all duration-200 hover:border-accent-400/40 hover:bg-dark-600/50 hover:text-text-primary"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          id="trip-query-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Plan a complete 7-day Japan trip including flights, hotels and sightseeing under ₹2 lakhs"
          rows={4}
          className="mb-4 w-full resize-none rounded-xl border border-dark-500/50 bg-dark-800/60 px-4 py-3.5 text-sm leading-relaxed text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/10"
        />

        {/* Thread ID */}
        <div className="mb-5 flex items-center gap-3">
          <label
            htmlFor="thread-id-input"
            className="shrink-0 text-xs font-semibold tracking-wider text-text-muted uppercase"
          >
            👤 Session ID
          </label>
          <input
            id="thread-id-input"
            type="text"
            value={threadId}
            onChange={(e) => setThreadId(e.target.value)}
            className="flex-1 rounded-lg border border-dark-500/50 bg-dark-800/60 px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/10"
          />
        </div>

        {/* Submit */}
        <button
          id="generate-plan-btn"
          type="submit"
          disabled={isLoading || !query.trim()}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2.5">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              AI Agents Working…
            </span>
          ) : (
            "🚀  Generate My Travel Plan"
          )}
        </button>
      </form>

      {/* Destination strip */}
      <DestinationStrip onSelect={fillQuery} />
    </section>
  );
}
