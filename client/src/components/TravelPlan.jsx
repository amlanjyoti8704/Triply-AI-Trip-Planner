import { useState } from "react";
import { Download, Copy, Check, Printer, Sparkles, Plane, Hotel, Calendar, Coins, ShieldCheck, Share2 } from "lucide-react";

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

  return (
    <section className="glass-panel p-6 sm:p-8 lg:p-10 mt-10 border border-white/10 relative overflow-hidden animate-fade-in-up">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <MetricCard label="Autonomous Agents" value="4 Active" icon={<Sparkles className="h-4 w-4 text-brand-400" />} />
        <MetricCard label="LLM Inference Calls" value={String(llm_calls || 4)} icon={<Coins className="h-4 w-4 text-amber-400" />} />
        <MetricCard label="Memory Storage" value="Postgres" icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />} />
        <MetricCard label="Pipeline Status" value="100% Ready" icon={<Check className="h-4 w-4 text-cyan-400" />} />
      </div>

      {/* Main Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Travel Synthesis</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Your Curated Itinerary</h2>
          <p className="text-xs text-text-muted mt-1">
            Generated on <span className="text-text-secondary">{timestamp}</span> • Session:{" "}
            <code className="text-cyan-300 font-mono">{threadId}</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-white/10 transition-colors"
            title="Copy entire plan to clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/20 transition-colors"
            title="Download plan as Markdown file"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-white/10 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-6 border-b border-white/5">
        <TabButton id="all" label="Full Travel Plan" active={activeTab === "all"} onClick={() => setActiveTab("all")} />
        <TabButton id="itinerary" label="Day-by-Day" active={activeTab === "itinerary"} onClick={() => setActiveTab("itinerary")} />
        <TabButton id="flights" label="Flights" active={activeTab === "flights"} onClick={() => setActiveTab("flights")} />
        <TabButton id="hotels" label="Hotels" active={activeTab === "hotels"} onClick={() => setActiveTab("hotels")} />
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {activeTab === "all" && (
          <div className="rounded-2xl border border-brand-500/20 bg-dark-950/60 p-6 sm:p-8">
            <FormattedPlan text={final_response} />
          </div>
        )}

        {activeTab === "itinerary" && (
          <div className="rounded-2xl border border-amber-500/20 bg-dark-950/60 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Detailed Day-by-Day Schedule
            </h3>
            <FormattedPlan text={itinerary} />
          </div>
        )}

        {activeTab === "flights" && (
          <div className="rounded-2xl border border-sky-500/20 bg-dark-950/60 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-sky-300 mb-4 flex items-center gap-2">
              <Plane className="h-5 w-5" /> Live Flight Options
            </h3>
            <pre className="text-xs text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
              {flight_results || "No flight details recorded."}
            </pre>
          </div>
        )}

        {activeTab === "hotels" && (
          <div className="rounded-2xl border border-emerald-500/20 bg-dark-950/60 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <Hotel className="h-5 w-5" /> Hotel Recommendations
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

function MetricCard({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-white/5 bg-dark-900/60 p-3.5 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5 shrink-0">{icon}</div>
      <div>
        <span className="block text-[0.65rem] font-semibold text-text-muted uppercase tracking-wider">{label}</span>
        <span className="block text-sm font-bold text-white mt-0.5">{value}</span>
      </div>
    </div>
  );
}

function TabButton({ id, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap border ${
        active
          ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-300 shadow-md shadow-cyan-500/10"
          : "border-transparent bg-transparent text-text-muted hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}

function FormattedPlan({ text }) {
  if (!text) return <p className="text-sm text-text-muted">No content available.</p>;

  return (
    <div className="prose-invert max-w-none text-sm sm:text-base leading-[1.85] text-text-secondary space-y-3">
      {text.split("\n").map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // Top level headers
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={i} className="text-2xl font-black text-white pt-4 pb-1 border-b border-white/10">
              {trimmed.replace("# ", "")}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="text-lg sm:text-xl font-bold text-cyan-300 pt-5 pb-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {trimmed.replace("## ", "")}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="text-base font-bold text-white pt-3">
              {trimmed.replace("### ", "")}
            </h3>
          );
        }

        // Days highlights (e.g., "Day 1:", "**Day 2:**")
        if (/^(\*\*Day\s*\d+|Day\s*\d+)/i.test(trimmed)) {
          return (
            <div key={i} className="mt-4 p-3 rounded-xl bg-white/[0.03] border-l-4 border-l-cyan-400 text-white font-semibold">
              {trimmed.replace(/\*\*/g, "")}
            </div>
          );
        }

        // Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="flex items-start gap-2.5 ml-3">
              <span className="text-cyan-400 mt-1.5">•</span>
              <span className="text-text-secondary">{trimmed.replace(/^[-*]\s+/, "")}</span>
            </div>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <div key={i} className="flex items-start gap-2 ml-3">
              <span className="text-cyan-400 font-bold">{trimmed.match(/^\d+\./)[0]}</span>
              <span className="text-text-secondary">{trimmed.replace(/^\d+\.\s+/, "")}</span>
            </div>
          );
        }

        return <p key={i}>{trimmed}</p>;
      })}
    </div>
  );
}
