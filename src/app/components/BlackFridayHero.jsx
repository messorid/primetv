// The homepage hero while BLACK_FRIDAY_ON is true (lib/blackFriday.js): the
// sale first — the bundles and the 10% — with the three promo artworks, each a
// link that opens the booking form with that bundle chosen. Nothing moves on
// its own. `children` is the stats strip from HeroSection.
import Image from "next/image"
import Link from "next/link"
import { ButtonLink, Check, PHONE_DISPLAY, PHONE_TEL } from "./ui/Section"
import { BF_PROMOS, BF_DISCOUNT_PCT, BF_PROMO_TERMS, bfBookHref } from "../lib/blackFriday"

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

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pt-8 pb-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-14 lg:pb-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm font-bold text-white">
              <span aria-hidden="true" className="size-2 flex-none rounded-full bg-brand-bright" />
              Limited-time deals · Same-day &amp; next-day availability
            </p>

            <h1 id="hero-title" className="mt-5 font-black tracking-tight">
              <span className="block text-[3.5rem] italic uppercase leading-[0.92] sm:text-7xl lg:text-[5.75rem]">
                Black <span className="text-brand-bright">Friday</span>
              </span>
              <span className="mt-4 block text-2xl leading-tight sm:text-3xl lg:text-4xl">
                TV Mounting Deals in Nashville, TN
              </span>
            </h1>

            {/* The two offers, as large as the headline. */}
            <div className="mt-7 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              <div className="rounded-2xl bg-brand p-4 sm:p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-white">Black Friday Promo</p>
                <p className="mt-1 text-base font-semibold text-white">{first.short}</p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="text-base font-semibold text-white">From</span>
                  <span className="text-5xl font-black leading-none text-white">${first.amount}</span>
                </p>
                <p className="mt-2 text-sm font-semibold leading-snug text-white">{BF_PROMO_TERMS.join(" · ")}</p>
              </div>
              <div className="rounded-2xl border border-white/25 bg-white/10 p-4 sm:p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-brand-bright">Everything else</p>
                <p className="mt-1 text-base font-semibold text-white">Any other service</p>
                <p className="mt-1 text-5xl font-black leading-none text-white">{BF_DISCOUNT_PCT}% OFF</p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#black-friday" className="w-full sm:w-auto">
                See the Black Friday deals
                <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </ButtonLink>
              <ButtonLink href="/book" variant="outlineDark" className="w-full sm:w-auto">
                Book installation
              </ButtonLink>
            </div>

            <p className="mt-4 text-base text-white/85">
              Prefer to talk?{" "}
              <a href={PHONE_TEL} className="font-bold text-white underline decoration-brand-bright decoration-2 underline-offset-4 hover:text-brand-bright">
                Call {PHONE_DISPLAY}
              </a>
            </p>

            <ul className="mt-7 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {POINTS.map(p => (
                <li key={p} className="flex items-center gap-2.5 text-base font-semibold text-white">
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
