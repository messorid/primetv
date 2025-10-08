"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const SERVICES = [
  // PROMOS
  {
    slug: "promo-2tvs-under55",
    title: "Promo 2 TVs up to 55 in",
    desc: "Same visit and address. Brackets not included",
    img: "/images/tvpromo.png", // usa una imagen de promo o un placeholder
    priceLabel: "$199 total",
    time: "Typically 90 to 120 min",
    notes: ["Same visit same address", "Bracket not included", "Drywall no extra"],
    promo: true,
    ctaLabel: "Use promo",
    href: "/book",
  },
  {
    slug: "promo-2tvs-over55",
    title: "Promo 2 TVs over 55 in",
    desc: "Same visit and address. Brackets not included",
    img: "/images/tvpromo2.png",
    priceLabel: "$260 total",
    time: "Typically 120 to 150 min",
    notes: ["Same visit same address", "Bracket not included", "Two person handling"],
    promo: true,
    ctaLabel: "Use promo",
    href: "/book",
  },

  // SERVICIOS BASE
  {
    slug: "tv-up-to-55",
    title: "TV up to 55 inches",
    desc: "Secure wall mount on drywall with studs",
    img: "/images/tv3.jpeg",
    priceLabel: "$110 per TV",
    time: "45 to 75 min",
    notes: ["Drywall no extra", "Bracket not included"],
    ctaLabel: "Book this service",
    href: "/book?service=tv-up-to-55",
  },
  {
    slug: "tv-over-55",
    title: "TV over 55 inches",
    desc: "Two person handling and precise leveling",
    img: "/images/tv1.jpeg",
    priceLabel: "$140 per TV",
    time: "60 to 90 min",
    notes: ["Drywall no extra", "Bracket not included"],
    highlight: true,
    ctaLabel: "Book this service",
    href: "/book?service=tv-over-55",
  },
  {
    slug: "over-fireplace",
    title: "Over fireplace",
    desc: "Heat clearance check and cable path planning",
    img: "/images/tv4.jpeg",
    priceLabel: "From $25 extra",
    time: "75 to 120 min",
    notes: ["Add on", "Depends on setup"],
    addon: true,
    ctaLabel: "Add to booking",
    href: "/book?addon=over-fireplace",
  },
  {
    slug: "cable-concealment",
    title: "Cable concealment",
    desc: "In wall power kit or external raceway",
    img: "/images/tv2.jpeg",
    priceLabel: "$60 add on",
    time: "30 to 60 min",
    notes: ["Add on per TV"],
    addon: true,
    ctaLabel: "Add to booking",
    href: "/book?addon=cable-concealment",
  },

]

export default function ServicesSlider() {
  const scrollerRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => {
      const { scrollLeft, clientWidth } = el
      const idx = Math.round(scrollLeft / clientWidth)
      setActive(idx)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  const go = (dir) => {
    const el = scrollerRef.current
    if (!el) return
    const width = el.clientWidth
    const next = Math.max(0, Math.min(SERVICES.length - 1, active + dir))
    el.scrollTo({ left: next * width, behavior: "smooth" })
    setActive(next)
  }

  return (
    <section id="services" className="relative w-full bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold">Services</h2>
            <p className="mt-2 text-black/70">Choose a service and book in minutes</p>
          </div>

          {/* desktop arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              aria-label="Previous"
              onClick={() => go(-1)}
              className="h-10 w-10 grid place-content-center rounded-full border border-black/15 hover:bg-black/5 transition"
            >
              ←
            </button>
            <button
              aria-label="Next"
              onClick={() => go(1)}
              className="h-10 w-10 grid place-content-center rounded-full bg-[#E50914] text-white hover:opacity-90 transition"
            >
              →
            </button>
          </div>
        </div>

        {/* swipe hint mobile */}
        <div className="mt-3 md:hidden flex items-center gap-2 text-sm text-black/60">
          <svg className="h-4 w-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M8 12h8" strokeWidth="2" />
            <path d="M12 8l-4 4 4 4" strokeWidth="2" />
          </svg>
          <span>Swipe to explore services</span>
        </div>

        {/* slider */}
        <div
          ref={scrollerRef}
          className="mt-6 snap-x snap-mandatory overflow-x-auto no-scrollbar flex"
          style={{ scrollBehavior: "smooth" }}
        >
          {SERVICES.map((s) => (
            <article
              key={s.slug}
              className="snap-start shrink-0 w-[88%] sm:w-[60%] md:w-1/2 lg:w-1/3 px-2"
            >
              <ServiceCard {...s} />
            </article>
          ))}
        </div>

        {/* dots for mobile */}
        <div className="mt-6 flex justify-center gap-2 md:hidden">
          {SERVICES.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i === active ? "bg-[#E50914]" : "bg-black/20"}`}
            />
          ))}
        </div>

        {/* bottom CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-6 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-red-500/30"
          >
            Book installation
          </Link>
          <Link
            href="#quote"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 font-semibold text-black hover:bg-black/5 transition"
          >
            Get a quick quote
          </Link>
        </div>

        {/* legal note under slider */}
        <p className="mt-4 text-xs text-black/60">
          Prices do not include the bracket mount. We do not sell mounts but we help you find the right model
        </p>
      </div>
    </section>
  )
}

function ServiceCard({
  title,
  desc,
  img,
  priceLabel,
  time,
  notes = [],
  slug,
  highlight = false,
  addon = false,
  promo = false,
  ctaLabel = "Learn more",
  href = `/services/${slug}`,
}) {
  return (
    <div className={`group relative h-full rounded-2xl border ${highlight ? "border-[#E50914]" : "border-black/10"} bg-white shadow-sm hover:shadow-md transition overflow-hidden`}>
      <div className="relative aspect-[4/3]">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width:768px) 88vw, (max-width:1024px) 60vw, 33vw"
          className="object-cover"
          priority={false}
        />
        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#E50914] text-white text-xs font-semibold px-3 py-1 shadow">
            {priceLabel}
          </span>
          {addon && (
            <span className="rounded-full bg-black/80 text-white text-[10px] font-semibold px-2.5 py-1">
              Add on
            </span>
          )}
          {promo && (
            <span className="rounded-full bg-black/80 text-white text-[10px] font-semibold px-2.5 py-1">
              Promo
            </span>
          )}
          {highlight && (
            <span className="rounded-full bg-black/80 text-white text-[10px] font-semibold px-2.5 py-1">
              Most selected
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm text-black/70">{desc}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-black/60">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-black/60" />
            {time}
          </span>
          {notes.map((n, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              <span aria-hidden="true" className="mx-1">•</span>
              {n}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5 transition"
          >
            {ctaLabel}
          </Link>
          <Link
            href={`/book?service=${encodeURIComponent(slug)}`}
            className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Book
          </Link>
        </div>
      </div>

      {/* red border glow on hover desktop */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-[#E50914]/50 transition" />
    </div>
  )
}
