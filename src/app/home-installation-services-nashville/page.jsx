import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"

export const metadata = {
  title: "Home Installation Services Nashville TN | PrimeTvNashville",
  description: "Professional home installation and assembly services in Nashville TN. Furniture assembly, mirror hanging, shelves, curtain rods, gazebo installation and more.",
  keywords: [
    "home installation services Nashville",
    "installation services Nashville TN",
    "furniture assembly Nashville",
    "mirror hanging Nashville",
    "shelf installation Nashville",
    "gazebo assembly Nashville",
    "professional installer Nashville",
  ],
  openGraph: {
    title: "Home Installation Services Nashville TN | PrimeTvNashville",
    description: "Professional installation and assembly services in Nashville. Furniture, mirrors, shelves, curtain rods, gazebos and more.",
    url: "https://www.primetvnashville.com/home-installation-services-nashville",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/home-installation-services-nashville" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Home Installation Services Nashville TN",
  "description": "Professional installation and assembly services in Nashville Tennessee including furniture assembly, mirror hanging, shelves, curtain rods, gazebo installation and more.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "PrimeTvNashville",
    "telephone": "+1-615-669-0251",
    "url": "https://www.primetvnashville.com",
    "address": { "@type": "PostalAddress", "addressLocality": "Nashville", "addressRegion": "TN", "addressCountry": "US" },
  },
  "areaServed": { "@type": "City", "name": "Nashville" },
}

const SERVICES = [
  {
    emoji: "🪑",
    title: "Furniture Assembly",
    desc: "Professional assembly for beds, dressers, desks, TV stands, IKEA furniture, office furniture, storage furniture and cabinets.",
    href: "/furniture-assembly-nashville",
    examples: ["Beds & Dressers", "IKEA Furniture", "Desks & Offices", "TV Stands", "Wardrobes", "Cabinets"],
    cta: "Explore Furniture Assembly",
  },
  {
    emoji: "🪞",
    title: "Picture & Mirror Hanging",
    desc: "Secure, perfectly leveled installation for mirrors, pictures, artwork, gallery walls, heavy mirrors and office décor.",
    href: "/picture-mirror-hanging-nashville",
    examples: ["Bathroom Mirrors", "Gallery Walls", "Framed Artwork", "Heavy Mirrors", "Office Art", "Canvas Prints"],
    cta: "Explore Wall Hanging Services",
  },
  {
    emoji: "📐",
    title: "Shelves & Wall Installation",
    desc: "Floating shelves, curtain rods, blinds, whiteboards, wall-mounted cabinets and decorative wall items.",
    href: "/wall-installation-services-nashville",
    examples: ["Floating Shelves", "Curtain Rods", "Roller Blinds", "Whiteboards", "Wall Cabinets", "Closet Shelving"],
    cta: "Explore Wall Installations",
  },
  {
    emoji: "⛺",
    title: "Gazebo & Pergola Assembly",
    desc: "Expert assembly of Yardistry, Backyard Discovery, Purple Leaf and all pre-manufactured outdoor structures.",
    href: "/gazebo-installation-nashville",
    examples: ["Yardistry Gazebos", "Cedar Pergolas", "Aluminum Pergolas", "Outdoor Sectionals", "Pavilion Kits", "Play Structures"],
    cta: "Explore Gazebo Assembly",
  },
]

const COMMERCIAL = [
  "Commercial TV mounting",
  "Office furniture assembly",
  "Display & signage installation",
  "Artwork & décor installation",
  "Conference room whiteboards",
  "Commercial shelving",
  "Reception area mirrors",
  "Retail display installation",
]

