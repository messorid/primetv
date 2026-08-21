import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"

export const metadata = {
  title: "Picture & Mirror Hanging Nashville TN | PrimeTvNashville",
  description: "Professional picture and mirror hanging in Nashville TN. Artwork, gallery walls, heavy mirrors and wall décor installed securely and level. Book today.",
  keywords: [
    "picture hanging Nashville",
    "mirror installation Nashville",
    "art installation Nashville",
    "gallery wall installation Nashville",
    "heavy mirror hanging Nashville TN",
    "mirror hanging service Nashville",
    "picture hanging service Nashville",
  ],
  openGraph: {
    title: "Picture & Mirror Hanging Nashville TN | PrimeTvNashville",
    description: "Professional picture and mirror hanging in Nashville. Artwork, gallery walls, heavy mirrors installed securely and level.",
    url: "https://www.primetvnashville.com/picture-mirror-hanging-nashville",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/picture-mirror-hanging-nashville" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Picture & Mirror Hanging Nashville TN",
  "description": "Professional picture hanging, mirror installation and gallery wall services in Nashville Tennessee.",
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
    q: "How much does picture and mirror hanging cost in Nashville?",
    a: "Pricing depends on the number of items, wall type and complexity. Request a quote online and we'll provide a price based on your specific project. Single items and small collections are priced straightforwardly.",
  },
  {
    q: "Can you hang a very heavy mirror?",
    a: "Yes. Heavy mirrors require the right anchors and mounting hardware to be installed safely. We assess the wall type, locate studs where needed and use appropriate hardware rated for the weight. This is exactly the type of job where professional installation prevents damage and accidents.",
  },
  {
    q: "What is a gallery wall and can you install one?",
    a: "A gallery wall is a curated arrangement of multiple frames, artwork and mirrors on a single wall. We plan the layout, ensure everything is level and evenly spaced, and install all pieces cleanly. Tell us how many items you have and we'll quote the project.",
  },
  {
    q: "Can you hang artwork in my office or business?",
    a: "Yes. We regularly install artwork, mirrors and décor in offices, lobbies, restaurants and commercial spaces in Nashville. If you have multiple locations or a larger project, contact us for a commercial quote.",
  },
  {
    q: "What wall types can you hang on?",
    a: "We hang on drywall, plaster, brick, concrete and tile. Different walls require different hardware and techniques. We come prepared for any surface type.",
  },
  {
    q: "Do I need to have the hardware already?",
    a: "Not necessarily. We carry common hanging hardware. For specialty anchors or decorative hardware you've chosen yourself, just have it available. If you're unsure what you need, we can advise when we see the wall.",
  },
]

const SERVICES = [
  { cat: "Mirrors", items: ["Bathroom mirrors", "Full-length mirrors", "Decorative mirrors", "Oversized mirrors", "Heavy wall mirrors", "Frameless mirrors"] },
  { cat: "Artwork & Pictures", items: ["Framed art", "Canvas prints", "Photography", "Posters (framed)", "Kids' room art", "Statement pieces"] },
  { cat: "Gallery Walls", items: ["Mixed media arrangements", "Family photo walls", "Office gallery layouts", "Staircase galleries", "Living room feature walls", "Entry way displays"] },
  { cat: "Commercial", items: ["Office artwork", "Reception area displays", "Restaurant décor", "Hotel lobbies", "Retail displays", "Corporate art programs"] },
]

export default function PictureMirrorPage() {
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
            Picture & Mirror Hanging<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
              in Nashville, TN
            </span>
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">
            Professional installation for mirrors, pictures, artwork and gallery walls throughout Nashville.
            Secure, level and done right on any wall type — drywall, brick, concrete or tile.
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
          <p className="text-black/60 mb-10">From single mirrors to full gallery walls — residential and commercial.</p>
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
          <h2 className="text-3xl font-extrabold text-black mb-8">Done Right the First Time</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: "Perfectly Level", desc: "We use laser levels and professional measuring tools to ensure every piece hangs straight and aligned." },
              { title: "Safe & Secure", desc: "Correct anchors and hardware rated for the weight of your piece. Heavy mirrors require proper installation — we don't cut corners." },
              { title: "Any Wall Type", desc: "Drywall, plaster, brick, tile or concrete. We bring the right tools and hardware for every surface." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/10 p-6">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-extrabold text-black mb-2">{f.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-gray-50 border border-black/5 p-6 text-sm text-black/60 leading-relaxed">
            Our team also specializes in{" "}
            <Link href="/" className="font-semibold text-[#E50914] hover:underline underline-offset-2">TV mounting in Nashville</Link>{" "}
            — combine services during the same visit.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">Picture & Mirror Hanging Questions</h2>
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
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Hang Your Mirrors & Artwork?</h2>
          <p className="mt-3 text-white/60 text-lg">Professional installation throughout Nashville and Middle Tennessee.</p>
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
