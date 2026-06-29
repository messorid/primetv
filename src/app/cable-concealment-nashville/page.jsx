import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"

export const metadata = {
  title: "Cable Concealment Nashville TN | Hide TV Wires | PrimeTvNashville",
  description: "Professional TV cable concealment in Nashville TN. In-wall routing and surface raceways for drywall, brick, stone and tile. Clean, invisible cables. Book same-day.",
  keywords: [
    "cable concealment Nashville",
    "hide TV wires Nashville TN",
    "TV wire concealment Nashville",
    "in-wall cable management Nashville",
    "hide TV cables wall Nashville",
    "TV wire hider Nashville",
  ],
  openGraph: {
    title: "Cable Concealment Nashville TN | PrimeTvNashville",
    description: "Hide TV wires professionally in Nashville. In-wall routing and raceways for any wall type. Upfront pricing. Book today.",
    url: "https://primetvnashville.com/cable-concealment-nashville",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://primetvnashville.com/cable-concealment-nashville" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Cable Concealment Nashville TN",
  "description": "Professional TV cable concealment in Nashville Tennessee. In-wall routing and surface raceways for drywall, brick, stone and tile walls.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "PrimeTvNashville",
    "telephone": "+1-615-669-0251",
    "url": "https://primetvnashville.com",
    "address": { "@type": "PostalAddress", "addressLocality": "Nashville", "addressRegion": "TN", "addressCountry": "US" },
  },
}

const cableQas = [
  { q: "How much does cable concealment cost in Nashville?", a: "Cable concealment is $60 per TV as an add-on to your mounting service. This covers either in-wall routing using a power bridge kit or a surface raceway depending on your wall type." },
  { q: "What is the difference between in-wall routing and a raceway?", a: "In-wall routing threads cables inside the wall for a completely invisible finish — there's nothing visible on the surface at all. A surface raceway is a slim channel mounted on the wall that covers the cables and can be painted to match. In-wall is cleaner; raceways work for walls where drilling through isn't possible (brick, tile, concrete, rental units)." },
  { q: "Can you hide cables on a brick or stone wall?", a: "Yes. For hard surfaces we use a slim surface raceway that can be painted to blend with the wall. In-wall routing isn't possible through masonry without major renovation, so the raceway is the right solution here. It still looks significantly cleaner than loose cables." },
  { q: "Can you hide cables in an apartment without damaging the wall?", a: "Yes. We use a surface raceway that attaches without drilling into the wall structure — just the mount itself. When you move out, it removes cleanly. In-wall routing requires drilling and is less suitable for rentals." },
  { q: "How long does cable concealment take?", a: "Most cable concealment add-ons add 20–40 minutes to the installation time. Complex setups with multiple devices or longer cable runs take a bit more." },
  { q: "What cables can you hide?", a: "Power cable, HDMI, optical audio, ethernet — anything that runs to your TV. We route all of them together for a single clean path." },
  { q: "Does cable concealment work on tile fireplace surrounds?", a: "Yes. A slim raceway routed along the side of the fireplace surround is the standard approach for tile. It looks clean and is a common solution in Nashville homes with tiled fireplaces." },
]

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": cableQas.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
}

export default function CableConcealmentPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* HERO */}
      <section className="relative w-full bg-white text-black overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#E50914] via-black to-[#E50914]" />
        <div aria-hidden="true" className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#E50914]/6 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 md:px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/70 mb-5">
            <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
            Add-On to Any TV Mounting Service
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-black">
            Cable Concealment<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              in Nashville TN
            </span>
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">
            No more visible wires. We route all TV cables in-wall or through a clean surface raceway —
            on drywall, brick, stone, tile or any wall type. Included as a $60 add-on per TV.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/book" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
              Book Cable Concealment
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
              Call (615) 669-0251
            </a>
          </div>
          <p className="mt-5 text-2xl font-black text-[#E50914]">$60 <span className="text-base font-semibold text-black/50">per TV (add-on)</span></p>
        </div>
      </section>

      {/* TWO OPTIONS */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black">Two Ways to Hide Your Cables</h2>
          <p className="mt-2 text-black/60">We recommend the best option based on your wall type.</p>

          {/* Cross-link */}
          <p className="mb-8 text-sm text-black/60 bg-white rounded-xl px-4 py-3 border border-black/10">
            Many Nashville homeowners combine cable concealment with{" "}
            <Link href="/tv-mounting-over-fireplace-nashville" className="font-semibold text-[#E50914] hover:underline underline-offset-2">
              TV mounting above a fireplace
            </Link>{" "}
            for a completely clean living room setup — no wires, no clutter.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E50914] uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-[#E50914]" /> Best Option
              </div>
              <h3 className="text-xl font-extrabold text-black">In-Wall Routing</h3>
              <p className="mt-3 text-sm text-black/65 leading-relaxed">
                Cables run completely inside the wall using a power bridge kit. Nothing visible on the surface at all —
                just a clean wall and a floating TV. Best for drywall homes and the cleanest finish available.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-black/70">
                {["Completely invisible cables", "Works on standard drywall", "UL-listed power bridge kits", "Clean outlet below TV"].map(b => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] flex-none" />{b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-black/40 uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-black/30" /> For Hard Surfaces & Rentals
              </div>
              <h3 className="text-xl font-extrabold text-black">Surface Raceway</h3>
              <p className="mt-3 text-sm text-black/65 leading-relaxed">
                A slim channel mounted on the wall covers all cables neatly and can be painted to match your wall color.
                The right solution for brick, stone, tile, concrete, or apartment walls.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-black/70">
                {["No drilling through the wall", "Works on brick, stone, tile", "Renter-friendly option", "Paintable to match wall"].map(b => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/30 flex-none" />{b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">Cable Concealment Questions</h2>
          <div className="grid gap-4">
            {cableQas.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-black/10 bg-gray-50 p-5 open:bg-white open:shadow-md transition">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <h3 className="text-base font-bold text-black">{faq.q}</h3>
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/20 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-black/75 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full bg-black text-white py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Clean Cables. Clean Look.</h2>
          <p className="mt-3 text-white/60 text-lg">Add cable concealment to any TV mounting appointment in Nashville.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">Book Now — $60 Add-On</Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition">Call (615) 669-0251</a>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-3 text-sm text-white/40">
            <Link href="/tv-mounting-nashville" className="hover:text-white/70 transition">TV Mounting Nashville</Link>
            <span>·</span>
            <Link href="/tv-mounting-over-fireplace-nashville" className="hover:text-white/70 transition">Fireplace Mounting</Link>
            <span>·</span>
            <Link href="/samsung-frame-tv-installation-nashville" className="hover:text-white/70 transition">Samsung Frame TV</Link>
            <span>·</span>
            <Link href="/pricing" className="hover:text-white/70 transition">All Pricing</Link>
          </div>
        </div>
      </section>

      <StickyActionBar />
    </>
  )
}
