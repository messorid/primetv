import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"

export const metadata = {
  title: "Furniture Assembly Nashville TN | PrimeTvNashville",
  description: "Professional furniture assembly in Nashville TN. IKEA, office, bedroom and home furniture assembled quickly and correctly. Book your appointment today.",
  keywords: [
    "furniture assembly Nashville",
    "furniture assembly service Nashville TN",
    "IKEA furniture assembly Nashville",
    "office furniture assembly Nashville",
    "furniture installer Nashville",
    "bed assembly Nashville",
    "desk assembly Nashville",
  ],
  openGraph: {
    title: "Furniture Assembly Nashville TN | PrimeTvNashville",
    description: "Professional furniture assembly in Nashville. IKEA, office, bedroom and home furniture. Fast, reliable service.",
    url: "https://www.primetvnashville.com/furniture-assembly-nashville",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/furniture-assembly-nashville" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Furniture Assembly Nashville TN",
  "description": "Professional furniture assembly in Nashville Tennessee. IKEA, office, bedroom and home furniture assembled by experienced installers.",
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
    q: "Do you assemble IKEA furniture in Nashville?",
    a: "Yes. IKEA furniture is one of our most common requests. We assemble all IKEA product lines including PAX wardrobes, KALLAX shelves, MALM beds, HEMNES dressers, ALEX desks and more. Just have the boxes delivered and we handle the rest.",
  },
  {
    q: "How much does furniture assembly cost in Nashville?",
    a: "Pricing depends on the type and number of pieces. Request a quote through our online form and we'll provide a price based on the specific items. Most single-piece assemblies are straightforward and priced accordingly.",
  },
  {
    q: "How long does furniture assembly take?",
    a: "A typical single piece — bed frame, desk or dresser — takes 30 to 90 minutes depending on complexity. Larger wardrobes or multi-piece sets take longer. We'll give you a time estimate when you book.",
  },
  {
    q: "Do I need to provide any tools?",
    a: "No. Our team brings all necessary tools for furniture assembly. You just need to have the furniture boxes available at the location.",
  },
  {
    q: "Do you assemble office furniture for businesses?",
    a: "Yes. We regularly assemble office furniture for businesses in Nashville including desks, chairs, shelving units, file cabinets and conference room furniture. We can handle single-office and multi-unit projects.",
  },
  {
    q: "What furniture brands do you assemble?",
    a: "We assemble furniture from any brand including IKEA, Wayfair, Amazon, Ashley Furniture, West Elm, Pottery Barn, Room & Board, Costco and others. If it came in a box, we can put it together.",
  },
]

const ITEMS = [
  { cat: "Bedroom", items: ["Bed frames", "Headboards", "Dressers", "Nightstands", "Wardrobes", "Armoires"] },
  { cat: "Home Office", items: ["Desks", "Bookshelves", "Filing cabinets", "Office chairs", "Hutches", "Storage units"] },
  { cat: "Living Room", items: ["TV stands", "Entertainment centers", "Coffee tables", "Sofas (assembly)", "Bookshelves", "Storage cabinets"] },
  { cat: "IKEA Furniture", items: ["PAX wardrobes", "KALLAX units", "MALM beds", "HEMNES series", "ALEX drawers", "BILLY shelves"] },
]

export default function FurnitureAssemblyPage() {
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
            Furniture Assembly<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              in Nashville, TN
            </span>
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">
            Professional furniture assembly for homes and offices throughout Nashville and surrounding areas.
            IKEA, Wayfair, Amazon and any brand — delivered in a box, assembled by our team.
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

      {/* WHAT WE ASSEMBLE */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">What We Assemble</h2>
          <p className="text-black/60 mb-10">From single pieces to full room setups — any furniture, any brand.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ITEMS.map((cat) => (
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

      {/* WHY PRIMETV */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">Why Choose PrimeTvNashville for Furniture Assembly</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: "Experienced Team", desc: "The same installers who mount TVs bring precision and care to every furniture assembly job." },
              { title: "All Brands & Stores", desc: "IKEA, Wayfair, Amazon, Costco, Ashley and any other brand — if it came in a box, we can assemble it." },
              { title: "Nashville Service Area", desc: "Serving Nashville, Brentwood, Franklin, Murfreesboro, Hendersonville and surrounding Middle Tennessee areas." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/10 p-6">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-extrabold text-black mb-2">{f.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-gray-50 border border-black/5 p-6 text-sm text-black/60 leading-relaxed">
            Already booking a TV mounting? Ask about adding furniture assembly to the same visit and save time.{" "}
            <Link href="/" className="font-semibold text-[#E50914] hover:underline underline-offset-2">
              See TV mounting services →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">Furniture Assembly Questions</h2>
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
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Get Your Furniture Assembled?</h2>
          <p className="mt-3 text-white/60 text-lg">Fast, professional assembly throughout Nashville and Middle Tennessee.</p>
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
            <Link href="/picture-mirror-hanging-nashville" className="hover:text-white/70 transition">Picture & Mirror Hanging</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white/70 transition">Contact</Link>
          </div>
        </div>
      </section>

      <StickyActionBar />
    </>
  )
}
