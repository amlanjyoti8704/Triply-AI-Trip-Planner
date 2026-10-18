import { useState } from "react";
import { Download, Copy, Check, Printer, Plane, Hotel, Calendar, Sparkles } from "lucide-react";

export default function TravelPlan({ result, query, threadId, visible }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  if (!visible || !result) return null;

  const { flight_results, hotel_results, itinerary, final_response, llm_calls } = result;

  const timestamp = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const markdownContent = `# Triply Travel Plan
**Destination Query:** ${query}
**Generated Date:** ${timestamp}
**Session Thread:** ${threadId}

---

## ✈️ Flight Details
${flight_results || "N/A"}

---

## 🏨 Hotel Recommendations
${hotel_results || "N/A"}

---

## 🗓️ Day-by-Day Itinerary
${itinerary || "N/A"}

---

## 🧠 Final Compiled Plan
${final_response || "N/A"}

---
*LLM Calls: ${llm_calls || 0} | Memory: Supabase PostgreSQL*
`;

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `triply_travel_plan_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const TABS = [
    { id: "all", label: "Full Plan" },
    { id: "itinerary", label: "Day-by-Day" },
    { id: "flights", label: "Flights" },
    { id: "hotels", label: "Hotels" },
  ];

  return (
    <section className="card-luxury p-6 sm:p-8 lg:p-10 mt-10 relative overflow-hidden animate-fade-in-up">
      {/* Stats strip */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 pb-6 border-b border-white/[0.08]">
        <StatChip label="Agents Deployed" value="4 Specialized" />
        <StatChip label="LLM Orchestrations" value={String(llm_calls || 4)} />
        <StatChip label="State Persistence" value="Supabase PostgreSQL" />
        <div className="ml-auto text-xs font-medium text-text-muted">
          Generated {timestamp}
        </div>
      </div>

      {/* Title and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Your Curated Travel Blueprint</h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Persisted session <code className="text-cyan-300 font-mono text-xs px-2 py-0.5 rounded-md bg-dark-950/80 border border-white/10">{threadId}</code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ActionButton onClick={handleCopy} icon={copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}>
            {copied ? "Copied to Clipboard" : "Copy Itinerary"}
          </ActionButton>
          <ActionButton onClick={handleDownload} icon={<Download className="h-4 w-4" />} accent>
            Download Markdown
          </ActionButton>
          <ActionButton onClick={handlePrint} icon={<Printer className="h-4 w-4" />}>
            Print / PDF
          </ActionButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 pb-4 mb-6 border-b border-white/[0.08] overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-brand-500/20 text-brand-300 border border-brand-400/40 shadow-md shadow-brand-500/10"
                : "bg-white/[0.03] text-text-secondary hover:text-white hover:bg-white/[0.06] border border-white/[0.06]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === "all" && (
          <div className="rounded-2xl border border-white/[0.06] bg-dark-950/50 p-5 sm:p-7">
            <FormattedPlan text={final_response} />
          </div>
        )}

        {activeTab === "itinerary" && (
          <div className="rounded-2xl border border-amber-500/15 bg-dark-950/50 p-5 sm:p-7">
            <h3 className="text-base font-bold text-amber-300 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Day-by-Day Schedule
            </h3>
            <FormattedPlan text={itinerary} />
          </div>
        )}

        {activeTab === "flights" && (
          <div className="rounded-2xl border border-sky-500/15 bg-dark-950/50 p-5 sm:p-7">
            <h3 className="text-base font-bold text-sky-300 mb-4 flex items-center gap-2">
              <Plane className="h-4 w-4" /> Flight Options
            </h3>
            <pre className="text-xs text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
              {flight_results || "No flight details recorded."}
            </pre>
          </div>
        )}

        {activeTab === "hotels" && (
          <div className="rounded-2xl border border-emerald-500/15 bg-dark-950/50 p-5 sm:p-7">
            <h3 className="text-base font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <Hotel className="h-4 w-4" /> Hotel Recommendations
            </h3>
            <pre className="text-xs text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
              {hotel_results || "No hotel details recorded."}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Sub-components ── */

function StatChip({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[0.6rem] font-medium text-text-muted uppercase tracking-wider">{label}</span>
      <span className="text-xs font-bold text-white bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.04]">{value}</span>
    </div>
  );
}

function ActionButton({ onClick, icon, children, accent }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.7rem] font-semibold transition-all ${
        accent
          ? "border border-brand-400/25 bg-brand-500/10 text-brand-300 hover:bg-brand-500/15"
          : "border border-white/[0.06] bg-white/[0.03] text-text-secondary hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

function FormattedPlan({ text }) {
  if (!text) return <p className="text-sm text-text-muted">No content available.</p>;

  return (
    <div className="max-w-none text-sm leading-[1.8] text-text-secondary space-y-2">
      {text.split("\n").map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1.5" />;

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={i} className="text-xl font-extrabold text-white pt-4 pb-1 border-b border-white/[0.06]">
              {trimmed.replace("# ", "")}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="text-lg font-bold text-white pt-4 pb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              {trimmed.replace("## ", "")}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="text-base font-bold text-white/90 pt-3">
              {trimmed.replace("### ", "")}
            </h3>
          );
        }

        // Day highlights
        if (/^(\*\*Day\s*\d+|Day\s*\d+)/i.test(trimmed)) {
          return (
            <div key={i} className="mt-3 p-3 rounded-xl bg-white/[0.02] border-l-3 border-l-brand-400 text-white font-semibold text-sm">
              {trimmed.replace(/\*\*/g, "")}
            </div>
          );
        }

        // Bullets
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-brand-400/60 mt-1.5 text-xs">•</span>
              <span className="text-text-secondary">{trimmed.replace(/^[-*]\s+/, "")}</span>
            </div>
          );
        }

        // Numbered
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-brand-400/80 font-bold text-xs mt-0.5">{trimmed.match(/^\d+\./)[0]}</span>
              <span className="text-text-secondary">{trimmed.replace(/^\d+\.\s+/, "")}</span>
            </div>
          );
        }

        return <p key={i}>{trimmed}</p>;
      })}
    </div>
  );
}
