import Link from "next/link"

const EXTRAS = [
  { label: "Furniture Assembly", href: "/furniture-assembly-nashville", emoji: "🪑" },
  { label: "Mirror Hanging", href: "/picture-mirror-hanging-nashville", emoji: "🪞" },
  { label: "Picture Hanging", href: "/picture-mirror-hanging-nashville", emoji: "🖼️" },
  { label: "Shelf Installation", href: "/wall-installation-services-nashville", emoji: "📐" },
  { label: "Curtain Rod Installation", href: "/wall-installation-services-nashville", emoji: "🪟" },
]

export default function CrossSellSection() {
  return (
    <section className="w-full bg-gray-50/70 border-y border-black/5 py-10 md:py-12">
      <div className="max-w-4xl mx-auto px-5 md:px-6 text-center">
        <p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-3">
          Save time during your visit
        </p>
        <h3 className="text-lg md:text-xl font-extrabold text-black mb-1.5">
          Need Anything Else Installed?
        </h3>
        <p className="text-sm text-black/55 mb-6 max-w-md mx-auto">
          Save time by adding another installation service during your visit.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXTRAS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black hover:border-[#E50914]/40 hover:bg-red-50/60 hover:text-[#E50914] transition-all"
            >
              <span>{s.emoji}</span>
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
