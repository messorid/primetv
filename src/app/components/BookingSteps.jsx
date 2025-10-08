"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function BookingSteps() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="how-it-works"
      aria-labelledby="howItWorksTitle"
      className="w-full bg-white text-black"
      ref={ref}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <header className="max-w-2xl">
          <h2 id="howItWorksTitle" className="text-3xl md:text-4xl font-extrabold">
            How booking works
          </h2>
          <p className="mt-2 text-black/70">
            Three simple steps to get your TV professionally mounted in Nashville
          </p>
        </header>

        {/* timeline desktop */}
        <div className="mt-10 hidden md:grid grid-cols-3 gap-6 relative">
          {/* connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pointer-events-none absolute left-0 right-0 top-12 h-0.5 origin-left bg-gradient-to-r from-[#E50914] via-black/40 to-[#E50914]"
            aria-hidden="true"
          />
          <StepCard
            index={1}
            title="Choose service and time"
            desc="Pick the right service and a time window that fits your day"
            items={["TV up to 55 or over 55", "Add cable concealment or fireplace", "Select date and time window"]}
            inView={inView}
            delay={0}
          />
          <StepCard
            index={2}
            title="Confirm details"
            desc="Tell us size wall type and access details so the tech arrives ready"
            items={["TV size and wall material", "Mount available or need guidance", "Address and contact info"]}
            inView={inView}
            delay={0.1}
          />
          <StepCard
            index={3}
            title="Installation day"
            desc="Licensed and insured technician mounts levels and tests your TV"
            items={["Clean cable finish when selected", "Protective gear and cleanup", "Warranty on workmanship"]}
            inView={inView}
            delay={0.2}
          />
        </div>

        {/* stacked cards mobile */}
        <div className="mt-8 md:hidden space-y-4">
          <StepCardMobile
            index={1}
            title="Choose service and time"
            desc="Pick the right service and a time window that fits your day"
            items={["TV up to 55 or over 55", "Add cable concealment or fireplace", "Select date and time window"]}
          />
          <StepCardMobile
            index={2}
            title="Confirm details"
            desc="Tell us size wall type and access details so the tech arrives ready"
            items={["TV size and wall material", "Mount available or need guidance", "Address and contact info"]}
          />
          <StepCardMobile
            index={3}
            title="Installation day"
            desc="Licensed and insured technician mounts levels and tests your TV"
            items={["Clean cable finish when selected", "Protective gear and cleanup", "Warranty on workmanship"]}
          />
        </div>

        {/* bottom actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/book"
            data-ga="cta_book_steps"
            className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-6 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-red-500/30"
          >
            Book installation
          </Link>
          <Link
            href="#quick-quote"
            data-ga="cta_quote_steps"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 font-semibold text-black hover:bg-black/5 transition"
          >
            Get a quick quote
          </Link>
        </div>

        {/* small note */}
        <p className="mt-4 text-xs text-black/60">
          Drywall has no extra charge. Concrete tile stone or metal has a 25 surcharge. Cable concealment is 60 per TV. Fireplace handling from 25 extra
        </p>
      </div>
    </section>
  )
}

/* subcomponents */

function StepCard({ index, title, desc, items = [], inView, delay = 0 }) {
  return (
    <motion.article
      initial={{ y: 20, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className="relative rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="grid place-content-center h-12 w-12 rounded-full bg-[#E50914] text-white font-extrabold text-lg shadow">
          {index}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      <p className="mt-3 text-black/70">{desc}</p>

      <ul className="mt-4 space-y-2 text-sm text-black/80">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckIcon />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  )
}

function StepCardMobile({ index, title, desc, items = [] }) {
  return (
    <div className="relative rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid place-content-center h-10 w-10 rounded-full bg-[#E50914] text-white font-extrabold text-base shadow">
          {index}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="mt-2 text-black/70">{desc}</p>
      <ul className="mt-3 space-y-2 text-sm text-black/80">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckIcon />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 flex-none text-[#E50914]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
