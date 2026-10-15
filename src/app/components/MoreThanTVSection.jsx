// Everything else we install, in one section. This replaces two that said the
// same thing twice ("Need anything else installed?" and "More than TV
// mounting"), and adds ceiling fans, which now have their own page.
import Link from "next/link"
import { Section, SectionHeader, ButtonLink } from "./ui/Section"

const SERVICES = [
  { emoji: "🪑", title: "Furniture assembly", desc: "Beds, dressers, desks, TV stands, IKEA and office furniture.", href: "/furniture-assembly-nashville" },
  { emoji: "🪞", title: "Picture & mirror hanging", desc: "Mirrors, artwork, gallery walls and heavy wall décor — level and secure.", href: "/picture-mirror-hanging-nashville" },
  { emoji: "📐", title: "Shelves, rods & blinds", desc: "Floating shelves, curtain rods, blinds, whiteboards and wall cabinets.", href: "/wall-installation-services-nashville" },
  { emoji: "🌀", title: "Ceiling fan installation", desc: "New fans and replacements on fan-rated boxes, hung level and wobble-free.", href: "/ceiling-fan-installation-nashville" },
  { emoji: "⛺", title: "Gazebo & pergola assembly", desc: "Yardistry, Backyard Discovery, Purple Leaf and similar kits.", href: "/gazebo-installation-nashville" },
  { emoji: "🛝", title: "Playset installation", desc: "Swing sets, play structures and trampolines, anchored and safety-checked.", href: "/playground-installation-nashville" },
]

export default function MoreThanTVSection() {
  return (
    <Section id="more-services" tone="soft" labelledBy="more-title">
      <SectionHeader id="more-title" eyebrow="Home installation"
        title="More than TV mounting"
        sub="Add other jobs to the same visit — no second trip needed." />

      <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(s => (
          <li key={s.title}>
            <Link href={s.href}
              className="group flex h-full items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-ink">
              <span aria-hidden="true" className="flex size-12 flex-none items-center justify-center rounded-xl bg-soft text-2xl">{s.emoji}</span>
              <span className="min-w-0">
                <span className="block text-lg font-bold text-ink group-hover:text-brand-dark">{s.title}</span>
                <span className="mt-1 block text-base text-body">{s.desc}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <ButtonLink href="/home-installation-services-nashville" variant="secondary">See all home installation services</ButtonLink>
      </div>

      <div className="mt-10 flex flex-col items-start gap-5 rounded-3xl bg-ink p-7 text-white md:flex-row md:items-center md:p-9">
        <div className="flex-1">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-bright">For businesses</p>
          <h3 className="mt-2 text-2xl font-extrabold">Commercial installation</h3>
          <p className="mt-2 max-w-xl text-base text-white/80">
            Commercial TV mounting, displays, office furniture, conference-room whiteboards, artwork and shelving
            for businesses across Nashville and Middle Tennessee.
          </p>
        </div>
        <ButtonLink href="/home-installation-services-nashville#commercial">Request a commercial quote</ButtonLink>
      </div>
    </Section>
  )
}
