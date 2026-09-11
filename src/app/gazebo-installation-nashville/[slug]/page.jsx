import Link from "next/link"
import { notFound } from "next/navigation"
import StickyActionBar from "../../components/StickyActionBar"
import {
  GAZEBOS, getGazebo, gazeboTime, gazeboRoofLabel, gazeboMaterial, relatedGazebos,
} from "../../lib/gazebos"

const BASE = "https://www.primetvnashville.com"

// All 15 model pages are pre-rendered at build time.
export function generateStaticParams() {
  return GAZEBOS.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const g = getGazebo(slug)
  if (!g) return {}

  const title = `${g.name} Installation Nashville TN | PrimeTvNashville`
  const description = `Professional ${g.name} assembly in Nashville TN. Level base, squared frame, correctly seated roof and proper anchoring. Request a quote.`
  const url = `${BASE}/gazebo-installation-nashville/${g.slug}`

  return {
    title,
    description,
    keywords: [
      `${g.name} installation Nashville`,
      `${g.name} assembly`,
      `${g.brand} gazebo installation Nashville TN`,
      `${g.size} gazebo assembly Nashville`,
      "gazebo installation Nashville",
      "hardtop gazebo assembly Nashville TN",
    ],
    openGraph: {
      title: `${g.name} Installation Nashville | PrimeTvNashville`,
      description,
      url,
      siteName: "PrimeTvNashville",
      locale: "en_US",
      type: "website",
    },
    alternates: { canonical: url },
  }
}

