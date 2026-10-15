// Pricing: the two base prices, the add-ons as a plain table, the current
// promotions, and the fine print folded into "Good to know" so it is there for
// anyone who wants it without pushing the prices off the screen.
import Link from "next/link"
import PriceDisclaimer from "./PriceDisclaimer"
import { Section, SectionHeader, ButtonLink, Check } from "./ui/Section"

const BASE = [
  {
    title: "TV up to 55 inches",
    price: "$110",
    unit: "per TV",
    features: ["Level, secure mount on studs", "Safety check and cleanup", "Drywall at no extra cost"],
    href: "/book?service=tv-up-to-55",
    cta: "Book a TV up to 55 in",
  },
  {
    title: "TV over 55 inches",
    price: "$140",
    unit: "per TV",
    features: ["Two-person handling for large screens", "Level, secure mount on studs", "Drywall at no extra cost"],
    href: "/book?service=tv-over-55",
    cta: "Book a TV over 55 in",
    highlight: true,
  },
]

const ADDONS = [
  ["Cable concealment", "From $60 per TV"],
  ["Over a fireplace", "From $25 extra"],
  ["Brick, stone, tile, concrete or metal wall", "From $25 extra"],
  ["Drywall", "No extra charge"],
]

const PROMOS = [
  { title: "2 TVs up to 55 inches", price: "$199", note: "Same visit, same address" },
  { title: "2 TVs over 55 inches", price: "$260", note: "Same visit, same address" },
]

const FINE_PRINT = [
  "All prices are starting prices — the final cost depends on the difficulty of the job, the wall type and the mount being installed.",
  "Pull-down mantel mounts (MantelMount and similar) are priced separately — ask us for a quote.",
  "Samsung Frame TV installations are quoted individually and are not covered by the rates above.",
  "Your exact price is confirmed by one of our sales representatives before any work begins.",
  "Prices do not include the bracket. We don't sell mounts, but we help you choose and find the right one.",
  "Every job includes level calibration, secure anchoring and basic cleanup.",
  "Same-day and next-day appointments when available.",
]

export default function PricingSection() {
  return (
    <Section id="pricing" tone="soft" labelledBy="pricing-title">
      <SectionHeader
        id="pricing-title"
        eyebrow="Pricing"
        title="Simple, upfront pricing"
        sub="Starting rates for professional TV mounting. Pick your size and book in minutes."
      />

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {BASE.map(p => (
          <article key={p.title}
            className={`relative flex flex-col rounded-3xl border bg-white p-6 sm:p-8 shadow-sm ${p.highlight ? "border-brand ring-1 ring-brand" : "border-zinc-200"}`}>
            {p.highlight && (
              <p className="absolute -top-3.5 left-6 rounded-full bg-brand px-3 py-1 text-sm font-bold text-white">Most booked</p>
            )}
            <h3 className="text-xl font-extrabold text-ink">{p.title}</h3>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="text-base font-semibold text-muted">From</span>
              <span className="text-5xl font-black tracking-tight text-ink">{p.price}</span>
              <span className="text-base font-semibold text-muted">{p.unit}</span>
            </p>
            <ul className="mt-6 space-y-3">
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-3 text-base text-body"><Check className="mt-0.5 text-emerald-600" />{f}</li>
              ))}
            </ul>
            <ButtonLink href={p.href} variant={p.highlight ? "primary" : "secondary"} className="mt-8 w-full">{p.cta}</ButtonLink>
          </article>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
          <h3 className="text-lg font-extrabold text-ink">Add-ons</h3>
          <dl className="mt-4 divide-y divide-zinc-200">
            {ADDONS.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-base text-body">{k}</dt>
                <dd className="flex-none text-base font-bold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
          <h3 className="text-lg font-extrabold text-ink">Current promotions</h3>
          <ul className="mt-4 space-y-3">
            {PROMOS.map(p => (
              <li key={p.title} className="flex items-center justify-between gap-4 rounded-2xl bg-red-50 px-4 py-3">
                <div>
                  <p className="text-base font-bold text-ink">{p.title}</p>
                  <p className="text-sm text-body">{p.note}</p>
                </div>
                <p className="flex-none text-right">
                  <span className="block text-xs font-semibold text-muted">From</span>
                  <span className="text-2xl font-black text-brand-dark">{p.price}</span>
                </p>
              </li>
            ))}
          </ul>
          <Link href="/book" className="mt-4 inline-flex min-h-[44px] items-center text-base font-bold text-brand-dark underline decoration-2 underline-offset-4 hover:text-ink">
            Book a promo
          </Link>
        </div>
      </div>

      <PriceDisclaimer className="mt-8" />

      <details className="group mt-4 rounded-2xl border border-zinc-200 bg-white">
        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 px-5 text-base font-bold text-ink [&::-webkit-details-marker]:hidden">
          Good to know before you book
          <span aria-hidden="true" className="text-xl text-muted transition-transform group-open:rotate-45">+</span>
        </summary>
        <ul className="space-y-2.5 px-5 pb-5 text-base text-body">
          {FINE_PRINT.map(t => (
            <li key={t} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 size-1.5 flex-none rounded-full bg-brand" />{t}</li>
          ))}
        </ul>
      </details>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/book">Book installation</ButtonLink>
        <ButtonLink href="#quick-quote" variant="secondary">Get a free quote</ButtonLink>
      </div>
    </Section>
  )
}
