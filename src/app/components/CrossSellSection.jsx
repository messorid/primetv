import Link from "next/link"

const EXTRAS = [
  { label: "Furniture Assembly", href: "/furniture-assembly-nashville", emoji: "🪑", desc: "IKEA, beds, desks, cabinets" },
  { label: "Mirror Hanging", href: "/picture-mirror-hanging-nashville", emoji: "🪞", desc: "Mirrors & heavy wall pieces" },
  { label: "Picture Hanging", href: "/picture-mirror-hanging-nashville", emoji: "🖼️", desc: "Art, photos, gallery walls" },
  { label: "Shelf Installation", href: "/wall-installation-services-nashville", emoji: "📐", desc: "Floating shelves & cabinets" },
  { label: "Curtain Rods", href: "/wall-installation-services-nashville", emoji: "🪟", desc: "Rods, blinds & shades" },
]

export default function CrossSellSection() {
  return (
    <section className="w-full bg-black text-white py-14 md:py-18">
      <div className="max-w-6xl mx-auto px-5 md:px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/60 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E50914]" />
              Save time during your visit
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Need Anything Else Installed?
            </h2>
            <p className="mt-2 text-white/55 text-sm max-w-md">
              Our team can handle multiple services in one visit — no extra trip needed.
            </p>
          </div>
          <Link
            href="/home-installation-services-nashville"
            className="shrink-0 text-sm font-semibold text-white/50 hover:text-white transition underline underline-offset-4 decoration-white/20 hover:decoration-white/60 whitespace-nowrap"
          >
            See all services →
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {EXTRAS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group flex flex-col items-center text-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 hover:border-[#E50914]/60 hover:bg-[#E50914]/10 transition-all duration-200"
            >
              <span className="text-3xl">{s.emoji}</span>
              <span className="text-sm font-bold text-white group-hover:text-white leading-tight">{s.label}</span>
              <span className="text-[11px] text-white/40 group-hover:text-white/60 leading-tight">{s.desc}</span>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <Link
            href="/get-installation-quote"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-5 py-2 text-sm font-semibold text-white hover:bg-[#E50914] hover:border-[#E50914] transition-all"
          >
            Request Installation Quote →
          </Link>
          <div className="h-px flex-1 bg-white/10" />
        </div>

      </div>
    </section>
  )
}
