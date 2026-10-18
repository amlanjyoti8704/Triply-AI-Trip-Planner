export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 md:mx-0">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80"
          alt="Airplane above clouds"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/70 via-dark-950/50 to-dark-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-24 text-center md:py-32">
        {/* Badge */}
        <div className="animate-fade-in-up mb-5 inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-accent-400 uppercase backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
          Multi-Agent AI System
        </div>

        {/* Title */}
        <h1
          className="animate-fade-in-up mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl"
          style={{ animationDelay: "0.1s" }}
        >
          Your AI-Powered{" "}
          <span className="gradient-text">Trip Planner</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
          style={{ animationDelay: "0.2s" }}
        >
          Four specialized AI agents collaborate in real-time — searching flights,
          discovering hotels, crafting itineraries, and delivering your perfect
          travel plan.
        </p>

        {/* Agent chips */}
        <div
          className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.35s" }}
        >
          {[
            { icon: "✈️", label: "Flight Agent" },
            { icon: "🏨", label: "Hotel Agent" },
            { icon: "🗓️", label: "Itinerary Agent" },
            { icon: "🧠", label: "Final Agent" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-dark-500/60 bg-dark-800/60 px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm"
            >
              <span>{icon}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
