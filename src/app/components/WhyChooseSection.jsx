"use client"

import { motion } from "framer-motion"

const BENEFITS = [
  {
    title: "Licensed and insured",
    desc: "Professional technicians with coverage for your peace of mind",
    icon: LicenseIcon,
  },
  {
    title: "Same day options",
    desc: "Fast scheduling when availability allows",
    icon: LightningIcon,
  },
  {
    title: "Clean cable finish",
    desc: "Neat routing and tidy workspace after the job",
    icon: CableIcon,
  },
  {
    title: "Upfront pricing",
    desc: "Clear rates and add ons. No surprises",
    icon: TagIcon,
  },
  {
    title: "Wall and device protection",
    desc: "Proper anchors, 2 person lift for big panels",
    icon: ShieldIcon,
  },
  {
    title: "Workmanship warranty",
    desc: "We stand behind our installation quality",
    icon: BadgeIcon,
  },
]

export default function WhyChooseSection() {
  return (
    <section id="why-choose" className="w-full bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <header className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold">Why choose PrimeTv Nashville</h2>
          <p className="mt-2 text-black/70">
            Trusted TV mounting with clear pricing and careful workmanship
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {BENEFITS.map((b, i) => (
            <motion.article
              key={b.title}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group relative rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-content-center rounded-xl bg-black text-white">
                  <b.icon />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{b.title}</h3>
                  <p className="mt-1 text-sm text-black/70">{b.desc}</p>
                </div>
              </div>

              {/* red glow edge on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-[#E50914]/40 transition" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Icons */

function LicenseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 8h6M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function LightningIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function CableIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 12c0-2.5 2-4.5 4.5-4.5h3A3.5 3.5 0 0 1 15 11v2a3 3 0 0 0 3 3h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="16" r="2" fill="currentColor" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M20 13l-7 7-9-9V4h7l9 9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" stroke="currentColor" strokeWidth="2" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BadgeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
