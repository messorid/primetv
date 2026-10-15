// The homepage hero. It answers "am I in the right place?" in a few seconds:
// the service and city, the starting price, two clear next steps and the
// phone number, with real installation photos beside it.
//
// Nothing here moves on its own except the photo carousel, which has a
// visible pause button (WCAG 2.2.2). The old city ticker and the floating
// image ran forever with no way to stop them, and the "Job completed —
// Brentwood · Today" card was a fixed message dressed up as live activity, so
// all three are gone.
import { Star } from "lucide-react"
import HeroCarousel from "./HeroCarousel"
import { HERO_SLIDES } from "../lib/photos"
import { ButtonLink, Check, PHONE_DISPLAY, PHONE_TEL } from "./ui/Section"

const POINTS = ["Licensed & insured", "Upfront pricing", "Clean cable finish", "Workmanship warranty"]

const STATS = [
  { value: "500+", label: "TVs installed" },
  { value: "4.8", label: "Google rating", star: true },
  { value: "Same day", label: "When available" },
  { value: "5 years", label: "Mounting in Nashville" },
]

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="w-full bg-white text-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pt-8 pb-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-14 lg:pb-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1.5 text-sm font-bold text-brand-dark">
            <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
            Same-day &amp; next-day availability
          </p>

          <h1 id="hero-title" className="mt-5 text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-[3.6rem] font-black tracking-tight">
            Professional <span className="text-brand">TV Mounting</span> in Nashville, TN
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-body">
            Same-day availability, clean cable concealment, upfront pricing and a workmanship warranty
            on every installation across Nashville and the surrounding areas.
          </p>

          <p className="mt-4 text-lg font-bold text-ink">
            From $110 per TV <span className="font-medium text-muted">· drywall included</span>
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/book" className="w-full sm:w-auto">
              Book installation
              <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </ButtonLink>
            <ButtonLink href="#quick-quote" variant="secondary" className="w-full sm:w-auto">
              Get a free quote
            </ButtonLink>
          </div>

          <p className="mt-4 text-base text-body">
            Prefer to talk?{" "}
            <a href={PHONE_TEL} className="font-bold text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand-dark">
              Call {PHONE_DISPLAY}
            </a>
          </p>

          <ul className="mt-7 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {POINTS.map(p => (
              <li key={p} className="flex items-center gap-2.5 text-base font-semibold text-ink">
                <Check className="text-emerald-600" /> {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-lg lg:max-w-none">
          <HeroCarousel slides={HERO_SLIDES} className="aspect-[4/3] rounded-3xl shadow-xl ring-1 ring-black/5" />
        </div>
      </div>

      {/* The numbers, in a plain strip under the hero rather than as cards
          floating over the photo. */}
      <div className="border-y border-zinc-200 bg-soft">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4">
          {STATS.map(s => (
            <div key={s.label} className="flex flex-col items-center justify-center py-5 text-center md:py-6">
              <dt className="order-2 mt-1 text-sm font-medium text-muted">{s.label}</dt>
              <dd className="order-1 flex items-center gap-1.5 text-2xl font-black text-ink">
                {s.star && <Star aria-hidden="true" size={20} className="fill-amber-400 text-amber-400" />}
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
