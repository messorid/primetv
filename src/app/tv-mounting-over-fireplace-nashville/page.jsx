import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"

export const metadata = {
  title: "TV Mounting Over Fireplace Nashville TN | PrimeTvNashville",
  description: "Professional TV mounting above fireplace in Nashville TN. Heat clearance checks, safe mounting height, clean cable management. Book same-day service.",
  keywords: [
    "TV mounting over fireplace Nashville",
    "mount TV above fireplace Nashville TN",
    "fireplace TV installation Nashville",
    "TV above mantel Nashville",
    "can you mount TV over fireplace Nashville",
  ],
  openGraph: {
    title: "TV Mounting Over Fireplace Nashville | PrimeTvNashville",
    description: "Safe TV mounting above fireplaces in Nashville TN. Heat checks, correct height, clean cables. Book today.",
    url: "https://primetvnashville.com/tv-mounting-over-fireplace-nashville",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://primetvnashville.com/tv-mounting-over-fireplace-nashville" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "TV Mounting Over Fireplace Nashville",
  "description": "Professional TV mounting above fireplaces in Nashville TN including heat clearance verification, safe height selection and cable concealment.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "PrimeTvNashville",
    "telephone": "+1-615-669-0251",
    "url": "https://primetvnashville.com",
    "address": { "@type": "PostalAddress", "addressLocality": "Nashville", "addressRegion": "TN", "addressCountry": "US" },
  },
}

const fireplaceQas = [
  { q: "Is it safe to mount a TV above a fireplace?", a: "Yes, with proper precautions. We check the heat output and clearance of your specific fireplace type — gas, wood or electric — and choose a mounting height that keeps the TV within the manufacturer's temperature guidelines. Many Nashville homes have gas fireplaces where heat rises less aggressively, making above-fireplace mounting very common and safe." },
  { q: "What height should the TV be above the fireplace?", a: "We aim for the center of the screen to sit at or near eye level when seated, typically 42\"–48\" from the floor for most living rooms. On fireplaces this sometimes means a slightly higher placement — we discuss it with you first and never mount at a height that creates neck strain or heat damage risk." },
  { q: "How do you hide cables on a fireplace wall?", a: "On drywall fireplace surrounds we can route cables in-wall using a power bridge kit — the cleanest option. On brick, stone or tile we use a slim surface raceway painted to match or we route along the sides of the fireplace. Cable concealment is $60 per TV as an add-on." },
  { q: "Do you mount TVs on brick and stone fireplaces?", a: "Yes. Brick, stone, and tile fireplaces are common in Nashville. There is a $25 surcharge for hard surfaces to cover the masonry bits and specialized anchors required. The installation is just as secure and clean." },
  { q: "Do you work on all fireplace types?", a: "Yes — gas, wood-burning, electric and decorative fireplaces. Each type has different heat considerations and we assess all of them before mounting." },
  { q: "Can you hide the TV wires going into the fireplace wall?", a: "Yes. We can run cables through the wall beside or above the fireplace opening using a power bridge kit, or use a surface raceway for walls where in-wall routing isn't possible. We discuss the best option for your specific wall before starting." },
]

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": fireplaceQas.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
}

export default function FireplaceTvMountingPage() {
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
            Same-Day & Next-Day Available
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-black">
            TV Mounting Over a<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              Fireplace in Nashville
            </span>
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">
            One of the most requested installs in Nashville. We verify heat clearance, pick the right mounting height,
            and handle cable concealment — on drywall, brick, stone or tile.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/book" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
              Book Fireplace TV Mounting
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
              Call (615) 669-0251
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Heat Clearance Verified", "Brick & Stone OK", "Cable Concealment Available", "Licensed & Insured", "Upfront Pricing"].map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-black/[0.03] px-3.5 py-1.5 text-xs font-semibold text-black/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE DO IT */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black">Our Fireplace Mounting Process</h2>
          <p className="mt-2 text-black/60">Every fireplace install follows the same careful steps.</p>
          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { step: "01", title: "Heat Clearance Check", desc: "We assess the fireplace type (gas, wood, electric) and measure clearance to confirm the TV can be mounted safely." },
              { step: "02", title: "Height Planning", desc: "We find the optimal viewing height that balances comfort and safety — never too high for neck strain or too low for heat." },
              { step: "03", title: "Wall Assessment", desc: "We identify the wall material — drywall, brick, stone, tile — and bring the right hardware for a secure mount." },
              { step: "04", title: "Clean Cable Routing", desc: "Cables go in-wall on drywall or through a slim raceway on hard surfaces. Either way, no visible wires." },
              { step: "05", title: "Secure Mount", desc: "We drill into studs or use properly rated anchors. Every mount is pull-tested before we hang the TV." },
              { step: "06", title: "Final Test & Cleanup", desc: "We verify the TV is level, all connections work, and leave the space exactly as we found it." },
            ].map(s => (
              <div key={s.step} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <p className="text-3xl font-black text-[#E50914]/20">{s.step}</p>
                <h3 className="mt-1 font-bold text-black">{s.title}</h3>
                <p className="mt-2 text-sm text-black/65 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black">Pricing</h2>
          <p className="mt-2 text-black/60">Transparent upfront rates. No surprise charges.</p>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { item: "TV up to 55\"", price: "$110" },
              { item: "TV 60\" – 70\"", price: "$150" },
              { item: "Fireplace Surcharge", price: "from +$25" },
              { item: "Hard Wall (brick/stone/tile)", price: "+$25" },
              { item: "Cable Concealment", price: "+$60" },
              { item: "75\"+ Large TV", price: "Ask" },
            ].map(p => (
              <div key={p.item} className="rounded-2xl border border-black/10 bg-gray-50 p-4">
                <p className="text-xs font-semibold text-black/60">{p.item}</p>
                <p className="mt-1 text-2xl font-black text-[#E50914]">{p.price}</p>
              </div>
            ))}
          </div>
          <Link href="/book" className="mt-8 inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">
            Book Fireplace TV Mounting
          </Link>

          {/* Cross-link */}
          <p className="mt-6 text-sm text-black/60 bg-gray-50 rounded-xl px-4 py-3 border border-black/8">
            Installing a Samsung Frame TV above a fireplace?{" "}
            <Link href="/samsung-frame-tv-installation-nashville" className="font-semibold text-[#E50914] hover:underline underline-offset-2">
              Our team specializes in Samsung Frame TV installation
            </Link>{" "}
            — slim fit mount, One Connect Box routing and a clean gallery-style finish.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {fireplaceQas.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-black/10 bg-white p-5 open:shadow-md transition">
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
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Mount Your TV Above the Fireplace?</h2>
          <p className="mt-3 text-white/60 text-lg">Same-day and next-day availability across Nashville and surrounding areas.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">Book Installation</Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition">Call (615) 669-0251</a>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-3 text-sm text-white/40">
            <Link href="/tv-mounting-nashville" className="hover:text-white/70 transition">Nashville</Link>
            <span>·</span>
            <Link href="/tv-mounting-brentwood" className="hover:text-white/70 transition">Brentwood</Link>
            <span>·</span>
            <Link href="/cable-concealment-nashville" className="hover:text-white/70 transition">Cable Concealment</Link>
            <span>·</span>
            <Link href="/samsung-frame-tv-installation-nashville" className="hover:text-white/70 transition">Samsung Frame TV</Link>
          </div>
        </div>
      </section>

      <StickyActionBar />
    </>
  )
}
