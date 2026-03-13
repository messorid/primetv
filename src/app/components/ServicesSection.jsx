"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const SERVICES = [
  {
    slug: "promo-2tvs-under55",
    title: "Promo 2 TVs up to 55 in",
    desc: "Same visit and address. Brackets not included",
    img: "/images/tvpromo.png",
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
  {
    slug: "tv-up-to-55",
    title: "TV up to 55 inches",
    desc: "Secure wall mount on drywall with studs",
    img: "/images/tv3.jpeg",
    priceLabel: "$110 per TV",
    time: "45 to 75 min",
    notes: ["Drywall no extra", "Bracket not included"],
    ctaLabel: "Book this service",
    href: "/book",
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
    href: "/book",
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
    href: "/book",
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
    href: "/book",
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

    el.scrollTo({
      left: next * width,
      behavior: "smooth"
    })

    setActive(next)
  }

  return (
    <section id="services" className="relative w-full bg-white text-black">

      <div className="max-w-6xl mx-auto px-5 md:px-6 py-14 md:py-20">

        {/* title */}
        <div className="flex items-end justify-between gap-4">

          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Our Services
            </h2>

            <p className="mt-2 text-black/70">
              Choose a service and book in minutes
            </p>
          </div>

          {/* arrows */}
          <div className="hidden md:flex items-center gap-2">

            <button
              onClick={() => go(-1)}
              className="h-10 w-10 grid place-content-center rounded-full border border-black/15 hover:bg-black/5 transition"
            >
              ←
            </button>

            <button
              onClick={() => go(1)}
              className="h-10 w-10 grid place-content-center rounded-full bg-[#E50914] text-white hover:opacity-90 transition"
            >
              →
            </button>

          </div>

        </div>

        {/* swipe hint */}
        <div className="mt-3 md:hidden flex items-center gap-2 text-sm text-black/60">
          <span>Swipe to explore services</span>
        </div>

        {/* slider */}
        <div
          ref={scrollerRef}
          className="mt-8 snap-x snap-mandatory overflow-x-auto flex gap-3 no-scrollbar"
        >

          {SERVICES.map((s) => (
            <article
              key={s.slug}
              className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[48%] lg:w-[32%]"
            >
              <ServiceCard {...s} />
            </article>
          ))}

        </div>

        {/* dots */}
        <div className="mt-6 flex justify-center gap-2 md:hidden">

          {SERVICES.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition ${
                i === active
                  ? "bg-[#E50914]"
                  : "bg-black/20"
              }`}
            />
          ))}

        </div>

        {/* bottom CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">

          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-7 py-4 font-semibold text-white transition hover:shadow-lg hover:shadow-red-500/30"
          >
            Book installation
          </Link>

          <Link
            href="#quote"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-7 py-4 font-semibold text-black hover:bg-black/5 transition"
          >
            Get quick quote
          </Link>

        </div>

        {/* note */}
        <p className="mt-4 text-xs text-black/60">
          Prices do not include the bracket mount. We do not sell mounts but we help you find the correct model
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

    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={`group relative h-full rounded-2xl border ${
        highlight
          ? "border-[#E50914]"
          : "border-black/10"
      } bg-white shadow-sm hover:shadow-xl transition overflow-hidden`}
    >

      <div className="relative aspect-[4/3]">

        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width:768px) 88vw, (max-width:1024px) 60vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">

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

      <div className="p-5">

        <h3 className="text-lg font-bold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-black/70">
          {desc}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-black/60">

          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-black/60"/>
            {time}
          </span>

          {notes.map((n, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              • {n}
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

    </motion.div>

  )
}
