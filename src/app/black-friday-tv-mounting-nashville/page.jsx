// The Black Friday offer on its own page: the address to share on social
// media, Google Business and texts, and the same address every year. While
// BLACK_FRIDAY_ON is true (lib/blackFriday.js) it shows the deals; when the
// sale is off it says so and points to regular pricing, so the URL never dies.
import Image from "next/image"
import Link from "next/link"
import BlackFridayDeals from "../components/BlackFridayDeals"
import { Section, SectionHeader, ButtonLink, PHONE_DISPLAY, PHONE_TEL } from "../components/ui/Section"
import {
  BLACK_FRIDAY_ON, BF_PROMOS, BF_DISCOUNT_PCT, BF_PROMO_TERMS_LINE, bfBookHref,
} from "../lib/blackFriday"

const URL = "https://www.primetvnashville.com/black-friday-tv-mounting-nashville"
const lowest = Math.min(...BF_PROMOS.map(p => p.amount))

const TITLE = "Black Friday TV Mounting Deals in Nashville, TN | PrimeTvNashville"
const DESCRIPTION = BLACK_FRIDAY_ON
  ? `Black Friday TV mounting deals in Nashville: 2 TVs up to 55 inches mounted from $${lowest}, more 2-TV promos, and ${BF_DISCOUNT_PCT}% off any other service. Book online.`
  : "Our Black Friday TV mounting deals in Nashville have ended. See current TV mounting prices and book your installation online."

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE, description: DESCRIPTION, url: URL, siteName: "PrimeTvNashville", locale: "en_US", type: "website",
    images: [{ url: `https://www.primetvnashville.com${BF_PROMOS[0].image}`, width: 1254, height: 1254, alt: BF_PROMOS[0].alt }],
  },
  robots: { index: true, follow: true },
}

const STEPS = [
  ["Pick your deal", "Choose a Black Friday Promo for two TVs, or book any other service and get the 10% off."],
  ["Choose a date and time", "Book online in a couple of minutes. Same-day and next-day appointments when available."],
  ["We confirm your price", "Our team confirms your exact price before any work begins, then mounts your TVs level and secure."],
]

const FAQ = [
  {
    q: "Which TVs do the Black Friday Promos cover?",
    a: `Each promo is for two TVs mounted in the same visit at the same address, up to the size it names: two TVs up to 55 inches, one up to 55 inches plus one up to 70 inches, or two up to 70 inches. ${BF_PROMO_TERMS_LINE}`,
  },
  {
    q: "What if my wall is brick or stone, or the TV goes over a fireplace?",
    a: `Those installs aren't part of the promos, but they still get the Black Friday ${BF_DISCOUNT_PCT}% off. Book them as a standard service and we take the ${BF_DISCOUNT_PCT}% off when we confirm your price.`,
  },
  {
    q: `How does the ${BF_DISCOUNT_PCT}% off work?`,
    a: `Any service booked without a Black Friday Promo gets ${BF_DISCOUNT_PCT}% off: a single TV, a TV over 70 inches, cable concealment, a fireplace install or a home installation. We take it off the price our team confirms with you before the work begins. It can't be combined with coupon codes.`,
  },
  {
    q: "Is the wall mount included?",
    a: "No. Our prices don't include the bracket and we don't sell mounts, but we help you choose the right one for your TV and wall before you buy it.",
  },
  {
    q: "Can I add cable concealment to a promo?",
    a: "Yes. Hiding the cables is an add-on from $70 per TV, and you can add it when you book a promo.",
  },
  {
    q: "I bought my TV somewhere else. Will you mount it?",
    a: "Yes. We mount TVs bought at any store. Have the TV and a VESA-compatible mount at home for the appointment.",
  },
  {
    q: "Are these final prices?",
    a: "They are starting prices. Your final price depends on the difficulty of the job, the wall and the mount being installed, and one of our team confirms it with you before any work begins.",
  },
]

const GUIDES = [
  ["/blog/just-bought-tv-black-friday-mounting-nashville", "Just bought a TV on Black Friday? How to get it mounted"],
  ["/blog/what-tv-mount-do-i-need", "What TV mount do I need?"],
  ["/blog/best-tvs-black-friday", "The best TVs to buy this Black Friday"],
  ["/blog/how-much-does-tv-mounting-cost-nashville", "How much does TV mounting cost in Nashville?"],
]

