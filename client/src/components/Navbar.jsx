import { useState, useEffect } from "react";
import { Plane, Sparkles, Layers, Activity, Menu, X, ExternalLink } from "lucide-react";

function GithubIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-dark-950/85 backdrop-blur-2xl shadow-2xl shadow-black/60 py-3.5"
          : "border-b border-white/5 bg-transparent backdrop-blur-md py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="/" className="group flex items-center gap-3 no-underline">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 text-white shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:scale-105">
            <Plane className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              Tri<span className="gradient-text">ply</span>
              <span className="rounded-md bg-brand-500/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-cyan-400 uppercase tracking-widest border border-brand-500/30">
                AI
              </span>
            </span>
            <span className="text-[0.68rem] font-medium text-text-muted tracking-wide -mt-0.5">
              Autonomous Travel Engine
            </span>
          </div>
        </a>

        {/* Center info pill */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-dark-900/60 px-4 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-text-secondary">Multi-Agent Pipeline</span>
          <span className="text-text-muted">•</span>
          <span className="text-xs font-medium text-cyan-400">LangGraph + Supabase</span>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/amlanjyoti8704/Triply-AI-Trip-Planner"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-text-primary transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:shadow-lg no-underline"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub</span>
            <ExternalLink className="h-3 w-3 text-text-muted" />
          </a>

          <a
            href="#trip-builder"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-500/25 transition-all duration-200 hover:opacity-95 hover:shadow-brand-500/40 no-underline"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Plan Trip</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-text-secondary transition-colors hover:text-white md:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-b border-white/10 bg-dark-950/95 px-6 py-5 backdrop-blur-2xl md:hidden animate-fade-in-up">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-dark-900 p-3 text-xs text-text-secondary border border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Agents Ready (Groq LLaMA 3.3 + LangGraph)</span>
            </div>

            <a
              href="https://github.com/amlanjyoti8704/Triply-AI-Trip-Planner"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-text-primary no-underline"
            >
              <span className="flex items-center gap-2">
                <GithubIcon className="h-4 w-4" /> View Source Code
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
            </a>

            <a
              href="#trip-builder"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg no-underline"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start Planning</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
