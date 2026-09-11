import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import { PLAYSETS, PLAYSET_BRANDS, playsetTime, playsetTierLabel } from "../lib/playsets"

export const metadata = {
  title: "Playset Installation Nashville TN | Swing Set Assembly | PrimeTvNashville",
  description: "Professional playset and swing set installation in Nashville TN. Backyard Discovery, Gorilla Playsets, KidKraft and more assembled safely by our crew. Request a quote.",
  keywords: [
    "playset installation Nashville",
    "swing set assembly Nashville TN",
    "playset assembly Nashville",
    "Backyard Discovery installation Nashville",
    "swing set installer Nashville",
    "wooden playset assembly Nashville TN",
    "Gorilla Playsets assembly Nashville",
  ],
  openGraph: {
    title: "Playset Installation Nashville TN | PrimeTvNashville",
    description: "Professional playset and swing set assembly in Nashville. Backyard Discovery, Gorilla Playsets, KidKraft and more.",
    url: "https://www.primetvnashville.com/playset-installation-nashville",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/playset-installation-nashville" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Playset Installation Nashville TN",
  "description": "Professional playset and swing set assembly in Nashville Tennessee, including Backyard Discovery, Gorilla Playsets and KidKraft wooden playsets.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "PrimeTvNashville",
    "telephone": "+1-615-669-0251",
    "url": "https://www.primetvnashville.com",
    "address": { "@type": "PostalAddress", "addressLocality": "Nashville", "addressRegion": "TN", "addressCountry": "US" },
  },
  "areaServed": { "@type": "City", "name": "Nashville" },
}