export default function HomeInstallationPage() {
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
            Nashville · Brentwood · Franklin · Murfreesboro
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-black">
            Home Installation Services<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              in Nashville, TN
            </span>
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">
            PrimeTvNashville provides professional installation and assembly services for homes and businesses
            throughout Nashville and surrounding areas. In addition to professional TV mounting, our team can
            help with furniture assembly, mirrors, pictures, shelving, curtain rods, gazebos and other
            installation projects.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
              Request an Installation Quote
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
              Call (615) 669-0251
            </a>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-[#E50914] hover:underline underline-offset-2">
              Our main specialty: TV Mounting in Nashville →
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Installation Services</h2>
          <p className="text-black/60 mb-10">Professional installation for your home or business — any service, done right.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {SERVICES.map((s) => (
              <div key={s.href} className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm hover:shadow-md transition">
                <span className="text-3xl block mb-4">{s.emoji}</span>
                <h3 className="text-xl font-extrabold text-black mb-2">{s.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed mb-5">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {s.examples.map((ex) => (
                    <span key={ex} className="text-[11px] font-medium bg-black/5 text-black/60 px-2.5 py-0.5 rounded-full">
                      {ex}
                    </span>
                  ))}
                </div>
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E50914] hover:underline underline-offset-2"
                >
                  {s.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TV MOUNTING CALLOUT */}
      <section className="w-full bg-white py-12">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <div className="rounded-2xl bg-black text-white p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">Our Primary Specialty</p>
              <h3 className="text-xl md:text-2xl font-extrabold mb-2">Professional TV Mounting in Nashville</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                PrimeTvNashville's core business is professional TV mounting — same-day service, upfront pricing,
                clean cable concealment. All other installation services complement our TV expertise.
              </p>
            </div>
            <Link
              href="/"
              className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
            >
              See TV Mounting Services →
            </Link>
          </div>
        </div>
      </section>

      {/* COMMERCIAL */}
      <section className="w-full bg-gray-50 py-16" id="commercial">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E50914] uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-[#E50914]" /> For Businesses
          </div>
          <h2 className="text-3xl font-extrabold text-black mb-2">Commercial Installation Services</h2>
          <p className="text-black/60 mb-8 max-w-2xl">
            We serve offices, restaurants, retail spaces and commercial properties throughout Nashville.
            Professional installation with minimal disruption to your business.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {COMMERCIAL.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl bg-white border border-black/10 px-4 py-3 text-sm font-medium text-black/75">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] flex-none" />
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/get-installation-quote"
            className="inline-flex items-center gap-2 rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition shadow-lg shadow-red-500/20"
          >
            Request a Commercial Quote
          </Link>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Service Area</h2>
          <p className="text-black/60 mb-6">We serve Nashville and surrounding Middle Tennessee communities.</p>
          <div className="flex flex-wrap gap-2">
            {["Nashville", "Brentwood", "Franklin", "Murfreesboro", "Hendersonville", "Gallatin", "Lebanon", "Smyrna", "La Vergne", "Spring Hill", "Mount Juliet", "Nolensville"].map((city) => (
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
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Get Started?</h2>
          <p className="mt-3 text-white/60 text-lg">Tell us what you need installed and we'll get back to you with a quote.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/get-installation-quote" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">
              Request an Installation Quote
            </Link>
            <a href="tel:+16156690251" className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition">
              Call (615) 669-0251
            </a>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-3 text-sm text-white/40">
            <Link href="/" className="hover:text-white/70 transition">TV Mounting Nashville</Link>
            <span>·</span>
            <Link href="/furniture-assembly-nashville" className="hover:text-white/70 transition">Furniture Assembly</Link>
            <span>·</span>
            <Link href="/picture-mirror-hanging-nashville" className="hover:text-white/70 transition">Mirror Hanging</Link>
            <span>·</span>
            <Link href="/wall-installation-services-nashville" className="hover:text-white/70 transition">Shelves & Wall</Link>
            <span>·</span>
            <Link href="/gazebo-installation-nashville" className="hover:text-white/70 transition">Gazebo Assembly</Link>
          </div>
        </div>
      </section>

      <StickyActionBar />
    </>
  )
}
