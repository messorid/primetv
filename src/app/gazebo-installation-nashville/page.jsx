import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"

export const metadata = {
  title: "Gazebo Assembly Nashville TN | Pergola Installation | PrimeTvNashville",
  description: "Professional gazebo and pergola assembly in Nashville TN. Yardistry, Backyard Discovery, Purple Leaf and all pre-manufactured outdoor structures. Book today.",
  keywords: [
    "gazebo installation Nashville",
    "gazebo assembly Nashville TN",
    "pergola installation Nashville",
    "Yardistry gazebo installation Nashville",
    "outdoor structure assembly Nashville",
    "pergola assembly Nashville TN",
    "Backyard Discovery assembly Nashville",
  ],
  openGraph: {
    title: "Gazebo Assembly Nashville TN | Pergola Installation | PrimeTvNashville",
    description: "Professional gazebo and pergola assembly in Nashville. Yardistry, Backyard Discovery, Purple Leaf and all pre-manufactured outdoor structures.",
    url: "https://www.primetvnashville.com/gazebo-installation-nashville",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/gazebo-installation-nashville" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Gazebo Assembly Nashville TN",
  "description": "Professional gazebo and pergola assembly in Nashville Tennessee. Yardistry, Backyard Discovery, Purple Leaf and all pre-manufactured outdoor structures.",
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
    q: "Do you assemble Yardistry gazebos in Nashville?",
    a: "Yes. Yardistry is one of the most popular gazebo brands we assemble. Their cedar structures require careful assembly to ensure structural integrity. We're familiar with their product lines and assemble them correctly.",
  },
  {
    q: "How much does gazebo assembly cost in Nashville?",
    a: "Pricing depends on the size, brand and complexity of the structure. Request a quote online with your gazebo's brand and model and we'll provide a price. Larger and more complex structures take more time.",
  },
  {
    q: "How long does gazebo assembly take?",
    a: "Most single gazebos take 3 to 6 hours depending on size and complexity. Larger pergolas or structures with additional features may take longer. We'll give you a realistic time estimate when you request a quote.",
  },
  {
    q: "What surfaces can you install a gazebo on?",
    a: "Gazebos can be assembled on grass, gravel, pavers, concrete or deck surfaces. The installation process varies depending on the surface. Let us know your surface type when requesting a quote.",
  },
  {
    q: "Does the gazebo need to be delivered before you assemble it?",
    a: "Yes. The gazebo or pergola must already be delivered to the installation location before our team arrives. Just let us know once it's there and we'll schedule the assembly.",
  },
  {
    q: "Do you assemble other outdoor furniture?",
    a: "Yes. In addition to gazebos and pergolas, we assemble outdoor dining sets, sectional furniture, fire pit tables and other outdoor furniture pieces that come in boxes.",
  },
]

const BRANDS = ["Yardistry", "Backyard Discovery", "Purple Leaf", "Costco Gazebos", "Sunjoy", "ABCCANOPY", "Other brands"]

const SERVICES = [
  {
    cat: "Gazebos",
    items: ["Cedar gazebos", "Metal gazebos", "Hardtop gazebos", "Soft-top gazebos", "Screen gazebos", "Pop-up gazebos (permanent)"],
  },
  {
    cat: "Pergolas",
    items: ["Freestanding pergolas", "Attached pergolas", "Louvered pergolas", "Aluminum pergolas", "Vinyl pergolas", "Wood pergolas"],
  },
  {
    cat: "Outdoor Structures",
    items: ["Shade sails (hardware)", "Canopy frames", "Pavilion kits", "Carport kits", "Storage sheds (assembly)", "Play structures"],
  },
  {
    cat: "Outdoor Furniture",
    items: ["Dining sets", "Sectional sofas", "Lounge chairs", "Fire pit tables", "Umbrella bases", "Storage benches"],
  },
]

export default function GazeboInstallationPage() {
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
            Gazebo Assembly &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              Installation in Nashville, TN
            </span>
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">
            Professional assembly for Yardistry, Backyard Discovery, Purple Leaf and all pre-manufactured
            gazebos and pergolas throughout Nashville and surrounding areas.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
              Request a Quote
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
              Call (615) 669-0251
            </a>
          </div>

          {/* Brands row */}
          <div className="mt-10 flex flex-wrap gap-2">
            <p className="text-xs font-semibold text-black/40 mr-1 self-center">Brands we assemble:</p>
            {BRANDS.map((b) => (
              <span key={b} className="text-xs font-medium border border-black/10 rounded-full px-3 py-1 text-black/60">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">What We Assemble</h2>
          <p className="text-black/60 mb-10">Gazebos, pergolas, outdoor structures and furniture — any brand delivered in a box.</p>
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

      {/* HOW IT WORKS */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {[
              { step: "01", title: "Request a Quote", desc: "Submit your gazebo brand, model and installation location. We'll provide a quote for the assembly." },
              { step: "02", title: "Get It Delivered", desc: "Have the gazebo delivered to your property. Once it's there, we schedule the assembly appointment." },
              { step: "03", title: "We Assemble It", desc: "Our team assembles the structure correctly at the installation site. No tools or effort needed from you." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-black/10 p-6">
                <p className="text-3xl font-black text-[#E50914]/20 mb-3">{s.step}</p>
                <h3 className="font-extrabold text-black mb-2">{s.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">Gazebo Assembly Questions</h2>
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
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Get Your Gazebo Assembled?</h2>
          <p className="mt-3 text-white/60 text-lg">Professional assembly throughout Nashville and Middle Tennessee.</p>
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
            <Link href="/wall-installation-services-nashville" className="hover:text-white/70 transition">Shelves & Wall Installation</Link>
          </div>
        </div>
      </section>

      <StickyActionBar />
    </>
  )
}
