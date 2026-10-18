import { MapPin, ArrowUpRight, Sparkles } from "lucide-react";

const DESTINATIONS = [
  {
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    tag: "Neon & Culture",
    duration: "7 Days",
    estBudget: "₹1.8L - 2.4L",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    query: "Plan a complete 7-day Japan trip to Tokyo & Kyoto with flights from Delhi, boutique hotels, scenic train passes and day trips under ₹2 lakhs",
  },
  {
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    tag: "Art & Romance",
    duration: "5 Days",
    estBudget: "₹2.2L - 2.8L",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    query: "5-day romantic Paris getaway exploring the Louvre, Eiffel Tower, Saint-Germain cafes and boutique hotels for a couple",
  },
  {
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    tag: "Villas & Surfing",
    duration: "10 Days",
    estBudget: "₹1.2L - 1.6L",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    query: "10-day Bali trip covering Ubud forest villas, Canggu beach clubs, temples, and a speedboat trip to Nusa Penida",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    flag: "🇨🇭",
    tag: "Peaks & Trains",
    duration: "7 Days",
    estBudget: "₹3.0L - 3.8L",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
    query: "7-day scenic Swiss Alps winter vacation including Glacier Express panoramic train, Zermatt Matterhorn views and cozy ski chalets",
  },
  {
    name: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    tag: "Skyline & Dunes",
    duration: "4 Days",
    estBudget: "₹1.4L - 1.9L",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    query: "4-day luxury Dubai weekend trip with Burj Khalifa lounge, desert safari dune bashing, private marina yacht and beach clubs",
  },
  {
    name: "Amalfi Coast",
    country: "Italy",
    flag: "🇮🇹",
    tag: "Cliffs & Cuisine",
    duration: "6 Days",
    estBudget: "₹2.5L - 3.2L",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
    query: "6-day road trip along Italy's Amalfi Coast covering cliffside Positano, Capri boat tours, authentic limoncello and seafood dining",
  },
];

export default function DestinationStrip({ onSelect }) {
  const handleCardClick = (query) => {
    onSelect(query);
    const inputEl = document.getElementById("trip-query-input");
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      inputEl.focus();
    }
  };

  return (
    <section className="mt-14 mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Curated Escapes</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Featured Destinations
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Click any destination to load a handcrafted AI itinerary prompt instantly.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-text-muted self-start sm:self-auto">
          <MapPin className="h-3.5 w-3.5 text-brand-400" />
          <span>6 World-Class Getaways</span>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {DESTINATIONS.map((dest) => (
          <button
            key={dest.name}
            type="button"
            onClick={() => handleCardClick(dest.query)}
            className="destination-card group relative h-64 sm:h-72 w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-dark-900/60 text-left transition-all duration-500 hover:border-brand-400/40 hover:shadow-2xl hover:shadow-brand-500/20 hover:-translate-y-1 focus:outline-none"
          >
            {/* Background Image */}
            <img
              src={dest.image}
              alt={dest.name}
              className="destination-card-img absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />

            {/* Gradient Overlays for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
            <div className="absolute inset-0 bg-dark-950/20 group-hover:bg-transparent transition-colors duration-300" />

            {/* Top Meta Chip */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-dark-950/60 px-2.5 py-1 text-[0.65rem] font-bold text-white backdrop-blur-md shadow-md">
                <span>{dest.flag}</span>
                <span>{dest.tag}</span>
              </span>

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-md">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Bottom Details */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[0.65rem] font-semibold text-text-muted uppercase tracking-wider block">
                {dest.country}
              </span>
              <h4 className="text-xl font-black text-white leading-tight mb-2 group-hover:text-brand-300 transition-colors">
                {dest.name}
              </h4>

              <div className="flex items-center justify-between text-[0.68rem] text-text-secondary pt-2 border-t border-white/10">
                <span className="font-semibold text-white/90">{dest.duration}</span>
                <span className="text-amber-300 font-bold">{dest.estBudget}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
