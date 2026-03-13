"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HeroReusable({
  hiddenTitle = "TV Mounting Nashville Tennessee",
  badge = "Same day and next day availability",
  title = "Expert TV Mounting in Nashville",
  subtitle = "Safe and professional installation for homes and businesses. Clean cable concealment and licensed technicians.",
  image = "/images/tvinstallation.jpg",
  imageAlt = "Professional TV mounting in Nashville",
  primaryText = "Book Installation",
  primaryLink = "/book",
  secondaryText = "Get Quick Quote",
  secondaryLink = "#quick-quote"
}) {
  return (
    <section className="relative w-full overflow-hidden bg-white text-black">

      {/* hidden SEO H1 */}
      <h1 className="sr-only">
        {hiddenTitle}
      </h1>

      {/* top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#E50914] via-black to-[#E50914]" />

      {/* background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      {/* glow */}
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/10 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left"
        >

          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/70">
            <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
            {badge}
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            {title}
          </h2>

          <p className="mt-4 text-base sm:text-lg md:text-xl text-black/70 max-w-xl mx-auto md:mx-0">
            {subtitle}
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">

            <Link
              href={primaryLink}
              className="group w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#E50914] px-7 py-4 text-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
            >
              {primaryText}

              <svg
                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>

            </Link>

            <Link
              href={secondaryLink}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-black/15 px-7 py-4 text-lg font-semibold text-black hover:bg-black/5 transition-all"
            >
              {secondaryText}
            </Link>

          </div>

        </motion.div>


        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 flex justify-center"
        >

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-full max-w-[520px]"
          >

            <div
              className="absolute -inset-6 rounded-3xl bg-[conic-gradient(from_90deg,rgba(229,9,20,0.18),transparent,rgba(0,0,0,0.12),transparent,rgba(229,9,20,0.18))] blur-2xl"
              aria-hidden="true"
            />

            <Image
              src={image}
              alt={imageAlt}
              width={1040}
              height={800}
              priority
              className="relative z-10 w-full h-auto rounded-2xl shadow-xl object-cover"
            />

          </motion.div>

        </motion.div>

      </div>

    </section>
  )
}



/* TRUST BADGES */

function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">

      <div className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 bg-white/80 backdrop-blur hover:shadow-md transition">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E50914]" />
        <span className="font-medium text-black/80">Licensed and insured</span>
      </div>

      <div className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 bg-white/80 backdrop-blur hover:shadow-md transition">
        <span className="h-2.5 w-2.5 rounded-full bg-black" />
        <span className="font-medium text-black/80">Upfront pricing</span>
      </div>

      <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 bg-white/80 backdrop-blur hover:shadow-md transition">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E50914]" />
        <span className="font-medium text-black/80">Same day service</span>
      </div>

    </div>
  )
}


/* MOBILE SWIPE */

function MobileSwipeHint() {
  return (
    <div className="mx-auto inline-flex items-center gap-2 text-black/60 text-sm">
      <span>Swipe to explore services</span>
    </div>
  )
}


/* SCROLL INDICATOR */

function ScrollCue() {
  return (
    <div className="flex flex-col items-center text-black/60">

      <div className="h-7 w-4 rounded-full border border-black/30 relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-1 h-1.5 w-1.5 rounded-full bg-black/60 animate-bounce" />
      </div>

      <span className="mt-2 text-xs tracking-wide">
        Scroll
      </span>

    </div>
  )
}
