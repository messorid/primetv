import Link from "next/link"
import { notFound } from "next/navigation"
import StickyActionBar from "../../components/StickyActionBar"
import {
  PLAYSETS, getPlayset, playsetTime, playsetTierLabel, relatedPlaysets,
} from "../../lib/playsets"

const BASE = "https://www.primetvnashville.com"

// All 15 model pages are pre-rendered at build time.
export function generateStaticParams() {
  return PLAYSETS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const p = getPlayset(slug)
  if (!p) return {}

  const title = `${p.name} Installation Nashville TN | PrimeTvNashville`
  const description = `Professional ${p.name} assembly in Nashville TN. Built to the manual, anchored and safety-checked by our crew. Request a quote today.`
  const url = `${BASE}/playset-installation-nashville/${p.slug}`

  return {
    title,
    description,
    keywords: [
      `${p.name} installation Nashville`,
      `${p.name} assembly`,
      `${p.name} installer near me`,
      `${p.brand} installation Nashville TN`,
      "playset installation Nashville",
      "swing set assembly Nashville TN",
    ],
    openGraph: {
      title: `${p.name} Installation Nashville | PrimeTvNashville`,
      description,
      url,
      siteName: "PrimeTvNashville",
      locale: "en_US",
      type: "website",
    },
    alternates: { canonical: url },
  }
}

