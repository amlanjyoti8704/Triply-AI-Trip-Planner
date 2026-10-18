const DESTINATIONS = [
  {
    name: "Tokyo",
    flag: "🇯🇵",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=75",
    query: "7-day Japan trip including flights and sightseeing",
  },
  {
    name: "Paris",
    flag: "🇫🇷",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=75",
    query: "5-day Paris trip with hotels and museums",
  },
  {
    name: "Bangkok",
    flag: "🇹🇭",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=75",
    query: "Bangkok and Phuket 6-day trip",
  },
  {
    name: "Rome",
    flag: "🇮🇹",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=75",
    query: "Week-long Italy tour Rome Florence Venice",
  },
  {
    name: "Dubai",
    flag: "🇦🇪",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=75",
    query: "Dubai luxury weekend trip with desert safari",
  },
  {
    name: "Bali",
    flag: "🇮🇩",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=75",
    query: "10-day Bali backpacking adventure",
  },
];

export default function DestinationStrip({ onSelect }) {
  return (
    <section className="mt-4">
      <p className="mb-3 text-xs font-semibold tracking-widest text-text-muted uppercase">
        Popular Destinations
      </p>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        {DESTINATIONS.map((dest) => (
          <button
            key={dest.name}
            id={`dest-${dest.name.toLowerCase()}`}
            onClick={() => onSelect(dest.query)}
            className="group relative overflow-hidden rounded-xl border border-dark-600/50 bg-dark-800 transition-all duration-300 hover:border-accent-400/30 hover:shadow-lg hover:shadow-accent-400/5 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
          >
            <div className="relative h-20 md:h-24">
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-2 text-center">
                <span className="text-xs font-semibold text-white md:text-sm">
                  {dest.flag} {dest.name}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
