import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-dark-700/50 bg-dark-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-lg shadow-lg shadow-accent-500/20">
            ✈️
          </div>
          <span className="text-xl font-extrabold tracking-tight text-text-primary">
            Tri<span className="gradient-text">ply</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink label="Home" active />
          <NavLink label="How it Works" />
          <NavLink label="Agents" />
          <div className="ml-2 rounded-full border border-dark-500 bg-dark-800/60 px-4 py-2 text-xs font-semibold tracking-wider text-accent-400 uppercase">
            Powered by LangGraph
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          id="mobile-menu-toggle"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`h-0.5 w-6 bg-text-secondary transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-text-secondary transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-text-secondary transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="animate-fade-in-up border-t border-dark-700/50 bg-dark-950/95 px-6 pb-4 pt-2 md:hidden">
          <NavLink label="Home" active mobile />
          <NavLink label="How it Works" mobile />
          <NavLink label="Agents" mobile />
        </div>
      )}
    </nav>
  );
}

function NavLink({ label, active, mobile }) {
  return (
    <a
      href="#"
      className={`
        text-sm font-medium transition-colors duration-200 no-underline
        ${active ? "text-accent-400" : "text-text-secondary hover:text-text-primary"}
        ${mobile ? "block py-2" : ""}
      `}
    >
      {label}
    </a>
  );
}
