// Why choose us: six points, each something a customer can hold us to.
// Dark band so the page has a change of pace halfway down; every text colour
// on it is at least 7:1.
import { Section, SectionHeader } from "./ui/Section"

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
    desc: "Proper anchors and two person handling for large TVs",
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
    <Section id="why-choose" tone="dark" labelledBy="why-title">
      <SectionHeader id="why-title" tone="dark" eyebrow="Why PrimeTvNashville"
        title="Careful work, clear prices"
        sub="Trusted TV mounting with upfront pricing and workmanship we stand behind." />
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(b => {
          const Icon = b.icon
          return (
            <li key={b.title} className="flex gap-4 rounded-2xl border border-white/15 bg-white/[0.04] p-5">
              <span aria-hidden="true" className="flex size-11 flex-none items-center justify-center rounded-xl bg-brand text-white">
                <Icon />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">{b.title}</h3>
                <p className="mt-1 text-base text-white/80">{b.desc}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

/* ICONS */

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
