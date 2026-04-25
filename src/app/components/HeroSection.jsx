"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, ShieldCheck, Clock, Zap } from "lucide-react"

const stats = [
  { value: "500+", label: "Installations" },
  { value: "4.9", label: "Google Rating", icon: <Star size={13} className="text-yellow-400 fill-yellow-400" /> },
  { value: "Same Day", label: "Availability" },
  { value: "5 yr", label: "Experience" },
]

const badges = [
  { icon: <ShieldCheck size={14} />, text: "Licensed & Insured" },
  { icon: <Clock size={14} />, text: "Same-Day Service" },
  { icon: <Zap size={14} />, text: "Upfront Pricing" },
]

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white text-black">

      {/* ── BACKGROUND ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.045) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div aria-hidden="true" className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#E50914]/6 blur-[120px] rounded-full pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#E50914]/4 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: TEXT ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col"
          >
            {/* Badge */}
            <div className="mb-5 inline-flex self-start items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-black/70 shadow-sm">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E50914] opacity-70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#E50914]" />
              </span>
              Same-Day & Next-Day Availability
            </div>

            {/* Headline */}
            <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black leading-[1.08] tracking-tight text-black">
              Nashville's #1{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
                  TV Mounting
                </span>
                <span aria-hidden="true" className="absolute -bottom-1 left-0 w-full h-[6px] rounded-full bg-gradient-to-r from-[#E50914]/30 to-transparent" />
              </span>
              <br />
              <span className="text-black/90">Service</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-lg text-black/60 max-w-lg leading-relaxed">
              Safe, perfectly leveled, and clean installations for homes and businesses across Nashville and surrounding areas.
            </p>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b.text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-black/[0.03] px-3.5 py-1.5 text-xs font-semibold text-black/70"
                >
                  <span className="text-[#E50914]">{b.icon}</span>
                  {b.text}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/book"
                className="group w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 text-base font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 hover:shadow-red-500/40 transition-all duration-300 active:scale-95"
              >
                Book Installation
                <svg className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#quick-quote"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 text-base font-bold text-black hover:border-black/20 hover:bg-black/[0.03] transition-all duration-300 active:scale-95"
              >
                Get a Free Quote
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-10 pt-8 border-t border-black/[0.07] grid grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-1 text-xl sm:text-2xl font-black text-black">
                    {s.icon}
                    {s.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-black/50 font-medium mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: IMAGE ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Floating card: Google review */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -left-2 sm:-left-6 top-8 z-20 bg-white rounded-2xl shadow-2xl border border-black/5 px-4 py-3 flex items-center gap-3 w-52"
            >
              <div className="flex items-center justify-center size-9 rounded-xl bg-[#E50914] shrink-0">
                <svg viewBox="0 0 24 24" className="size-5 fill-white"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-[11px] font-bold text-black mt-0.5">4.9 · 120+ reviews</p>
                <p className="text-[10px] text-black/50">Google Reviews</p>
              </div>
            </motion.div>

            {/* Floating card: completed job */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="absolute -right-2 sm:-right-4 bottom-12 z-20 bg-black rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 w-48"
            >
              <div className="flex items-center justify-center size-9 rounded-xl bg-emerald-500 shrink-0 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-white">Job completed!</p>
                <p className="text-[10px] text-white/50 mt-0.5">Brentwood, TN · Today</p>
              </div>
            </motion.div>

            {/* Main image */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-md lg:max-w-lg"
            >
              <div aria-hidden="true" className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-[#E50914]/20 via-transparent to-[#E50914]/5 blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 aspect-[4/3]">
                <Image
                  src="/images/tvinstallation.jpg"
                  alt="Licensed technician mounting a flat screen TV on a wall in Nashville"
                  fill
                  sizes="(max-width: 768px) 100vw, 580px"
                  priority
                  className="object-cover"
                />
                {/* Gradient overlay bottom */}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                {/* Bottom label */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                    Nashville, TN
                  </span>
                  <span className="text-xs font-bold text-white bg-[#E50914]/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                    Same-Day ⚡
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ── BOTTOM MARQUEE STRIP ── */}
      <div className="relative overflow-hidden border-t border-black/[0.06] bg-black/[0.025] py-3">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex gap-10 whitespace-nowrap"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-10 shrink-0">
              {["Nashville", "Brentwood", "Franklin", "Murfreesboro", "Hendersonville", "Mount Juliet", "Smyrna", "Gallatin", "Spring Hill", "Nolensville"].map((city) => (
                <span key={city} className="flex items-center gap-2.5 text-xs font-semibold text-black/40 uppercase tracking-widest">
                  <span className="size-1 rounded-full bg-[#E50914]" />
                  TV Mounting in {city}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
