"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white text-black">
      {/* top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#E50914] via-black to-[#E50914]" />

      {/* patterned background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10">
        {/* text */}
        <motion.div
          initial={{ opacity: 0, x: -34 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/70">
            <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
            Same day and next day availability
          </span>

          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Expert TV mounting in Nashville
          </h1>

          <p className="mt-4 text-lg md:text-xl text-black/70">
            Safe and professional installation for homes and businesses. Licensed and insured technicians
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Link
              href="/book"
              className="group inline-flex items-center justify-center rounded-full bg-[#E50914] px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]"
            >
              Book installation
              <svg
                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="#quick-quote"
              className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 font-semibold text-black hover:bg-black/5 transition-all"
            >
              Get a quick quote
            </Link>
          </div>

          {/* trust badges */}
          <div className="mt-8">
            <TrustBadges />
          </div>

          {/* mobile swipe hint */}
          <div className="mt-6 md:hidden">
            <MobileSwipeHint />
          </div>
        </motion.div>

        {/* image */}
        <motion.div
          initial={{ opacity: 0, x: 34 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 flex justify-center"
        >
          <div className="relative w-full max-w-[520px]">
            {/* red glow */}
            <div
              className="absolute -inset-6 rounded-3xl bg-[conic-gradient(from_90deg,rgba(229,9,20,0.16),transparent,rgba(0,0,0,0.12),transparent,rgba(229,9,20,0.16))] blur-2xl"
              aria-hidden="true"
            />
            <Image
              src="/images/tvinstallation.jpg"
              alt="Technician mounting a TV with clean cable finish"
              width={1040}
              height={800}
              priority
              className="relative z-10 w-full h-auto rounded-2xl shadow-xl object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="pb-6 md:pb-10 flex justify-center">
        <ScrollCue />
      </div>
    </section>
  )
}

/* subcomponents */

function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
      <div className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 bg-white/70 backdrop-blur">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E50914]" />
        <span className="font-medium text-black/80">Licensed and insured</span>
      </div>
      <div className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 bg-white/70 backdrop-blur">
        <span className="h-2.5 w-2.5 rounded-full bg-black" />
        <span className="font-medium text-black/80">Upfront pricing</span>
      </div>
      <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2 bg-white/70 backdrop-blur">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E50914]" />
        <span className="font-medium text-black/80">Same day options</span>
      </div>
    </div>
  )
}

function MobileSwipeHint() {
  return (
    <div className="mx-auto inline-flex items-center gap-2 text-black/60 text-sm">
      <svg className="h-4 w-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M8 12h8" strokeWidth="2" />
        <path d="M12 8l-4 4 4 4" strokeWidth="2" />
      </svg>
      <span>Swipe to explore services</span>
    </div>
  )
}

function ScrollCue() {
  return (
    <div className="flex flex-col items-center text-black/60">
      <div className="h-6 w-4 rounded-full border border-black/20 relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-1 h-1.5 w-1.5 rounded-full bg-black/50 animate-bounce" />
      </div>
      <span className="mt-2 text-xs">Scroll</span>
    </div>
  )
}