export default async function PlaysetModelPage({ params }) {
  const { slug } = await params
  const p = getPlayset(slug)
  if (!p) notFound()

  const time    = playsetTime(p.tier)
  const tier    = playsetTierLabel(p.tier)
  const related = relatedPlaysets(p.slug)
  const isLarge = p.tier === "large"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${p.name} Installation Nashville TN`,
    "description": `Professional assembly and installation of the ${p.name} playset in Nashville Tennessee.`,
    "serviceType": "Playset Installation",
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
      { "@type": "ListItem", "position": 2, "name": "Playset Installation Nashville", "item": `${BASE}/playset-installation-nashville` },
      { "@type": "ListItem", "position": 3, "name": `${p.name} Installation`, "item": `${BASE}/playset-installation-nashville/${p.slug}` },
    ],
  }

  const faqs = [
    {
      q: `How much does ${p.name} installation cost in Nashville?`,
      a: `The ${p.name} is quoted per job. The price depends on your yard, the surface the set is going on and how much site preparation is needed. Send us your ZIP code and we will confirm the exact price before any work begins — one of our sales representatives handles that, not an automated estimate.`,
    },
    {
      q: `How long does it take to assemble the ${p.name}?`,
      a: `Typically ${time} for this ${tier.toLowerCase()}. That is approximate — level ground and a complete box shorten it, a sloped yard or a missing part lengthens it. We give you a realistic window when we quote.`,
    },
    {
      q: `Do I need to have the ${p.name} delivered first?`,
      a: `Yes. All boxes need to be at the property before our crew arrives. Once everything is delivered, let us know and we will schedule the build. If a box arrives damaged, it is far better to find out before the appointment.`,
    },
    {
      q: `Do you anchor the ${p.name} to the ground?`,
      a: `Always. Ground anchors are part of every playset install we do. An unanchored set can shift or tip under the load of children swinging, and anchoring is what prevents exactly that. We use the anchor kit supplied with your set or source the correct one.`,
    },
    {
      q: `What if parts are missing from my ${p.name} kit?`,
      a: `We inventory the hardware before the first bolt goes in, so a shortage shows up at the start rather than at the last step. If something is missing we tell you straight away so you can claim it from the manufacturer, and we come back to finish once it arrives.`,
    },
    {
      q: `Can you assemble a ${p.brand} set I bought somewhere else?`,
      a: `Yes. We do not sell playsets — we install them. Costco, Sam's Club, Walmart, Amazon or direct from ${p.brand}: if it came in boxes, we can build it.`,
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
            <Link href="/playset-installation-nashville" className="hover:text-[#E50914] transition">Playset Installation</Link>
            <span>/</span>
            <span className="text-black/60 font-medium">{p.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/70 mb-5">
            <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
            {p.brand} · {tier}
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight text-black">
            {p.name}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              Installation in Nashville, TN
            </span>
          </h1>

          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">{p.blurb}</p>

          <p className="mt-4 text-base text-black/70 max-w-2xl leading-relaxed">
            You know us for TV mounting — but our crew builds these too. We assemble the {p.name} at
            your home across Nashville and Middle Tennessee: built to the manual, anchored to the
            ground, and safety-checked before we leave.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
              Get a Quote for This Playset
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
              Call (615) 669-0251
            </a>
          </div>

          {/* Quick facts */}
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              { label: "Brand",            value: p.brand },
              { label: "Assembly time",    value: `Approx. ${time}` },
              { label: "Installation cost", value: "By quote" },
            ].map(f => (
              <div key={f.label} className="rounded-2xl border border-black/10 bg-gray-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/35">{f.label}</p>
                <p className="mt-1 text-sm font-extrabold text-black">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">
            What We Handle on a {p.name} Build
          </h2>
          <p className="text-black/60 mb-10 max-w-2xl">
            {isLarge
              ? "This is one of the bigger kits on the market. The step count and the height of the towers are exactly where a DIY build goes wrong."
              : "A straightforward set to live with — and a long afternoon to build correctly the first time."}
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "Hardware inventory before we start",
                desc: "Large cedar kits ship with hundreds of pieces of hardware. We count and sort everything first, so a shortage is found at the beginning of the job instead of at the final bolt.",
              },
              {
                title: "Site assessment and levelling check",
                desc: "We check the ground before building. A playset on a slope loads the frame and the swing beam unevenly. If the site needs work, we tell you before we start — not after.",
              },
              {
                title: "Assembled to the manufacturer's manual",
                desc: `Torque sequence, bracket orientation and beam placement follow ${p.brand}'s instructions. These are the details that decide whether the set is still square in five years.`,
              },
              {
                title: "Ground anchoring included",
                desc: "Anchors go in on every install. An unanchored playset can shift or tip under swinging load, and anchoring is what prevents it.",
              },
              {
                title: "Slide, swing and rail safety check",
                desc: "Every swing hanger, guardrail and slide connection gets checked before we hand it over. We walk the finished set with you.",
              },
              {
                title: "Packaging broken down",
                desc: "Cardboard and packaging broken down and stacked. Ask us to include full haul-away in the quote if you'd rather it disappear entirely.",
              },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-extrabold text-black mb-2">{f.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-bold">{p.name} installation is quoted per job.</span> The price
              depends on your yard, the surface and how much site preparation is needed, so we
              don&apos;t publish a flat rate. One of our sales representatives confirms your exact
              price before any work begins.
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
                PrimeTvNashville built its name on professional TV mounting — and that same attention
                to level lines, correct anchors and a clean finish is what we bring to your {p.brand}{" "}
                playset. Gazebos, furniture, mirrors and shelving too.
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
          <h2 className="text-3xl font-extrabold text-black mb-8">{p.name} — Common Questions</h2>
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
          <h2 className="text-2xl font-extrabold text-black mb-2">Other Playsets We Install</h2>
          <p className="text-black/60 mb-8 text-sm">Assembling a different model? We build these too.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map(r => (
              <Link
                key={r.slug}
                href={`/playset-installation-nashville/${r.slug}`}
                className="group rounded-2xl border border-black/10 bg-gray-50 p-5 hover:border-[#E50914]/30 hover:bg-white hover:shadow-md transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/35">{r.brand}</span>
                <h3 className="mt-1 text-sm font-extrabold text-black group-hover:text-[#E50914] transition-colors leading-snug">
                  {r.name}
                </h3>
                <span className="mt-3 block text-xs font-semibold text-[#E50914]">View details →</span>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/playset-installation-nashville"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-black hover:bg-black hover:text-white transition-all"
            >
              View All Playsets We Install →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-black text-white py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Let Us Build Your {p.brand} Playset
          </h2>
          <p className="mt-3 text-white/60 text-lg">
            Skip the weekend. Send us the model and we&apos;ll take it from there.
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
            <Link href="/playset-installation-nashville" className="hover:text-white/70 transition">All Playsets</Link>
            <span>·</span>
            <Link href="/gazebo-installation-nashville" className="hover:text-white/70 transition">Gazebo Assembly</Link>
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
