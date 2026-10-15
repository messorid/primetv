// Specialty TV services and the brand and size guides, as plain links. The
// city links that used to sit here now live in the service area section,
// next to the ZIP check, so each area is linked once on the page.
import Link from "next/link"
import { BRANDS, SIZES } from "../lib/tvModels"
import { Section, SectionHeader } from "./ui/Section"

const SERVICES = [
  {
    href: "/samsung-frame-tv-installation-nashville",
    title: "Samsung Frame TV",
    desc: "Slim fit mount, One Connect Box routing and Art Mode setup.",
    icon: "🖼️",
  },
  {
    href: "/tv-mounting-over-fireplace-nashville",
    title: "TV Over Fireplace",
    desc: "Heat clearance verified. Brick, stone and drywall.",
    icon: "🔥",
  },
  {
    href: "/cable-concealment-nashville",
    title: "Cable Concealment",
    desc: "In-wall routing or surface raceway. Add-on from $60 per TV.",
    icon: "🔌",
  },
  {
    href: "/soundbar-installation-nashville",
    title: "Soundbar Installation",
    desc: "Mounted below or above the TV with clean cable management.",
    icon: "🔊",
  },
]

const GUIDES = [
  ...BRANDS.map(b => ({ label: `${b.name} TVs`, href: b.path })),
  { label: "OLED TVs", href: "/oled-tv-mounting" },
  ...SIZES.map(z => ({ label: `${z.inches}-inch TVs`, href: z.path })),
]

export default function InternalLinksHub() {
  return (
    <Section id="specialty" labelledBy="specialty-title">
      <SectionHeader id="specialty-title" eyebrow="Specialty installs" title="Got a special setup?"
        sub="Frame TVs, fireplaces, hidden cables and soundbars each have their own page with the details." />

      <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(sv => (
          <li key={sv.href}>
            <Link href={sv.href} className="group flex h-full items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-ink lg:flex-col lg:gap-0">
              <span aria-hidden="true" className="flex size-12 flex-none items-center justify-center rounded-xl bg-soft text-2xl">{sv.icon}</span>
              <span className="min-w-0 lg:mt-3">
                <span className="block text-lg font-bold text-ink group-hover:text-brand-dark">{sv.title}</span>
                <span className="mt-1 block text-base text-body">{sv.desc}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <nav aria-label="Mounting guides by TV brand and size" className="mt-8">
        <h3 className="text-base font-bold text-ink">Mounting guides by brand and size</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {GUIDES.map(g => (
            <li key={g.href}>
              <Link href={g.href} className="inline-flex min-h-[44px] items-center rounded-full border-2 border-zinc-300 px-4 text-base font-semibold text-ink hover:border-ink">
                {g.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/services" className="inline-flex min-h-[44px] items-center rounded-full px-4 text-base font-bold text-brand-dark underline decoration-2 underline-offset-4 hover:text-ink">
              All services
            </Link>
          </li>
        </ul>
      </nav>
    </Section>
  )
}
