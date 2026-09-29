// Reciprocal links from the city pages into the brand and size hubs.
//
// The brand and size pages link out to every city; this is the other half of
// that, so the two clusters are connected in both directions instead of the
// new pages hanging off the site with nothing pointing back at them.

import Link from "next/link"
import { BRANDS, SIZES } from "../lib/tvModels"

const EXTRA = [
  { label: "OLED TVs", href: "/oled-tv-mounting" },
  { label: "Samsung Frame TV", href: "/samsung-frame-tv-installation-nashville" },
]

export default function TvBrandSizeLinks({ city = "Nashville" }) {
  return (
    <section className="w-full bg-white py-14 border-t border-black/[0.06]">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <h2 className="text-2xl font-extrabold text-black mb-2">
          Find Your TV
        </h2>
        <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
          We mount every major brand in {city}. Start with yours, or jump straight to the size —
          the size is what decides the crew, the bracket and the wall requirement.
        </p>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/35 mb-3">By brand</h3>
            <div className="flex flex-wrap gap-2">
              {[...BRANDS.map(b => ({ label: b.name, href: b.path })), ...EXTRA].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full border border-black/10 bg-gray-50 px-4 py-2 text-sm font-semibold text-black/70 hover:border-[#E50914]/30 hover:bg-white hover:text-[#E50914] transition"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/35 mb-3">By size</h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <Link
                  key={s.path}
                  href={s.path}
                  className="rounded-full border border-black/10 bg-gray-50 px-4 py-2 text-sm font-semibold text-black/70 hover:border-[#E50914]/30 hover:bg-white hover:text-[#E50914] transition"
                >
                  {s.inches}-Inch TVs
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