export default function BlackFridayPage() {
  if (!BLACK_FRIDAY_ON) return <Ended />

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.primetvnashville.com" },
        { "@type": "ListItem", position: 2, name: "Black Friday TV Mounting Deals", item: URL },
      ],
    },
  ]

  return (
    <div className="flex w-full flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section aria-labelledby="bf-page-title" className="relative w-full overflow-hidden bg-ink text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-brand/30 blur-3xl" />
          <div className="absolute -bottom-52 right-0 size-[30rem] rounded-full bg-brand/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 lg:pt-16 lg:pb-16">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-bright">Limited-time deals</p>
          <h1 id="bf-page-title" className="mt-3 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="italic uppercase">Black <span className="text-brand-bright">Friday</span></span>{" "}
            TV Mounting Deals in Nashville, TN
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            Two TVs mounted from ${lowest} with a Black Friday Promo, or {BF_DISCOUNT_PCT}% off any other service.
            Professional, level and secure, across Nashville and the surrounding areas.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#black-friday" className="w-full sm:w-auto">See the deals</ButtonLink>
            <ButtonLink href="/book" variant="outlineDark" className="w-full sm:w-auto">Book installation</ButtonLink>
          </div>
          <p className="mt-4 text-base text-white/85">
            Prefer to talk?{" "}
            <a href={PHONE_TEL} className="font-bold text-white underline decoration-brand-bright decoration-2 underline-offset-4 hover:text-brand-bright">Call {PHONE_DISPLAY}</a>
          </p>

          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {BF_PROMOS.map((p, i) => (
              <li key={p.id}>
                <Link href={bfBookHref(p.id)} className="block overflow-hidden rounded-2xl ring-1 ring-white/15 transition hover:ring-2 hover:ring-brand-bright">
                  <Image src={p.image} alt={`${p.alt}. Book this promo.`} width={1254} height={1254} priority={i === 0}
                    sizes="(max-width:640px) 100vw, 33vw" className="aspect-square w-full object-cover" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BlackFridayDeals />

      <Section tone="soft" labelledBy="bf-how-title">
        <SectionHeader id="bf-how-title" eyebrow="How it works" title="Booked in three steps" />
        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7">
              <p aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-ink text-lg font-black text-white">{i + 1}</p>
              <h3 className="mt-4 text-xl font-extrabold text-ink">{title}</h3>
              <p className="mt-2 text-base leading-relaxed text-body">{text.replace("10%", `${BF_DISCOUNT_PCT}%`)}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8"><ButtonLink href="/book">Book your installation</ButtonLink></div>
      </Section>

      <Section labelledBy="bf-faq-title">
        <SectionHeader id="bf-faq-title" eyebrow="Questions" title="Black Friday deals: what to know" />
        <div className="mt-8 max-w-3xl space-y-3">
          {FAQ.map(f => (
            <details key={f.q} className="group rounded-2xl border border-zinc-200 bg-white">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-bold text-ink sm:text-lg">{f.q}</h3>
                <span aria-hidden="true" className="flex size-8 flex-none items-center justify-center rounded-full border-2 border-zinc-300 text-lg font-bold text-ink transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-5 text-[17px] leading-relaxed text-body">{f.a}</p>
            </details>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-extrabold tracking-tight text-ink">Getting a new TV this Black Friday?</h2>
        <ul className="mt-4 space-y-2.5">
          {GUIDES.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="inline-flex min-h-[44px] items-center text-base font-bold text-brand-dark underline decoration-2 underline-offset-4 hover:text-ink">{label}</Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function Ended() {
  return (
    <Section labelledBy="bf-ended-title">
      <SectionHeader
        id="bf-ended-title"
        eyebrow="Black Friday"
        title="Our Black Friday TV mounting deals have ended"
        sub="Our regular pricing is upfront, and you can book online in a couple of minutes."
      />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/pricing">See current prices</ButtonLink>
        <ButtonLink href="/book" variant="secondary">Book installation</ButtonLink>
      </div>
    </Section>
  )
}
