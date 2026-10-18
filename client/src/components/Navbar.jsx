import { useState } from "react";
import { Plane, Sparkles, Menu, X, ExternalLink, RefreshCw } from "lucide-react";

function GithubIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

export default function Navbar({ threadId, onNewThread }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-950/80 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/40">
      <div className="mx-auto flex max-w-full items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-18">
        {/* Brand */}
        <a href="/" className="group flex items-center gap-2.5 no-underline">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 text-white shadow-md shadow-brand-500/30 transition-transform duration-300 group-hover:scale-105">
            <Plane className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">
                Tri<span className="gradient-text">ply</span>
              </span>
              {/* <span className="rounded-md bg-brand-500/15 border border-brand-400/30 px-1.5 py-0.2 text-[0.6rem] font-bold text-brand-300 tracking-wide uppercase">
                AI
              </span> */}
            </div>
            <span className="text-[0.62rem] font-medium text-text-muted tracking-wide -mt-0.5">
              Multi-Agent Travel Concierge
            </span>
          </div>
        </a>

        {/* Center — Status badge */}
        {/* <div className="hidden md:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 backdrop-blur-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-[0.72rem] font-semibold text-text-secondary">
            4 Autonomous Agents Active
          </span>
        </div> */}

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Session Indicator Pill */}
          {threadId && (
            <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-dark-900/60 px-2.5 py-1">
              <span className="text-[0.62rem] font-bold text-text-muted uppercase tracking-wider">Session:</span>
              <span className="text-xs font-mono font-semibold text-cyan-300">{threadId}</span>
              {onNewThread && (
                <button
                  type="button"
                  onClick={onNewThread}
                  className="flex h-4 w-4 items-center justify-center rounded text-text-muted hover:text-white transition-colors ml-0.5"
                  title="Generate new session thread"
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          )}

          <a
            href="https://github.com/amlanjyoti8704/Triply-AI-Trip-Planner"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-text-secondary transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white no-underline"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>GitHub</span>
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>

          <a
            href="#trip-builder"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-brand-600/30 transition-all duration-200 hover:shadow-brand-500/40 hover:brightness-110 no-underline"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Plan Itinerary</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-text-secondary transition-colors hover:text-white sm:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-white/[0.08] bg-dark-950/95 px-5 py-4 backdrop-blur-2xl sm:hidden animate-fade-in-up">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between rounded-xl bg-dark-900/80 p-3 text-xs text-text-secondary border border-white/[0.06]">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>4 Agents Ready</span>
              </span>
              {threadId && <span className="font-mono text-cyan-300 text-[0.68rem]">{threadId}</span>}
            </div>

            <a
              href="https://github.com/amlanjyoti8704/Triply-AI-Trip-Planner"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-text-primary no-underline"
            >
              <span className="flex items-center gap-2">
                <GithubIcon className="h-4 w-4" /> View on GitHub
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
            </a>

            <a
              href="#trip-builder"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md no-underline"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start Planning</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
