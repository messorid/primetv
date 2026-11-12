// The Black Friday offers in full, right under the hero: the three bundles as
// cards, and the 10% for everything else, announced next to the regular
// prices (the office applies it when it confirms the price). Shown only
// while BLACK_FRIDAY_ON is true (lib/blackFriday.js).
import { Section, SectionHeader, ButtonLink, Check } from "./ui/Section"
import { BF_PROMOS, BF_DISCOUNT_PCT, BF_PROMO_TERMS, BF_PROMO_TERMS_LINE, bfBookHref } from "../lib/blackFriday"

// Regular starting prices, as in the pricing section.
const DISCOUNTED = [
  ["TV up to 55 inches", 110, "per TV"],
  ["TV over 55 inches", 150, "per TV"],
  ["Cable concealment", 70, "per TV"],
]

export default function BlackFridayDeals() {
  return (
    <Section id="black-friday" labelledBy="bf-title">
      <SectionHeader
        id="bf-title"
        eyebrow="Black Friday deals"
        title="Two ways to save this Black Friday"
        sub={`Book a Black Friday Promo for two TVs, or take ${BF_DISCOUNT_PCT}% off any other service. Limited time.`}
      />

      <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        {BF_PROMOS.map(p => (
          <li key={p.id} className="flex flex-col rounded-3xl bg-ink p-6 text-white shadow-sm sm:p-7">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-bright">Black Friday Promo</p>
            <h3 className="mt-2 text-xl font-extrabold leading-snug">{p.title}</h3>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-base font-semibold text-white/85">From</span>
              <span className="text-6xl font-black leading-none tracking-tight">${p.amount}</span>
            </p>
            <ul className="mt-5 space-y-2.5 text-base text-white/90">
              <li className="flex items-start gap-3"><Check className="mt-0.5 text-emerald-400" />Both TVs in the same visit, same address</li>
              {BF_PROMO_TERMS.map(t => (
                <li key={t} className="flex items-start gap-3 font-semibold text-white">
                  <span aria-hidden="true" className="mt-0.5 flex size-5 flex-none items-center justify-center rounded-full border border-white/60 text-xs font-black">!</span>{t}
                </li>
              ))}
              <li className="flex items-start gap-3"><Check className="mt-0.5 text-emerald-400" />Brackets not included</li>
            </ul>
            <ButtonLink href={bfBookHref(p.id)} className="mt-7 w-full">
              Book this promo<span className="sr-only">: {p.title}</span>
            </ButtonLink>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-1 items-center gap-6 rounded-3xl border-2 border-ink bg-white p-6 sm:p-8 lg:mt-6 lg:grid-cols-[1fr_1.3fr_auto] lg:gap-10">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-dark">Not a promo? Still a deal</p>
          <p className="mt-1 text-6xl font-black leading-none tracking-tight text-ink">{BF_DISCOUNT_PCT}% OFF</p>
          <p className="mt-2 text-base font-semibold text-body">any other service — we take it off when we confirm your price</p>
        </div>
        <dl className="divide-y divide-zinc-200">
          {DISCOUNTED.map(([name, amount, unit]) => (
            <div key={name} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="text-base text-body">{name}</dt>
              <dd className="flex-none text-base text-ink">From <strong className="font-black">${amount}</strong> <span className="text-muted">{unit}</span></dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-base text-body">Fireplace, brick or stone, home installations</dt>
            <dd className="flex-none text-base text-ink">By quote</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-base font-bold text-ink">Black Friday</dt>
            <dd className="flex-none text-base font-black text-brand-dark">{BF_DISCOUNT_PCT}% off all of the above</dd>
          </div>
        </dl>
        <ButtonLink href="/book" variant="secondary" className="w-full lg:w-auto">Book with {BF_DISCOUNT_PCT}% off</ButtonLink>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted">
        {BF_PROMO_TERMS_LINE} Black Friday prices are starting prices: your final price depends on the job, the wall type and the mount, and is
        confirmed by our team before any work begins. The {BF_DISCOUNT_PCT}% is taken off that confirmed price, applies to services booked without a Black Friday
        Promo and can&apos;t be combined with coupon codes. Limited-time offer.
      </p>
    </Section>
  )
}
