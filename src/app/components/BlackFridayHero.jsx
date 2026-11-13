// The homepage hero while BLACK_FRIDAY_ON is true (lib/blackFriday.js): the
// sale first — the bundles and the 10% — with the three promo artworks, each a
// link that opens the booking form with that bundle chosen. Nothing moves on
// its own. `children` is the stats strip from HeroSection.
import Image from "next/image"
import Link from "next/link"
import { ButtonLink, Check, PHONE_DISPLAY, PHONE_TEL } from "./ui/Section"
import { BF_PROMOS, BF_DISCOUNT_PCT, BF_PROMO_TERMS, BF_COUPON_CODE, bfBookHref } from "../lib/blackFriday"

const POINTS = ["Licensed & insured", "Upfront pricing", "Clean cable finish", "Workmanship warranty"]

export default function BlackFridayHero({ children }) {
  const first = BF_PROMOS.reduce((a, b) => (b.amount < a.amount ? b : a))
  return (
    <section aria-labelledby="hero-title" className="w-full bg-ink text-white">
      <div className="relative overflow-hidden">
        {/* Red light and a diagonal band, like the promo artwork. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-brand/30 blur-3xl" />
          <div className="absolute -bottom-52 right-0 size-[30rem] rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -left-24 top-0 h-full w-40 -skew-x-12 bg-gradient-to-b from-brand/40 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pt-6 pb-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-10 lg:pb-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm font-bold text-white">
              <span aria-hidden="true" className="size-2 flex-none rounded-full bg-brand-bright" />
              Limited-time deals · Same-day &amp; next-day availability
            </p>

            <h1 id="hero-title" className="mt-4 font-black tracking-tight">
              <span className="block text-[3.25rem] italic uppercase leading-[0.92] sm:text-7xl lg:text-[4.5rem] xl:text-[5rem]">
                Black <span className="text-brand-bright">Friday</span>
              </span>
              <span className="mt-3 block text-2xl leading-tight sm:text-3xl lg:text-[2rem]">
                TV Mounting Deals in Nashville, TN
              </span>
            </h1>

            {/* The two offers, as large as the headline. */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:mt-6">
              <div className="rounded-2xl bg-brand p-3.5 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-white sm:text-sm">Black Friday Promo</p>
                <p className="mt-1 text-sm font-semibold leading-snug text-white sm:text-base">{first.short}</p>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-semibold text-white sm:text-base">From</span>
                  <span className="text-4xl font-black leading-none text-white sm:text-5xl">${first.amount}</span>
                </p>
                <p className="mt-2 text-xs font-semibold leading-snug text-white sm:text-sm">{BF_PROMO_TERMS.join(" · ")}</p>
              </div>
              <div className="rounded-2xl border border-white/25 bg-white/10 p-3.5 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-bright sm:text-sm">Everything else</p>
                <p className="mt-1 text-sm font-semibold leading-snug text-white sm:text-base">Any other service</p>
                <p className="mt-1 text-[2rem] font-black leading-none text-white sm:text-5xl">{BF_DISCOUNT_PCT}% OFF</p>
                <p className="mt-2 text-xs font-semibold leading-snug text-white sm:text-sm">
                  With code <span className="whitespace-nowrap rounded bg-white px-1.5 py-0.5 font-black tracking-wide text-ink">{BF_COUPON_CODE}</span>
                </p>
              </div>
            </div>

            {/* Booking is the main action; the deals are one scroll away. */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:mt-6">
              <ButtonLink href="/book" className="w-full sm:w-auto">
                Book a Black Friday deal
                <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </ButtonLink>
              <ButtonLink href="#black-friday" variant="outlineDark" className="w-full sm:w-auto">
                See all the deals
              </ButtonLink>
            </div>

            <p className="mt-4 text-base text-white/85">
              Prefer to talk?{" "}
              <a href={PHONE_TEL} className="font-bold text-white underline decoration-brand-bright decoration-2 underline-offset-4 hover:text-brand-bright">
                Call {PHONE_DISPLAY}
              </a>
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {POINTS.map(p => (
                <li key={p} className="flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                  <Check className="text-emerald-400" /> {p}
                </li>
              ))}
            </ul>
          </div>

          {/* The three promos, uncropped: one large, two stacked beside it. The
              artwork carries its own words, repeated in each image's alt text;
              every one opens the form with that promo chosen. */}
          <div className="mx-auto grid w-full max-w-lg grid-cols-3 grid-rows-2 gap-2.5 sm:gap-3 lg:max-w-none">
            {BF_PROMOS.map((p, i) => (
              <Link key={p.id} href={bfBookHref(p.id)}
                className={`block overflow-hidden rounded-2xl ring-1 ring-white/15 transition hover:ring-2 hover:ring-brand-bright ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                <Image src={p.image} alt={`${p.alt}. Book this promo.`} width={1254} height={1254}
                  priority={i === 0}
                  sizes={i === 0 ? "(max-width:1024px) 67vw, 380px" : "(max-width:1024px) 33vw, 190px"}
                  className="aspect-square w-full object-cover" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {children}
    </section>
  )
}
