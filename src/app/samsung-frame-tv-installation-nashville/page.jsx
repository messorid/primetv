import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import FaqsSection from "../components/FaqsSection"

export const metadata = {
  title: "Samsung Frame TV Installation Nashville | PrimeTvNashville",
  description: "Expert Samsung Frame TV installation in Nashville TN. Slim fit mount, One Connect Box placement, cable concealment and Art Mode setup. Book same-day service.",
  keywords: [
    "Samsung Frame TV installation Nashville",
    "Samsung Frame TV mount Nashville TN",
    "The Frame TV installation Nashville",
    "Samsung Frame TV installer near me",
    "slim fit wall mount Nashville",
    "Samsung Frame TV One Connect Box Nashville",
  ],
  openGraph: {
    title: "Samsung Frame TV Installation Nashville | PrimeTvNashville",
    description: "Professional Samsung Frame TV installation in Nashville. Slim fit mount, invisible cables, Art Mode setup. Book today.",
    url: "https://www.primetvnashville.com/samsung-frame-tv-installation-nashville",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://www.primetvnashville.com/opengraph-image", width: 1200, height: 630, alt: "Samsung Frame TV installation Nashville TN" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/samsung-frame-tv-installation-nashville" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Samsung Frame TV Installation Nashville",
  "description": "Professional Samsung Frame TV installation including slim fit wall mount, One Connect Box placement, invisible cable management and Art Mode setup in Nashville TN.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "PrimeTvNashville",
    "telephone": "+1-615-669-0251",
    "url": "https://www.primetvnashville.com",
    "address": { "@type": "PostalAddress", "addressLocality": "Nashville", "addressRegion": "TN", "addressCountry": "US" },
  },
  "areaServed": "Nashville, TN",
  "serviceType": "TV Installation",
}

const frameFaqs = [
  {
    q: "Where does the One Connect Box go after mounting?",
    a: "We route the One Connect cable through the wall or use a clean surface raceway so the box is hidden behind furniture, inside a media cabinet, or tucked behind the TV itself. We plan the placement with you before drilling.",
  },
  {
    q: "Can you hide the transparent cable on The Frame TV?",
    a: "Yes. Samsung's transparent cable can be routed in-wall or concealed with a slim surface raceway painted to match your wall. We recommend in-wall routing for the cleanest Art Mode look.",
  },
  {
    q: "Do you install Samsung Frame TVs on brick or stone walls?",
    a: "Yes. There is a $25 surcharge for hard surfaces (brick, stone, concrete, tile) to cover the specialized anchors and masonry bits required. The result is just as clean and secure.",
  },
  {
    q: "Can you mount The Frame TV above a fireplace?",
    a: "Yes, with proper heat clearance. We check the manufacturer's temperature guidelines and choose the safest mounting height. Fireplace handling starts from $25 extra.",
  },
  {
    q: "Do I need a special mount for The Frame TV?",
    a: "Samsung sells a No Gap Wall Mount (also called Slim Fit Mount) designed specifically for The Frame. We install customer-supplied mounts — we do not sell mounts, but we can advise you on which Samsung model fits your TV generation.",
  },
  {
    q: "Can you set up Art Mode after mounting?",
    a: "Yes. We connect the One Connect Box, test all inputs, and help you get Art Mode running before we leave so the TV looks like a picture frame from day one.",
  },
  {
    q: "Do you serve all Nashville neighborhoods for Frame TV installs?",
    a: "Yes. We cover all of Nashville and the metro area: Brentwood, Franklin, Murfreesboro, Hendersonville, Mount Juliet, Smyrna, Gallatin, Nolensville, Spring Hill and more.",
  },
]

const frameFaqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": frameFaqs.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
}

const WHAT_WE_HANDLE = [
  { title: "Slim Fit / No Gap Mount", desc: "We install Samsung's official No Gap Wall Mount so The Frame sits flush against the wall with zero gap — exactly like a picture frame." },
  { title: "One Connect Box Placement", desc: "The external One Connect Box needs a home. We route the transparent cable in-wall or behind furniture so it's completely out of sight." },
  { title: "Cable Concealment", desc: "Samsung's transparent cable can go in-wall for a completely invisible finish. Available as an add-on for the cleanest result." },
  { title: "Art Mode Setup", desc: "We connect everything, test all inputs and walk you through Art Mode before we leave — so your TV looks like gallery art from day one." },
  { title: "Fireplace & Gallery Wall Installs", desc: "The Frame is popular above fireplaces and in gallery wall layouts. We handle both with proper heat clearance checks and precise leveling." },
  { title: "Brick, Stone & Concrete", desc: "We mount on any wall surface with a $25 surcharge for hard materials. The result is just as clean and perfectly secure." },
]

