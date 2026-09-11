import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import { PLAYSETS } from "../lib/playsets"

export const metadata = {
  title: "Playground Installation Nashville TN | Backyard Play Areas | PrimeTvNashville",
  description: "Backyard playground installation in Nashville TN. Play structures, swing sets, climbing frames, slides and trampolines assembled, anchored and safety-checked. Request a quote.",
  keywords: [
    "playground installation Nashville",
    "backyard playground Nashville TN",
    "playground assembly Nashville",
    "play structure installation Nashville",
    "swing set installation Nashville TN",
    "climbing frame assembly Nashville",
    "trampoline assembly Nashville TN",
  ],
  openGraph: {
    title: "Playground Installation Nashville TN | PrimeTvNashville",
    description: "Backyard playground installation in Nashville. Play structures, swing sets, climbing frames, slides and trampolines assembled and anchored.",
    url: "https://www.primetvnashville.com/playground-installation-nashville",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/playground-installation-nashville" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Playground Installation Nashville TN",
  "description": "Backyard playground installation in Nashville Tennessee including play structures, swing sets, climbing frames, slides, playhouses and trampolines.",
  "serviceType": "Playground Installation",
  "provider": {
    "@type": "LocalBusiness",
    "name": "PrimeTvNashville",
    "telephone": "+1-615-669-0251",
    "url": "https://www.primetvnashville.com",
    "address": { "@type": "PostalAddress", "addressLocality": "Nashville", "addressRegion": "TN", "addressCountry": "US" },
  },
  "areaServed": { "@type": "City", "name": "Nashville" },
}

// Deliberately different questions from the playset page — these are about the
// play area as a whole rather than about assembling one branded kit.
const faqs = [
  {
    q: "What counts as a backyard playground?",
    a: "Anything that makes up the play area: the main play structure or fort, a swing set, a standalone slide, a climbing frame or monkey bars, a playhouse, a trampoline, or several of those together. We assemble each piece and lay the whole area out so the parts work together instead of crowding each other.",
  },
  {
    q: "How much space do I need for a backyard playground?",
    a: "More than the footprint on the box. Every play structure needs clear space around it so a child can fall or jump without hitting a fence, a wall, a tree or another piece of equipment. Swings need the most room, out front and behind. We measure the area before we build and tell you honestly if the layout you want will fit.",
  },
  {
    q: "Can you lay out a playground with several pieces?",
    a: "Yes, and it is worth planning before anything is bolted together. A swing set placed too close to a slide exit, or a trampoline squeezed against a fence, creates a hazard that is hard to fix once everything is anchored. Send us what you have and we will plan the placement with you.",
  },
  {
    q: "Do you handle playground surfacing?",
    a: "We work with what is already there — grass, mulch, rubber mulch, pea gravel or level dirt — and we will tell you where the surface under and around the equipment falls short. We do not pour bonded rubber or install engineered safety surfacing; if your project needs that, you want a specialist surfacing contractor and we will say so rather than take the job.",
  },
  {
    q: "Do you install commercial or HOA playgrounds?",
    a: "We assemble pre-manufactured play structures for HOAs, churches, daycares and community spaces on the same basis as a residential build. Certified public playground installation to ASTM and CPSC standards, with engineered surfacing and formal inspection, is a specialist trade and not something we hold ourselves out as. Tell us the scope and we will be straight with you about whether it is ours.",
  },
  {
    q: "How long does a backyard playground take to install?",
    a: "A single swing set is usually half a day. A large fort runs a full day or two. A multi-piece play area with a structure, a trampoline and a playhouse can take several days depending on the pieces. We give you a realistic window once we know what you have.",
  },
  {
    q: "Do you anchor everything?",
    a: "Yes. Play structures, swing sets and trampolines all get anchored. An unanchored trampoline in a Middle Tennessee storm is a genuine hazard to your yard and your neighbours', and an unanchored swing set can walk out of position under load.",
  },
  {
    q: "Can you move or re-level a playground I already have?",
    a: "Often, yes. Relocating an assembled structure, re-anchoring it, or re-levelling one that has settled on a slope are all jobs we take. Some sets do not survive being taken apart and rebuilt — we will look at yours and tell you before we start.",
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

const EQUIPMENT = [
  {
    cat: "Play Structures & Forts",
    items: ["Wooden play forts", "Multi-level towers", "Clubhouse decks", "Tube & wave slides", "Rock climbing walls", "Cargo nets"],
  },
  {
    cat: "Swings & Climbing",
    items: ["Swing sets", "Swing beam add-ons", "Monkey bars", "Climbing frames", "Gym rings & trapeze", "Glider swings"],
  },
  {
    cat: "Standalone Pieces",
    items: ["Playhouses", "Trampolines", "Slides", "Sandboxes", "See-saws", "Balance beams"],
  },
  {
    cat: "Around the Play Area",
    items: ["Layout planning", "Ground anchoring", "Levelling checks", "Fall-zone spacing", "Relocation & re-anchoring", "Hardware re-torque"],
  },
]

export default function PlaygroundInstallationPage() {
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
            We do more than TV mounting
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-black">
            Backyard Playground<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              Installation in Nashville, TN
            </span>
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">
            A playground is rarely one box. It is a fort, a swing set, maybe a trampoline and a
            playhouse — and how they sit together in the yard matters as much as how each one is
            bolted. We build the whole play area: assembled, spaced, anchored and checked.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
              Request a Playground Quote
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
              Call (615) 669-0251
            </a>
          </div>

          {/* Pointer to the model pages — different intent, same service */}
          <div className="mt-8 rounded-2xl border border-black/10 bg-gray-50 px-5 py-4 max-w-2xl">
            <p className="text-sm text-black/65 leading-relaxed">
              <span className="font-bold text-black">Already bought a specific kit?</span>{" "}
              We have a page for each model we assemble — Backyard Discovery, Gorilla Playsets and
              KidKraft included.{" "}
              <Link href="/playset-installation-nashville" className="font-semibold text-[#E50914] hover:underline underline-offset-2">
                See playset installation by model →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* EQUIPMENT */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">What We Build</h2>
          <p className="text-black/60 mb-10 max-w-2xl">
            One piece or the whole yard. If it came flat-packed and children are going to climb on
            it, we assemble it properly.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EQUIPMENT.map(cat => (
              <div key={cat.cat} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="font-extrabold text-black mb-3 text-base">{cat.cat}</h3>
                <ul className="space-y-1.5">
                  {cat.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-black/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] flex-none" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAYOUT & SAFETY — the part a single-kit page doesn't cover */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Laying Out the Play Area</h2>
          <p className="text-black/60 mb-10 max-w-2xl">
            The mistakes that matter on a backyard playground are rarely about tightening a bolt.
            They are about where things end up.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "Clear space around every piece",
                desc: "Equipment needs room around it for a child who jumps, falls or runs off the end of a slide. Swings need the most — out front and behind. We measure before we build, not after.",
              },
              {
                title: "Slide exits and swing arcs",
                desc: "A slide that lands where a swing passes is the classic backyard layout mistake. We plan the exits and the arcs so no two pieces share the same space.",
              },
              {
                title: "Level ground first",
                desc: "A structure on a slope loads its frame and swing beam unevenly and settles badly over time. We check the grade and tell you up front if the site needs work before anything goes up.",
              },
              {
                title: "Fences, trees and overhead lines",
                desc: "We look up as well as down. Branches over a climbing frame and a set backed tight against a fence are both problems you only notice once it's built.",
              },
              {
                title: "Anchored, every piece",
                desc: "Play structures, swing sets and trampolines all get anchored. An unanchored trampoline in a Middle Tennessee storm ends up in a neighbour's yard.",
              },
              {
                title: "Honest surface assessment",
                desc: "We build on grass, mulch, rubber mulch, pea gravel or level dirt, and we'll tell you where the surface under the equipment falls short — without pretending a surfacing pour is something we do.",
              },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-black/10 p-6">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-extrabold text-black mb-2">{f.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-bold">Playground installation is quoted per job.</span> The price
              depends on how many pieces there are, their size, the surface and how much site
              preparation the yard needs — so we don&apos;t publish a flat rate. One of our sales
              representatives confirms your exact price before any work begins.
            </p>
          </div>
        </div>
      </section>

      {/* SCOPE — honest about where our work ends */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">What We Do — and What We Don&apos;t</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E50914] uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-[#E50914]" /> We handle this
              </div>
              <ul className="space-y-2.5 text-sm text-black/70">
                {[
                  "Backyard play structures, forts and swing sets",
                  "Trampolines, playhouses, slides and climbing frames",
                  "Multi-piece play area layout and spacing",
                  "Ground anchoring on every piece",
                  "Relocating and re-anchoring an existing set",
                  "Pre-manufactured structures for HOAs, churches and daycares",
                ].map(i => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E50914] flex-none" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-black/40 uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-black/30" /> We&apos;ll point you elsewhere
              </div>
              <ul className="space-y-2.5 text-sm text-black/60">
                {[
                  "Poured bonded rubber or engineered safety surfacing",
                  "Certified public playground installation to ASTM / CPSC standards",
                  "Formal playground safety inspection and certification",
                  "Concrete footings and in-ground civil work",
                  "Custom-fabricated or site-built structures",
                ].map(i => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black/25 flex-none" />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-black/50 leading-relaxed">
                Tell us the scope and we&apos;ll be straight with you about whether it is ours. We&apos;d
                rather send you to the right trade than take a job we shouldn&apos;t.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR MODELS */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-2xl font-extrabold text-black mb-2">Popular Playsets We Install</h2>
          <p className="text-black/60 mb-8 text-sm">
            Bought a specific kit? These have their own pages with model-specific details.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAYSETS.slice(0, 8).map(p => (
              <Link
                key={p.slug}
                href={`/playset-installation-nashville/${p.slug}`}
                className="group rounded-2xl border border-black/10 bg-gray-50 p-5 hover:border-[#E50914]/30 hover:bg-white hover:shadow-md transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/35">{p.brand}</span>
                <h3 className="mt-1 text-sm font-extrabold text-black group-hover:text-[#E50914] transition-colors leading-snug">
                  {p.name}
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

      {/* FAQ */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">Playground Installation Questions</h2>
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

      {/* SERVICE AREA */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Service Area</h2>
          <p className="text-black/60 mb-6">We build backyard playgrounds across Nashville and Middle Tennessee.</p>
          <div className="flex flex-wrap gap-2">
            {["Nashville", "Brentwood", "Franklin", "Murfreesboro", "Hendersonville", "Gallatin", "Lebanon", "Smyrna", "La Vergne", "Spring Hill", "Mount Juliet", "Nolensville"].map(city => (
              <span key={city} className="rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium text-black/70">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-black text-white py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Give Them the Whole Backyard</h2>
          <p className="mt-3 text-white/60 text-lg">
            Tell us what you&apos;ve bought — or what you&apos;re planning — and we&apos;ll build it right.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">
              Request a Playground Quote
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition">
              Call (615) 669-0251
            </a>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-3 text-sm text-white/40">
            <Link href="/playset-installation-nashville" className="hover:text-white/70 transition">Playset Installation</Link>
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
