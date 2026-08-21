import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"

export const metadata = {
  title: "Wall Installation Services Nashville TN | PrimeTvNashville",
  description: "Professional wall installation in Nashville TN. Floating shelves, curtain rods, blinds, whiteboards, cabinets and more. Residential and commercial service.",
  keywords: [
    "wall installation Nashville",
    "shelf installation Nashville",
    "floating shelves Nashville TN",
    "curtain rod installation Nashville",
    "blinds installation Nashville",
    "whiteboard installation Nashville",
    "wall mounted cabinet Nashville",
  ],
  openGraph: {
    title: "Wall Installation Services Nashville TN | PrimeTvNashville",
    description: "Professional wall installation in Nashville. Floating shelves, curtain rods, blinds, whiteboards and cabinets installed correctly.",
    url: "https://www.primetvnashville.com/wall-installation-services-nashville",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/wall-installation-services-nashville" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Wall Installation Services Nashville TN",
  "description": "Professional wall installation services in Nashville Tennessee including floating shelves, curtain rods, blinds, whiteboards and wall-mounted cabinets.",
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
    q: "Do you install floating shelves in Nashville?",
    a: "Yes. Floating shelves are one of our most popular installation requests. We locate studs or use appropriate anchors for your wall type, ensure shelves are level, and mount them securely. We install shelves from IKEA, Pottery Barn, Wayfair and any other brand.",
  },
  {
    q: "Do you install curtain rods?",
    a: "Yes. We install curtain rods and drapery hardware for any window size including large windows, double rods and specialty hardware. We ensure everything is level, properly anchored and aligned across multiple windows if needed.",
  },
  {
    q: "Can you install blinds and window treatments?",
    a: "Yes. We install inside-mount and outside-mount blinds, cellular shades, roller shades and similar window treatments. Just have the blinds purchased and we'll install them correctly.",
  },
  {
    q: "Do you install whiteboards for offices?",
    a: "Yes. We install whiteboards, dry-erase boards and cork boards for offices, conference rooms, schools and home offices. We use the correct anchors for the weight and ensure the board is level and secure.",
  },
  {
    q: "What wall types can you install on?",
    a: "We install on drywall, plaster, brick, tile and concrete. Different wall types require different anchoring techniques and hardware. We come prepared for any surface.",
  },
  {
    q: "Do you install wall-mounted cabinets?",
    a: "Yes. We install floating cabinets, wall-mounted storage units and similar pieces that require secure anchoring. Proper installation is especially important for heavy cabinetry — we ensure it's correctly mounted to handle the load.",
  },
]

const SERVICES = [
  {
    cat: "Shelving",
    items: ["Floating shelves", "Wall shelves", "Open shelving", "Bathroom shelves", "Closet shelving", "Display ledges"],
  },
  {
    cat: "Window Treatments",
    items: ["Curtain rods", "Drapery hardware", "Roller blinds", "Cellular shades", "Venetian blinds", "Blackout curtains"],
  },
  {
    cat: "Storage & Cabinets",
    items: ["Wall-mounted cabinets", "Floating cabinets", "Garage wall storage", "Bathroom vanity shelves", "Laundry room storage"],
  },
  {
    cat: "Office & Décor",
    items: ["Whiteboards", "Cork boards", "Magnetic boards", "Wall-mounted organizers", "Wall décor items", "Nameplate signage"],
  },
]

export default function WallInstallationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="relative w-full bg-white text-black overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#E50914] via-black to-[#E50914]" />
        <div aria-hidden="true" className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#E50914]/6 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 md:px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/70 mb-5">
            <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
            Professional Installation Services · Nashville TN
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-black">
            Wall Installation Services<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              in Nashville, TN
            </span>
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">
            Professional installation for floating shelves, curtain rods, blinds, whiteboards, wall-mounted
            cabinets and other wall installations throughout Nashville and surrounding areas.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
              Request a Quote
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
              Call (615) 669-0251
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">What We Install</h2>
          <p className="text-black/60 mb-10">Shelves, curtain rods, blinds, cabinets and everything in between.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((cat) => (
              <div key={cat.cat} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="font-extrabold text-black mb-3 text-base">{cat.cat}</h3>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
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

      {/* WHY */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">Installed Correctly the First Time</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: "Properly Anchored", desc: "Whether it's studs, toggle bolts or masonry anchors — we use the right hardware for every wall type and load requirement." },
              { title: "Level & Aligned", desc: "Shelves, rods and cabinets installed perfectly level. Multiple pieces aligned consistently across the wall or room." },
              { title: "Any Wall Surface", desc: "Drywall, plaster, brick, tile or concrete. We're equipped for any surface and any installation type." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/10 p-6">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-extrabold text-black mb-2">{f.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-gray-50 border border-black/5 p-6 text-sm text-black/60 leading-relaxed">
            Need to hide cables along the wall too? Check our{" "}
            <Link href="/cable-concealment-nashville" className="font-semibold text-[#E50914] hover:underline underline-offset-2">
              cable concealment service
            </Link>{" "}
            — clean shelf installation and hidden wires go great together.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">Wall Installation Questions</h2>
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

      {/* CTA */}
      <section className="w-full bg-black text-white py-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Get Your Walls Installed?</h2>
          <p className="mt-3 text-white/60 text-lg">Shelves, curtain rods, blinds and more throughout Nashville.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">
              Request a Quote
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
            <Link href="/furniture-assembly-nashville" className="hover:text-white/70 transition">Furniture Assembly</Link>
            <span>·</span>
            <Link href="/picture-mirror-hanging-nashville" className="hover:text-white/70 transition">Mirror & Picture Hanging</Link>
          </div>
        </div>
      </section>

      <StickyActionBar />
    </>
  )
}