export default function SamsungFrameInstallPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(frameFaqLd) }} />

      {/* HERO */}
      <section className="relative w-full bg-white text-black overflow-hidden">
        <div aria-hidden="true" className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#E50914]/6 blur-[120px] rounded-full pointer-events-none" />
        <div className="h-1 w-full bg-gradient-to-r from-[#E50914] via-black to-[#E50914]" />

        <div className="relative max-w-5xl mx-auto px-5 md:px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/70 mb-5">
            <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
            Same-Day & Next-Day Availability
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-black">
            Samsung Frame TV<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              Installation in Nashville
            </span>
          </h1>

          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">
            The Frame TV deserves a perfect install. We handle the slim fit mount, One Connect Box routing,
            transparent cable concealment and Art Mode setup — so it looks like art, not like a TV on a wall.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/book"
              className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
              Book Frame TV Installation
            </Link>
            <a href="tel:+16156690251"
              className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
              Call (615) 669-0251
            </a>
          </div>

          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap gap-2">
            {["Licensed & Insured", "Same-Day Service", "Upfront Pricing", "Workmanship Warranty", "No Gap Specialists"].map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-black/[0.03] px-3.5 py-1.5 text-xs font-semibold text-black/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE HANDLE */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black">
            What We Handle on Every Frame TV Install
          </h2>
          <p className="mt-2 text-black/60">
            Samsung Frame TVs have unique requirements. We know them all.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {WHAT_WE_HANDLE.map(item => (
              <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-bold text-black text-base">{item.title}</h3>
                <p className="mt-2 text-sm text-black/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black">Pricing</h2>
          <p className="mt-2 text-black/60">Upfront pricing, no hidden fees.</p>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { service: "Frame TV up to 55\"", price: "$110", note: "Mount + setup included" },
              { service: "Frame TV 60\" – 70\"", price: "$150", note: "Mount + setup included" },
              { service: "Cable Concealment", price: "+$60", note: "In-wall or raceway per TV" },
              { service: "Hard Wall Surcharge", price: "+$25", note: "Brick, stone, concrete, tile" },
              { service: "Fireplace Install", price: "from +$25", note: "Heat clearance checked" },
              { service: "75\"+ / Large Frame", price: "Ask", note: "Call for quote" },
            ].map(p => (
              <div key={p.service} className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <p className="text-sm font-semibold text-black/70">{p.service}</p>
                <p className="mt-1 text-3xl font-black text-[#E50914]">{p.price}</p>
                <p className="mt-1 text-xs text-black/45">{p.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/book"
              className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">
              Book Your Frame TV Install
            </Link>
            <Link href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-black/15 px-8 py-4 font-semibold text-black hover:bg-black/5 transition">
              Full Pricing Page
            </Link>
          </div>

          {/* Cross-link */}
          <p className="mt-6 text-sm text-black/60 bg-gray-50 rounded-xl px-4 py-3 border border-black/8">
            Want a completely invisible finish?{" "}
            <Link href="/cable-concealment-nashville" className="font-semibold text-[#E50914] hover:underline underline-offset-2">
              We also offer professional cable concealment in Nashville
            </Link>{" "}
            — in-wall routing or surface raceway, $60 add-on per TV.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">
            Samsung Frame TV — Common Questions
          </h2>
          <div className="grid gap-4">
            {frameFaqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm open:shadow-md transition">
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
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Ready to Make Your Frame TV Look Perfect?
          </h2>
          <p className="mt-3 text-white/60 text-lg">
            Book same-day or next-day Samsung Frame TV installation in Nashville.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book"
              className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">
              Book Installation
            </Link>
            <a href="tel:+16156690251"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition">
              Call (615) 669-0251
            </a>
          </div>

          {/* Internal links */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-3 text-sm text-white/40">
            <Link href="/" className="hover:text-white/70 transition">Nashville</Link>
            <span>·</span>
            <Link href="/tv-mounting-brentwood" className="hover:text-white/70 transition">Brentwood</Link>
            <span>·</span>
            <Link href="/tv-mounting-franklin" className="hover:text-white/70 transition">Franklin</Link>
            <span>·</span>
            <Link href="/tv-mounting-murfreesboro" className="hover:text-white/70 transition">Murfreesboro</Link>
            <span>·</span>
            <Link href="/tv-mounting-over-fireplace-nashville" className="hover:text-white/70 transition">Fireplace Mounting</Link>
            <span>·</span>
            <Link href="/cable-concealment-nashville" className="hover:text-white/70 transition">Cable Concealment</Link>
          </div>
        </div>
      </section>

      <StickyActionBar />
    </>
  )
}
