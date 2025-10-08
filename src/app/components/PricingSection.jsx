"use client"

import Link from "next/link"

export default function PricingSection() {
  return (
    <section id="pricing" className="w-full bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <header className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold">Transparent pricing</h2>
          <p className="mt-2 text-black/70">
            Simple rates for professional TV mounting. Choose your option and book in minutes
          </p>
        </header>

        {/* Base pricing */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <PriceCard
            title='TV up to 55 inches'
            price='$110 per TV'
            features={[
              'Level and secure mount on studs',
              'Safety check and cleanup',
              'Drywall included no extra'
            ]}
            ctaLabel='Book up to 55 in'
            href='/book?service=tv-up-to-55'
          />
          <PriceCard
            title='TV over 55 inches'
            price='$140 per TV'
            features={[
              'Two person handling for large panels',
              'Level and secure mount on studs',
              'Drywall included no extra'
            ]}
            highlight
            ctaLabel='Book over 55 in'
            href='/book?service=tv-over-55'
          />
        </div>

        {/* Add ons */}
        <div className="mt-10">
          <h3 className="text-xl font-bold">Popular add ons</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Addon label="Cable concealment" value="$60 per TV" />
            <Addon label="Over fireplace handling" value="from $25 extra" />
            <Addon label="Wall type surcharge" value="$25 for concrete tile stone or metal" />
          </div>
          <p className="mt-3 text-sm text-black/60">
            Drywall has no extra charge. For concrete tile stone or metal there is a $25 surcharge
          </p>
        </div>

        {/* Promotions */}
        <div className="mt-10">
          <h3 className="text-xl font-bold">Current promotions</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <PromoCard
              title="2 TVs up to 55 inches"
              price="$199 total"
              note="Same visit same address"
              href='/book?promo=2tvs-under55'
            />
            <PromoCard
              title="2 TVs over 55 inches"
              price="$250 total"
              note="Same visit same address"
              href='/book?promo=2tvs-over55'
            />
          </div>
        </div>

        {/* Important notes */}
        <div className="mt-10 rounded-2xl border border-black/10 bg-white p-4">
          <ul className="text-sm text-black/80 list-disc pl-5 space-y-2">
            <li>Prices do not include the bracket mount</li>
            <li>We do not sell mounts but we help you choose and find the right one</li>
            <li>All jobs include level calibration secure anchoring and basic cleanup</li>
            <li>Same day and next day options when available</li>
          </ul>
        </div>

        {/* Bottom CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-6 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-red-500/30"
          >
            Book installation
          </Link>
          <Link
            href="#quick-quote"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 font-semibold text-black hover:bg-black/5 transition"
          >
            Get a quick quote
          </Link>
        </div>
      </div>
    </section>
  )
}

/* subcomponents */

function PriceCard({ title, price, features = [], highlight = false, ctaLabel, href }) {
  return (
    <div className={`relative rounded-2xl border ${highlight ? "border-[#E50914]" : "border-black/10"} bg-white p-6 shadow-sm`}>
      {highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-[#E50914] px-3 py-1 text-xs font-semibold text-white">
          Most selected
        </span>
      )}
      <h4 className="text-lg font-bold">{title}</h4>
      <div className="mt-1 text-2xl font-extrabold">{price}</div>
      <ul className="mt-4 space-y-2 text-sm text-black/70">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E50914]" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  )
}

function Addon({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-sm text-black/60">Add on</div>
      <div className="mt-1 font-bold">{label}</div>
      <div className="text-[#E50914] font-semibold">{value}</div>
    </div>
  )
}

function PromoCard({ title, price, note, href }) {
  return (
    <div className="relative rounded-2xl border border-black/10 bg-gradient-to-br from-white to-black/[0.02] p-6">
      <h4 className="text-lg font-bold">{title}</h4>
      <div className="mt-1 text-2xl font-extrabold text-[#E50914]">{price}</div>
      <p className="mt-1 text-sm text-black/60">{note}</p>
      <div className="mt-6">
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold hover:bg-black/5 transition"
        >
          Book promo
        </Link>
      </div>
    </div>
  )
}