export default async function GazeboModelPage({ params }) {
  const { slug } = await params
  const g = getGazebo(slug)
  if (!g) notFound()

  const time     = gazeboTime(g.tier)
  const roof     = gazeboRoofLabel(g.roof)
  const material = gazeboMaterial(g.material)
  const related  = relatedGazebos(g.slug)
  const isWood   = g.material === "wood"
  const isSoft   = g.roof === "softtop"
  const isBig    = g.tier === "large" || g.tier === "xlarge"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${g.name} Installation Nashville TN`,
    "description": `Professional assembly and installation of the ${g.name} in Nashville Tennessee.`,
    "serviceType": "Gazebo Installation",
    "provider": {
      "@type": "LocalBusiness",
      "name": "PrimeTvNashville",
      "telephone": "+1-615-669-0251",
      "url": BASE,
      "address": { "@type": "PostalAddress", "addressLocality": "Nashville", "addressRegion": "TN", "addressCountry": "US" },
    },
    "areaServed": { "@type": "City", "name": "Nashville" },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "Gazebo Installation Nashville", "item": `${BASE}/gazebo-installation-nashville` },
      { "@type": "ListItem", "position": 3, "name": `${g.name} Installation`, "item": `${BASE}/gazebo-installation-nashville/${g.slug}` },
    ],
  }

  const faqs = [
    {
      q: `How much does ${g.name} installation cost in Nashville?`,
      a: `This model is quoted per job. The price depends on the surface it is going on, how level that surface is and how much site preparation the spot needs. Send us your ZIP code and the surface and one of our sales representatives will confirm your exact price before any work begins.`,
    },
    {
      q: `How long does it take to assemble the ${g.name}?`,
      a: `Typically ${time} for a ${g.size} ${roof.toLowerCase()} of this construction. That is approximate — a level concrete patio shortens it, a sloped lawn or a missing part lengthens it. We give you a realistic window when we quote.`,
    },
    {
      q: `What surface can the ${g.name} go on?`,
      a: `Concrete patio, pavers, a wood deck, compacted gravel or level ground all work, and each one is anchored differently. The surface is the first thing we ask about, because it changes both the anchoring hardware and the price.`,
    },
    isWood
      ? {
          q: `Does the ${g.name} need a level base?`,
          a: `Yes, and more so than a metal gazebo. Cedar posts and beams are heavy, and a wood frame built out of level puts the load onto the wrong joints and racks over time. We check the grade before anything goes vertical and tell you honestly if the site needs work first.`,
        }
      : {
          q: `Does the ${g.name} need a level base?`,
          a: `Yes. An aluminium or steel frame built out of square is difficult to correct once the roof is on, and a frame that is not level will not let the roof panels seat the way they are designed to. We square and level the base before the roof is loaded onto it.`,
        },
    isSoft
      ? {
          q: `How is the canopy tensioned on the ${g.name}?`,
          a: `Evenly, and that is the whole trick. A soft top that is slack in one corner pools water in the first real rain, and standing water is what stretches and eventually splits a canopy. We tension it properly and show you how to re-tension it after a storm.`,
        }
      : {
          q: `Do the roof panels on the ${g.name} need to be sealed?`,
          a: `They need to be seated and overlapped correctly, which is what the design relies on to shed water — not sealant. A panel that is out of position or fastened in the wrong order is the usual reason a hardtop leaks at a seam. We follow the panel sequence in the manual.`,
        },
    {
      q: `Do I need the ${g.name} delivered before you arrive?`,
      a: `Yes. All boxes need to be at the property before our crew arrives. Once everything has been delivered, let us know and we will schedule the build. If a box arrives damaged, it is far better to find that out before the appointment than halfway through it.`,
    },
    {
      q: `What if parts are missing from my ${g.brand} kit?`,
      a: `We inventory the hardware before the first bolt goes in, so a shortage shows up at the start rather than at the last step. If something is missing we tell you straight away so you can claim it from the manufacturer, and we come back to finish once it arrives.`,
    },
    {
      q: `Can you assemble a gazebo I bought somewhere else?`,
      a: `Yes. We do not sell gazebos — we install them. Lowe's, Home Depot, Costco, Sam's Club, Amazon, Wayfair or direct from ${g.brand}: if it came in boxes, we can build it.`,
    },
  ]

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  }

  // Steps that genuinely differ by construction, so each page reads to its model.
  const BUILD_STEPS = [
    {
      title: "Hardware inventory before we start",
      desc: "These kits ship with a lot of small hardware. We count and sort it first, so a shortage is found at the beginning of the job instead of at the final bolt.",
    },
    {
      title: "Surface check and anchoring plan",
      desc: `Concrete, pavers, deck or ground — each is anchored differently. We confirm the surface and the anchoring method for your ${g.size} footprint before we build, not after.`,
    },
    isWood
      ? {
          title: "Level base before anything goes vertical",
          desc: "Cedar posts and beams are heavy and unforgiving. A wood frame built out of level racks over time and puts load onto joints that were never meant to carry it. We check the grade first.",
        }
      : {
          title: "Frame squared and levelled first",
          desc: "A metal frame out of square is very hard to correct once the roof is on, and it stops the roof panels seating properly. We square and level before the roof is loaded.",
        },
    isSoft
      ? {
          title: "Canopy tensioned evenly",
          desc: "A slack corner pools water in the first heavy rain, and standing water is what splits a canopy. We tension it properly and show you how to re-tension after a storm.",
        }
      : {
          title: "Roof panels seated in sequence",
          desc: "Hardtop roofs shed water through correct overlap, not sealant. Panels go on in the order the manual specifies — a panel fastened out of sequence is the usual cause of a seam leak.",
        },
    {
      title: isBig ? "Crewed for the span" : "Built by a crew, not a solo installer",
      desc: isBig
        ? `A ${g.size} roof span is not a one-person lift. We bring enough hands to raise and seat the roof safely instead of improvising with ladders.`
        : "Even a compact gazebo has lifts that are unsafe alone. We bring enough hands to raise and seat the roof without forcing anything.",
    },
    {
      title: "Packaging broken down",
      desc: "Cardboard and packaging broken down and stacked. Ask us to include full haul-away in the quote if you'd rather it disappear entirely.",
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* HERO */}
      <section className="relative w-full bg-white text-black overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#E50914] via-black to-[#E50914]" />
        <div aria-hidden="true" className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#E50914]/6 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 md:px-6 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-black/40">
            <Link href="/" className="hover:text-[#E50914] transition">Home</Link>
            <span>/</span>
            <Link href="/gazebo-installation-nashville" className="hover:text-[#E50914] transition">Gazebo Installation</Link>
            <span>/</span>
            <span className="text-black/60 font-medium">{g.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/70 mb-5">
            <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
            {g.brand} · {g.size} · {roof}
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight text-black">
            {g.name}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              Installation in Nashville, TN
            </span>
          </h1>

          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">{g.blurb}</p>

          <p className="mt-4 text-base text-black/70 max-w-2xl leading-relaxed">
            You know us for TV mounting — but our crew builds these too. We assemble the {g.name} at
            your home across Nashville and Middle Tennessee: squared, levelled, anchored to your
            surface and checked before we leave.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
              Get a Quote for This Gazebo
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
              Call (615) 669-0251
            </a>
          </div>

          {/* Quick facts */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Footprint",     value: g.size },
              { label: "Roof",          value: roof },
              { label: "Frame",         value: material },
              { label: "Assembly time", value: `Approx. ${time.split(",")[0]}` },
            ].map(f => (
              <div key={f.label} className="rounded-2xl border border-black/10 bg-gray-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/35">{f.label}</p>
                <p className="mt-1 text-sm font-extrabold text-black leading-snug">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODEL-SPECIFIC NOTE */}
      {g.installNote && (
        <section className="w-full bg-white pb-4">
          <div className="max-w-5xl mx-auto px-5 md:px-6">
            <div className="rounded-2xl border-l-4 border-[#E50914] bg-gray-50 px-6 py-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/35 mb-2">
                Worth knowing about this model
              </p>
              <p className="text-base text-black/75 leading-relaxed">{g.installNote}</p>
            </div>
          </div>
        </section>
      )}

      {/* WHAT WE HANDLE */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">
            What We Handle on a {g.name} Build
          </h2>
          <p className="text-black/60 mb-10 max-w-2xl">
            {isBig
              ? `At ${g.size} this is a large structure. The roof span and the weight are exactly where a DIY build gets unsafe.`
              : `A ${g.size} footprint is manageable — but the base and the roof still have to be right the first time.`}
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {BUILD_STEPS.map(f => (
              <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-extrabold text-black mb-2">{f.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-bold">{g.name} installation is quoted per job.</span> The price
              depends on the surface, how level it is and how much site preparation the spot needs,
              so we don&apos;t publish a flat rate. One of our sales representatives confirms your
              exact price before any work begins.
            </p>
          </div>
        </div>
      </section>

      {/* MORE THAN TVS */}
      <section className="w-full bg-white py-14">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <div className="rounded-2xl bg-black text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">
                More than TV mounting
              </p>
              <h2 className="text-xl md:text-2xl font-extrabold mb-2">
                Same crew. Same care. Bigger projects.
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                PrimeTvNashville built its name on professional TV mounting — and the same attention
                to level lines, correct anchors and a clean finish is what we bring to your {g.brand}{" "}
                gazebo. Playgrounds, furniture, mirrors and shelving too.
              </p>
            </div>
            <Link
              href="/home-installation-services-nashville"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#E50914] px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition shadow-lg shadow-red-500/30"
            >
              See All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">{g.name} — Common Questions</h2>
          <div className="grid gap-4">
            {faqs.map((faq, i) => (
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

      {/* RELATED MODELS */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-2xl font-extrabold text-black mb-2">Other Gazebos We Install</h2>
          <p className="text-black/60 mb-8 text-sm">Comparing models? We assemble these too.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map(r => (
              <Link
                key={r.slug}
                href={`/gazebo-installation-nashville/${r.slug}`}
                className="group rounded-2xl border border-black/10 bg-gray-50 p-5 hover:border-[#E50914]/30 hover:bg-white hover:shadow-md transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/35">
                  {r.brand} · {r.size}
                </span>
                <h3 className="mt-1 text-sm font-extrabold text-black group-hover:text-[#E50914] transition-colors leading-snug">
                  {r.name}
                </h3>
                <span className="mt-3 block text-xs font-semibold text-[#E50914]">View details →</span>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/gazebo-installation-nashville"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-black hover:bg-black hover:text-white transition-all"
            >
              View All Gazebos We Install →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-black text-white py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Let Us Build Your {g.brand} Gazebo
          </h2>
          <p className="mt-3 text-white/60 text-lg">
            Skip the weekend. Send us the model and the surface, and we&apos;ll take it from there.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">
              Request a Quote
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition">
              Call (615) 669-0251
            </a>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-3 text-sm text-white/40">
            <Link href="/gazebo-installation-nashville" className="hover:text-white/70 transition">All Gazebos</Link>
            <span>·</span>
            <Link href="/playground-installation-nashville" className="hover:text-white/70 transition">Playground Installation</Link>
            <span>·</span>
            <Link href="/home-installation-services-nashville" className="hover:text-white/70 transition">All Installation Services</Link>
            <span>·</span>
            <Link href="/" className="hover:text-white/70 transition">TV Mounting Nashville</Link>
          </div>
        </div>
      </section>

      <StickyActionBar />
    </>
  )
}