const faqs = [
  {
    q: "How much does playset installation cost in Nashville?",
    a: "Playset assembly is quoted per job. The price depends on the model, the size of the structure, the surface it is going on and how much site preparation the yard needs. Send us the brand and model and one of our sales representatives will confirm your exact price before we start.",
  },
  {
    q: "How long does it take to assemble a playset?",
    a: "A compact swing set is usually a 4 to 8 hour job. Mid-size playsets run 6 to 12 hours. Large forts like the Skyfort II or Sterling Point often take 10 to 20 hours and are frequently split across two days. These are approximate — the yard and the surface change the timeline.",
  },
  {
    q: "Does the playset need to be delivered before you arrive?",
    a: "Yes. The boxes need to be at the property before our crew arrives. Let us know once everything has been delivered and we will schedule the assembly. If a box is missing or damaged, it is much better to find out before the appointment than during it.",
  },
  {
    q: "What surfaces can a playset be installed on?",
    a: "Grass, mulch, rubber mulch, pea gravel and level dirt all work. The critical part is that the ground is reasonably level — a playset built on a slope puts uneven load on the frame and the swing beam. We assess the site and tell you honestly if it needs levelling first.",
  },
  {
    q: "Do you anchor the playset to the ground?",
    a: "Yes. Ground anchors are part of every install. An unanchored playset can shift or tip under the load of children swinging, which is exactly the failure mode anchoring prevents. We use the anchor kit supplied with your set, or source the right one if it did not come with any.",
  },
  {
    q: "Can you assemble a playset you did not sell us?",
    a: "Yes. We do not sell playsets — we install them. Whether you bought it from Costco, Sam's Club, Walmart, Amazon or direct from the manufacturer, if it arrived in boxes we can put it together.",
  },
  {
    q: "What if parts are missing from the box?",
    a: "It happens more often than you would expect on large kits. We inventory the hardware before starting so a missing part is found at the beginning rather than at the last bolt. If something is missing, we tell you immediately so you can claim it from the manufacturer, and we schedule a return visit to finish.",
  },
  {
    q: "Do you remove the boxes and packaging?",
    a: "We break down and stack the packaging for you. Ask us when you book if you want it hauled away entirely and we will include it in the quote.",
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

const INCLUDED = [
  { title: "Hardware Inventory First", desc: "We count and sort the hardware before the first bolt goes in, so a missing part surfaces at the start of the job instead of at the end." },
  { title: "Site & Level Check", desc: "We check the ground before building. A playset on a slope loads the frame unevenly, so we tell you up front if the site needs work." },
  { title: "Built to the Manual", desc: "Torque sequence, bracket orientation and beam placement follow the manufacturer's instructions — the details that decide whether a set stays square for years." },
  { title: "Ground Anchoring", desc: "Anchors go in as part of every install. An unanchored set can shift or tip under swinging load." },
  { title: "Safety Walkthrough", desc: "We check every swing hanger, rail and slide connection, then walk the finished set with you before we leave." },
  { title: "Packaging Cleaned Up", desc: "Cardboard and packaging broken down and stacked. Full haul-away available if you want it in the quote." },
]

export default function PlaysetInstallationPage() {
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
            Playset &amp; Swing Set<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              Installation in Nashville, TN
            </span>
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">
            That box of cedar in your driveway is a full weekend — sometimes two. Our crew assembles
            Backyard Discovery, Gorilla Playsets and KidKraft playsets across Nashville and Middle
            Tennessee: built to the manual, anchored to the ground, and safety-checked before we leave.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
              Request a Playset Quote
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
              Call (615) 669-0251
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            <p className="text-xs font-semibold text-black/40 mr-1 self-center">Brands we assemble:</p>
            {[...PLAYSET_BRANDS, "Costco & Sam's Club kits", "Other brands"].map(b => (
              <span key={b} className="text-xs font-medium border border-black/10 rounded-full px-3 py-1 text-black/60">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* MODELS */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Playsets We Install</h2>
          <p className="text-black/60 mb-10 max-w-2xl">
            These are models we assemble regularly. Don&apos;t see yours? We install any playset that
            came in a box — send us the brand and model for a quote.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLAYSETS.map(p => (
              <Link
                key={p.slug}
                href={`/playset-installation-nashville/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:border-[#E50914]/30 hover:shadow-lg transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/35">{p.brand}</span>
                <h3 className="mt-1 text-base font-extrabold text-black group-hover:text-[#E50914] transition-colors leading-snug">
                  {p.name}
                </h3>
                <p className="mt-2 text-xs text-black/50">
                  {playsetTierLabel(p.tier)} · approx. {playsetTime(p.tier)}
                </p>
                <span className="mt-4 text-sm font-semibold text-[#E50914] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Installation details →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-black/10 bg-white px-5 py-4">
            <p className="text-sm text-black/65 leading-relaxed">
              <span className="font-bold text-black">Planning the whole play area?</span>{" "}
              If you are adding a trampoline, a playhouse or a climbing frame alongside the set, the
              layout matters as much as the build.{" "}
              <Link href="/playground-installation-nashville" className="font-semibold text-[#E50914] hover:underline underline-offset-2">
                See backyard playground installation →
              </Link>
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6">
            <h3 className="font-extrabold text-black mb-1">Model not listed?</h3>
            <p className="text-sm text-black/60 mb-4">
              We assemble playsets from any brand and any retailer. Send us the model and we&apos;ll quote it.
            </p>
            <Link href="/get-installation-quote" className="inline-flex items-center gap-2 rounded-full bg-[#E50914] px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">What Every Playset Install Includes</h2>
          <p className="text-black/60 mb-10">The same care we bring to a TV on a wall, applied to a structure children climb on.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDED.map(f => (
              <div key={f.title} className="rounded-2xl border border-black/10 p-6">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-extrabold text-black mb-2">{f.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-bold">Playset installation is quoted per job.</span> The price depends
              on the model, the size of the structure, the surface and how much site preparation the yard
              needs — so we don&apos;t publish a flat rate. One of our sales representatives confirms your
              exact price before any work begins.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { step: "01", title: "Send Us the Model", desc: "Tell us the brand and model, your ZIP code and the surface it's going on. We come back with a quote and a realistic time estimate." },
              { step: "02", title: "Get It Delivered", desc: "Have the boxes delivered to your property. Once everything has arrived, we lock in the assembly date." },
              { step: "03", title: "We Build It", desc: "Our crew assembles, anchors and safety-checks the set on site, then walks the finished playset with you." },
            ].map(s => (
              <div key={s.step} className="rounded-2xl border border-black/10 bg-white p-6">
                <p className="text-3xl font-black text-[#E50914]/20 mb-3">{s.step}</p>
                <h3 className="font-extrabold text-black mb-2">{s.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">Playset Installation Questions</h2>
          <div className="grid gap-4">
            {faqs.map((faq, i) => (
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

      {/* SERVICE AREA */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Service Area</h2>
          <p className="text-black/60 mb-6">We assemble playsets across Nashville and Middle Tennessee.</p>
          <div className="flex flex-wrap gap-2">
            {["Nashville", "Brentwood", "Franklin", "Murfreesboro", "Hendersonville", "Gallatin", "Lebanon", "Smyrna", "La Vergne", "Spring Hill", "Mount Juliet", "Nolensville"].map(city => (
              <span key={city} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-black/70">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-black text-white py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Leave the Build to Us</h2>
          <p className="mt-3 text-white/60 text-lg">
            Playsets, gazebos, furniture, mirrors and shelves — and yes, still the best TV mounting in Nashville.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">
              Request a Playset Quote
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition">
              Call (615) 669-0251
            </a>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-3 text-sm text-white/40">
            <Link href="/" className="hover:text-white/70 transition">TV Mounting Nashville</Link>
            <span>·</span>
            <Link href="/home-installation-services-nashville" className="hover:text-white/70 transition">All Installation Services</Link>
            <span>·</span>
            <Link href="/gazebo-installation-nashville" className="hover:text-white/70 transition">Gazebo Assembly</Link>
            <span>·</span>
            <Link href="/furniture-assembly-nashville" className="hover:text-white/70 transition">Furniture Assembly</Link>
          </div>
        </div>
      </section>

      <StickyActionBar />
    </>
  )
}
