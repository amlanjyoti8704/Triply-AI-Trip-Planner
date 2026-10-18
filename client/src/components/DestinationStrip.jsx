import { MapPin, ArrowUpRight } from "lucide-react";

const DESTINATIONS = [
  {
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    tag: "Neon & Culture",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    query: "Plan a complete 7-day Japan trip to Tokyo & Kyoto with flights, hotels and sightseeing under ₹2 lakhs",
  },
  {
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    tag: "Art & Romance",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    query: "5-day romantic Paris getaway exploring the Louvre, Eiffel Tower, cafes and boutique hotels",
  },
  {
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    tag: "Villas & Surfing",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    query: "10-day Bali backpacking trip covering Ubud temples, Canggu beaches and Nusa Penida",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    flag: "🇨🇭",
    tag: "Peaks & Trains",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80",
    query: "7-day scenic Swiss Alps winter vacation including Glacier Express, Zermatt and ski lodges",
  },
  {
    name: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    tag: "Skyline & Dunes",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    query: "4-day luxury Dubai weekend trip with Burj Khalifa, desert safari and beach clubs",
  },
  {
    name: "Amalfi Coast",
    country: "Italy",
    flag: "🇮🇹",
    tag: "Cliffs & Cuisine",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
    query: "6-day road trip along Italy's Amalfi Coast covering Positano, Capri boat tours and authentic pasta",
  },
];

export default function DestinationStrip({ onSelect }) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
            Popular Inspiration Hub
          </span>
        </div>
        <span className="text-xs text-text-muted hidden sm:inline">Click any destination to auto-fill</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DESTINATIONS.map((dest) => (
          <button
            key={dest.name}
            type="button"
            onClick={() => onSelect(dest.query)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-dark-900/60 p-1 text-left transition-all duration-300 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 focus:outline-none"
          >
            <div className="relative h-28 w-full overflow-hidden rounded-xl">
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />

              <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <span className="inline-block text-[0.62rem] font-semibold text-cyan-300 uppercase tracking-wider mb-0.5">
                  {dest.tag}
                </span>
                <p className="text-xs font-bold text-white flex items-center gap-1 leading-tight">
                  <span>{dest.flag}</span>
                  <span>{dest.name}</span>
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
