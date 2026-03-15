"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white text-black selection:bg-[#E50914] selection:text-white">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#E50914] via-black to-[#E50914]" />

      {/* Modern Background Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* Soft Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E50914]/5 blur-[100px] rounded-full"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* TEXT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col text-center lg:text-left"
          >
            {/* Availability Badge */}
            <div className="mb-6 inline-flex self-center lg:self-start items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-xs font-semibold text-black/80 backdrop-blur-sm">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E50914] opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-[#E50914]"></span>
              </span>
              Same-Day & Next-Day Availability
            </div>

            {/* SEO Optimized Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance text-black">
              Expert TV Mounting <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-600">
                in Nashville
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-black/70 max-w-2xl mx-auto lg:mx-0 text-balance">
              Safe, secure, and professional TV installation for homes and businesses. 
              We guarantee clean cable concealment and perfectly leveled screens by licensed technicians.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/book"
                title="Book TV Installation in Nashville"
                className="group w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-lg hover:shadow-[#E50914]/30 active:scale-95"
              >
                Book Installation
                <svg
                  className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="#quick-quote"
                title="Get a quick quote for TV mounting"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 text-base font-bold text-black transition-all duration-300 hover:bg-black/5 hover:border-black/20 active:scale-95"
              >
                Get Quick Quote
              </Link>
            </div>

            {/* Trust Badges - Moved closer to CTAs for higher conversion */}
            <div className="mt-10 pt-8 border-t border-black/5">
              <TrustBadges />
            </div>
            
            {/* Mobile Swipe Hint */}
            <div className="mt-8 lg:hidden">
              <MobileSwipeHint />
            </div>
          </motion.div>

          {/* IMAGE CONTENT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center items-center w-full"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-lg aspect-[4/3]"
            >
              {/* Image Glow Effect */}
              <div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#E50914]/20 to-transparent blur-2xl"
                aria-hidden="true"
              />

              <Image
                src="/images/tvinstallation.jpg"
                alt="Licensed technician mounting a flat screen TV on a wall in Nashville"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                priority
                className="relative z-10 rounded-2xl shadow-2xl object-cover border border-black/5"
              />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Cue Container */}
      <div className="hidden lg:flex justify-center pb-8 absolute bottom-0 left-1/2 -translate-x-1/2">
        <ScrollCue />
      </div>
    </section>
  )
}

/* SUB-COMPONENTES OPTIMIZADOS */

function TrustBadges() {
  const badges = [
    { text: "Licensed & Insured", dotClass: "bg-[#E50914]" },
    { text: "Upfront Pricing", dotClass: "bg-black" },
    { text: "Same Day Service", dotClass: "bg-[#E50914]" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-center justify-center sm:justify-start gap-2.5 rounded-xl border border-black/5 px-4 py-3 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <span className={`size-2.5 rounded-full ${badge.dotClass}`} aria-hidden="true" />
          <span className="text-sm font-semibold text-black/80">{badge.text}</span>
        </div>
      ))}
    </div>
  )
}

function MobileSwipeHint() {
  return (
    <div className="flex items-center justify-center gap-2 text-black/50 text-sm font-medium">
      <svg className="size-5 animate-pulse text-[#E50914]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8M12 8l-4 4 4 4" />
      </svg>
      <span>Swipe to explore services</span>
    </div>
  )
}

function ScrollCue() {
  return (
    <div className="flex flex-col items-center text-black/40">
      <div className="h-8 w-5 rounded-full border-2 border-black/20 relative flex justify-center">
        <div className="mt-1.5 size-1.5 rounded-full bg-black/40 animate-bounce" />
      </div>
      <span className="mt-2 text-[10px] font-bold uppercase tracking-widest">
        Scroll
      </span>
    </div>
  )
}