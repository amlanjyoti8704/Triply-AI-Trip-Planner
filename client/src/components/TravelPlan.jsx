/**
 * TravelPlan — renders the final compiled travel plan
 * with metrics bar, formatted content, and download button.
 */

export default function TravelPlan({ result, query, threadId, visible }) {
  if (!visible || !result) return null;

  const { flight_results, hotel_results, itinerary, final_response, llm_calls } = result;

  const timestamp = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Build downloadable markdown content
  const markdownContent = `# Travel Plan
**Query:** ${query}
**Generated:** ${timestamp}
**User ID:** ${threadId}

---

## ✈️ Flight Information
${flight_results || "N/A"}

---

## 🏨 Hotel Information
${hotel_results || "N/A"}

---

## 🗓️ Itinerary
${itinerary || "N/A"}

---

## 🧠 Final Travel Plan
${final_response || "N/A"}

---
*LLM Calls: ${llm_calls || 0}*
`;

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `travel_plan_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="animate-fade-in-up mt-8 space-y-6">
      {/* ── Metrics bar ── */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard value="4" label="Agents Run" />
        <MetricCard value={String(llm_calls || 0)} label="LLM Calls" />
        <MetricCard value="✅" label="Status" />
      </div>

      {/* ── Final plan ── */}
      <div>
        <div className="mb-4 flex items-center gap-2 border-b border-dark-600/40 pb-3">
          <span className="text-lg">🧠</span>
          <h2 className="text-sm font-semibold tracking-wider text-text-primary uppercase">
            Final Travel Plan
          </h2>
        </div>

        <div className="rounded-2xl border border-accent-400/15 border-l-4 border-l-accent-400/60 bg-gradient-to-br from-dark-800/80 to-dark-900/90 p-6 md:p-8">
          <div className="prose-invert max-w-none text-sm leading-[1.85] text-text-secondary">
            {final_response.split("\n").map((line, i) => {
              if (!line.trim()) return <br key={i} />;

              // Headings
              if (line.startsWith("### "))
                return (
                  <h3 key={i} className="mb-2 mt-5 text-base font-bold text-text-primary">
                    {line.replace("### ", "")}
                  </h3>
                );
              if (line.startsWith("## "))
                return (
                  <h2 key={i} className="mb-3 mt-6 text-lg font-bold text-accent-400">
                    {line.replace("## ", "")}
                  </h2>
                );
              if (line.startsWith("# "))
                return (
                  <h1 key={i} className="mb-4 mt-6 text-xl font-extrabold text-text-primary">
                    {line.replace("# ", "")}
                  </h1>
                );

              // Bold markers
              if (line.startsWith("**") && line.endsWith("**"))
                return (
                  <p key={i} className="mt-3 font-semibold text-text-primary">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );

              // Bullet points
              if (line.trimStart().startsWith("- ") || line.trimStart().startsWith("* "))
                return (
                  <li key={i} className="ml-5 list-disc text-text-secondary">
                    {line.replace(/^\s*[-*]\s/, "")}
                  </li>
                );

              // Numbered list
              if (/^\s*\d+[.)]\s/.test(line))
                return (
                  <li key={i} className="ml-5 list-decimal text-text-secondary">
                    {line.replace(/^\s*\d+[.)]\s/, "")}
                  </li>
                );

              return <p key={i}>{line}</p>;
            })}
          </div>
        </div>
      </div>

      {/* ── Download bar ── */}
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dark-600/40 bg-dark-800/40 p-4 sm:flex-row sm:items-center">
        <button
          id="download-plan-btn"
          onClick={handleDownload}
          className="shrink-0 rounded-lg border border-accent-400/30 bg-accent-400/10 px-5 py-2.5 text-sm font-semibold text-accent-400 transition-all duration-200 hover:bg-accent-400/20"
        >
          ⬇️ Download Plan
        </button>
        <p className="text-xs text-text-muted">
          Generated on <span className="text-text-secondary">{timestamp}</span> • Session{" "}
          <code className="rounded bg-dark-700/60 px-1.5 py-0.5 text-accent-400">{threadId}</code>
        </p>
      </div>
    </section>
  );
}

function MetricCard({ value, label }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center px-4 py-5 text-center">
      <span className="text-2xl font-extrabold text-accent-400 md:text-3xl">{value}</span>
      <span className="mt-1 text-[0.65rem] font-semibold tracking-widest text-text-muted uppercase">
        {label}
      </span>
    </div>
  );
}
