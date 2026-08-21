import Link from "next/link"

const NEW_SERVICES = [
  {
    emoji: "🪑",
    title: "Furniture Assembly",
    desc: "Professional assembly for beds, dressers, desks, TV stands, IKEA and office furniture.",
    tags: ["Beds & Dressers", "IKEA Furniture", "Desks & Offices", "TV Stands"],
    href: "/furniture-assembly-nashville",
    cta: "Explore Furniture Assembly",
  },
  {
    emoji: "🪞",
    title: "Picture & Mirror Hanging",
    desc: "Secure, perfectly leveled installation for mirrors, artwork, gallery walls and heavy wall décor.",
    tags: ["Mirrors", "Artwork & Pictures", "Gallery Walls", "Heavy Mirrors"],
    href: "/picture-mirror-hanging-nashville",
    cta: "Explore Wall Hanging Services",
  },
  {
    emoji: "📐",
    title: "Shelves & Wall Installation",
    desc: "Floating shelves, curtain rods, blinds, whiteboards and wall-mounted cabinets installed correctly.",
    tags: ["Floating Shelves", "Curtain Rods", "Blinds", "Whiteboards"],
    href: "/wall-installation-services-nashville",
    cta: "Explore Wall Installations",
  },
  {
    emoji: "⛺",
    title: "Gazebo & Pergola Assembly",
    desc: "Expert assembly of Yardistry, Backyard Discovery, Purple Leaf and similar outdoor structures.",
    tags: ["Gazebo Assembly", "Pergola Assembly", "Outdoor Furniture", "Backyard Structures"],
    href: "/gazebo-installation-nashville",
    cta: "Explore Gazebo Assembly",
  },
]

export default function MoreThanTVSection() {
  return (
    <section className="w-full bg-white py-20 md:py-28" id="installation-services">
      <div className="max-w-6xl mx-auto px-5 md:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/60 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E50914]" />
            Additional Services
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-tight">
            More Than TV Mounting
          </h2>
          <p className="mt-4 text-base md:text-lg text-black/60 max-w-2xl mx-auto">
            Professional installation and assembly services for your home or business.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {NEW_SERVICES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col border border-black/10 rounded-2xl p-6 hover:border-[#E50914]/30 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 bg-white"
            >
              <span className="text-3xl mb-4 block">{s.emoji}</span>
              <h3 className="text-base font-bold text-black mb-2 group-hover:text-[#E50914] transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-black/60 mb-4 leading-relaxed flex-1">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium bg-black/5 text-black/60 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold text-[#E50914] flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                {s.cta} →
              </span>
            </Link>
          ))}
        </div>

        {/* See all */}
        <div className="text-center mb-14">
          <Link
            href="/home-installation-services-nashville"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-black hover:bg-black hover:text-white transition-all"
          >
            View All Installation Services →
          </Link>
        </div>

        {/* Commercial teaser */}
        <div className="rounded-2xl bg-black text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">For Businesses</p>
            <h3 className="text-xl md:text-2xl font-extrabold mb-2">Commercial Installation Services</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-xl">
              Office furniture assembly, commercial TV mounting, display installation, conference room whiteboards,
              artwork and shelving. We serve businesses throughout Nashville and Middle Tennessee.
            </p>
          </div>
          <Link
            href="/home-installation-services-nashville#commercial"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#E50914] px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition shadow-lg shadow-red-500/30"
          >
            Request a Commercial Quote
          </Link>
        </div>

      </div>
    </section>
  )
}
