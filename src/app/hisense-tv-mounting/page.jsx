import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import PriceDisclaimer from "../components/PriceDisclaimer"
import {
  SeoBreadcrumb, SeoHero, Eyebrow, FaqAccordion, CityLinkBand,
  RelatedLinks, SeoCta, AffiliationFootnote, SeriesCard,
} from "../components/TvSeoLayout"
import { serviceSchema, faqSchema, breadcrumbSchema, JsonLd } from "../lib/tvSeoSchema"
import { BASE, PRICES, seriesForBrand, codeFor, guideFor, getBrand } from "../lib/tvModels"

const URL = `${BASE}/hisense-tv-mounting`

export const metadata = {
  title: "Hisense TV Mounting in Nashville, TN | PrimeTvNashville",
  description:
    "Hisense TV mounting in Nashville TN. U7, U6, U65 Pro, R6 Roku TV and E-series mounted into studs by a two-person crew. Starting from $110 per TV.",
  keywords: [
    "Hisense TV mounting Nashville",
    "Hisense TV installation Nashville TN",
    "Hisense U7 wall mount",
    "mount Hisense 75 inch TV",
    "Hisense U65 Pro installer Nashville",
    "75U7SG wall mounting",
  ],
  openGraph: {
    title: "Hisense TV Mounting in Nashville, TN | PrimeTvNashville",
    description:
      "Professional Hisense TV wall mounting across Nashville and Middle Tennessee. ULED, Mini-LED and Roku TV models.",
    url: URL,
    siteName: "PrimeTvNashville",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "Hisense TV wall mounting in Nashville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: URL },
}

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 }

const FAQS = [
  {
    q: "How much does Hisense TV mounting cost in Nashville?",
    a: `Sets up to 55 inches start ${PRICES.upTo55.toLowerCase()}, and anything larger starts ${PRICES.over55.toLowerCase()}. Because most Hisense sets people call us about are 65 inches and up, the second figure is the one that usually applies. These are starting prices — the wall, the difficulty and the bracket decide the rest, and a sales representative confirms your exact price before we begin.`,
  },
  {
    q: "Can my drywall hold an 85-inch Hisense?",
    a: "Almost always — but only if the bracket is anchored into studs, not into drywall anchors. Drywall on its own cannot hold a panel of that weight, and the failure mode is not subtle: the mount pulls out and takes a section of wall and the TV with it. We find and confirm the studs first. If the wall genuinely cannot take it, we will tell you before we start rather than after.",
  },
  {
    q: "Why does my Hisense U7 stick out further from the wall than I expected?",
    a: "The U-series uses Mini-LED backlighting, which makes the chassis deeper than a basic LED panel. Add a full-motion arm behind it and the gap grows again. If you want the TV close to the wall, say so when you book — it changes which class of bracket makes sense, and it is much easier to choose correctly than to re-drill later.",
  },
  {
    q: "Do you mount Hisense TVs bought from Costco, Walmart or Amazon?",
    a: "Yes. We do not sell televisions and we have no stake in where you bought yours. Costco, Sam's Club, Walmart, Best Buy, Amazon or direct — if it is in the room, we will mount it. We also do not sell mounts, though we will tell you which bracket class to buy before you order one.",
  },
  {
    q: "Can you take down my old TV and put the Hisense up in the same visit?",
    a: "Yes, and it is a common request when people upgrade to a bigger U-series set. Mention it when you book so we allow the time. If the existing bracket was installed badly — a single stud, or drywall anchors alone, which we find more often than you would like — we will re-anchor properly rather than reuse it.",
  },
  {
    q: "Do you hide the cables on a Hisense install?",
    a: `Cable concealment starts ${PRICES.cables.toLowerCase()} as an add-on. In-wall routing gives a completely invisible finish; where the wall will not allow it we run a paintable surface raceway instead. On a deeper Mini-LED chassis there is a little more room to work with behind the panel than on a thin LED set, which sometimes makes the in-wall route easier.`,
  },
]

export default function HisenseTvMountingPage() {
  const brand  = getBrand("hisense")
  const series = seriesForBrand("hisense")

  const schema = [
    serviceSchema({
      name: "Hisense TV Mounting in Nashville, TN",
      description:
        "Professional wall mounting and installation of Hisense televisions, including the U7, U6, U65 Pro, R6 Roku TV and E-series, across Nashville and Middle Tennessee.",
      serviceType: "Hisense TV Mounting",
      url: URL,
    }),
    breadcrumbSchema([{ name: "Hisense TV Mounting", path: "/hisense-tv-mounting" }]),
    faqSchema(FAQS),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-6 pt-6">
          <SeoBreadcrumb trail={[{ label: "Hisense TV Mounting" }]} />
        </div>
      </div>

      <SeoHero
        eyebrow={<Eyebrow>Hisense · ULED, Mini-LED &amp; Roku TV</Eyebrow>}
        title="Hisense TV Mounting"
        accent="in Nashville, TN"
        lead={brand.angle}
        body="We mount Hisense panels across Nashville, Hendersonville, Mount Juliet and Smyrna — anchored into studs by a two-person crew, levelled, cables managed and tested before we leave."
        facts={[
          { label: "Up to 55 inches", value: PRICES.upTo55 },
          { label: "Over 55 inches",  value: PRICES.over55 },
          { label: "Workmanship",     value: PRICES.warranty },
        ]}
      />

      {/* THE WALL, NOT THE TV */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">
            With Hisense, the Conversation Is Usually About the Wall
          </h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl">
            <p>
              Hisense has done something specific to the market in Middle Tennessee: it has made a
              very large screen affordable. A 75 or 85-inch U-series set lands in living rooms at a
              price that a 65-inch would have cost not long ago. That is good news for the customer
              and it changes our job in one particular way.
            </p>
            <p>
              A panel that size weighs what any panel that size weighs. Price has nothing to do with
              it. <strong>An 85-inch television typically weighs 90 lbs or more</strong>, and the
              wall does not care that the TV was a bargain. So the first thing we do on a large
              Hisense install is find the studs and confirm them properly — not tap the wall, not
              trust a magnet on its own, and never fall back on drywall anchors for a panel of that
              weight.
            </p>
            <p>
              This matters more than usual with Hisense because of who buys them. We are frequently
              called out to a set that a previous owner or a well-meaning relative hung on a single
              stud, or worse. Those come down and go back up properly. If your wall is masonry,
              plaster over brick, or a metal-stud partition — all of which turn up in older Nashville
              homes and in condo conversions — that changes the anchor, and there is a surcharge{" "}
              {PRICES.hardWall.toLowerCase()}.
            </p>
            <p>
              The second thing worth knowing is depth. The <strong>U7</strong> and{" "}
              <strong>U65 Pro</strong> use Mini-LED backlighting, and a Mini-LED chassis is deeper
              than the thin LED panel most people picture when they imagine a modern TV. If you want
              the set sitting tight against the wall, the bracket choice has to account for that. We
              fit the arms to the panel and check the depth with the TV actually on the mount, which
              is the step that stops a bracket looking right on paper and wrong on the wall.
            </p>
            <p>
              The easier end of the range is the <strong>U6</strong> at 65 inches, the{" "}
              <strong>E6SR</strong> and the <strong>E7</strong>. Those are light, conventional panels
              that go up on a standard tilt bracket without much drama, and they are common choices
              for bedrooms and bonus rooms. The <strong>R6 Roku TV</strong> at 75 inches sits in
              between: easy electronically, heavy physically.
            </p>
          </div>
        </div>
      </section>

      {/* SERIES */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Hisense Series We Mount</h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            Model codes where Hisense publishes them. If your set is not here, send us the code from
            the sticker on the back — we mount the whole range.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {series.map(s => {
              const guide = guideFor(s.id)
              return (
                <SeriesCard
                  key={s.id}
                  s={s}
                  code={codeFor(s, 75) || codeFor(s, 65)}
                  guideHref={guide ? `/blog/${guide.slug}` : null}
                  sizesLabel={s.sizes.map(n => `${n}"`).join(" · ")}
                />
              )
            })}
          </div>

          <div className="mt-8">
            <PriceDisclaimer className="max-w-3xl" />
          </div>
        </div>
      </section>

      {/* CREW */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">
            How We Handle a Big Hisense
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "Studs found and confirmed, every time",
                desc: "The first ten minutes of a large install are spent on the wall, not the TV. We locate the studs, confirm them, and centre the bracket across two of them. On a 16-inch spacing a 75 or 85-inch bracket can often reach three, and we take that when we can get it.",
              },
              {
                title: "Two technicians on anything over 55 inches",
                desc: "A 75-inch panel is wider than one person's arm span. The damage happens when somebody tries to hold the weight and line up the bracket simultaneously, so we do not put anyone in that position.",
              },
              {
                title: "Depth set with the panel on the mount",
                desc: "Mini-LED sets sit further off the wall than people expect. We check the finished gap with the TV actually hanging, while there is still time to change something.",
              },
              {
                title: "Old mount assessed, not assumed",
                desc: "If you are replacing a TV, we look at what is already in the wall. Reusing a bracket that was anchored badly just moves the problem to a heavier panel, so we re-anchor when we need to.",
              },
              {
                title: "Hard walls get the right anchor",
                desc: `Brick, stone, concrete, tile and metal stud all need different hardware and a slower approach. Surcharge starts at $25. Drywall carries no extra charge.`,
              },
              {
                title: "Tested, tidied, and walked through",
                desc: "Inputs cycled, soundbar or console confirmed working through the set, cables managed and the packaging broken down. We leave you with a working TV.",
              },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-extrabold text-black mb-2">{f.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqAccordion heading="Hisense TV Mounting — Common Questions" faqs={FAQS} />

      <RelatedLinks
        heading="Mounting a Hisense by Size"
        intro="Which U-series you bought matters less than how big it is. The size decides the crew, the wall and the height."
        links={[
          { kicker: "Size guide", href: "/65-inch-tv-mounting", title: "65-Inch TV Mounting", desc: "The U6, U7, E6SR and E7 at the easiest size to get right." },
          { kicker: "Size guide", href: "/75-inch-tv-mounting", title: "75-Inch TV Mounting", desc: "U7, U6, U65 Pro and the R6 — two technicians from here up." },
          { kicker: "Size guide", href: "/85-inch-tv-mounting", title: "85-Inch TV Mounting", desc: "U7 and U65 Pro, and what your wall has to be able to take." },
          { kicker: "Guide", href: "/blog/how-to-mount-hisense-u7-75-inch", title: "How to Mount a 75-Inch Hisense U7", desc: "Step by step, including the Mini-LED depth problem." },
          { kicker: "Add-on", href: "/cable-concealment-nashville", title: "Cable Concealment", desc: `In-wall routing or painted raceway, ${PRICES.cables.toLowerCase()}.` },
          { kicker: "Specialty", href: "/tv-mounting-over-fireplace-nashville", title: "TV Over Fireplace", desc: "Heat clearance checked before we commit to a height." },
        ]}
      />

      <CityLinkBand intro="We mount Hisense TVs across Nashville and every surrounding city below. Pick yours for local availability." />

      <SeoCta
        heading="Got a Big Hisense and a Bare Wall?"
        sub="Send us the model code and your ZIP. We will confirm the bracket class, the crew and the price."
        footLinks={[
          { label: "Samsung", href: "/samsung-tv-mounting" },
          { label: "TCL", href: "/tcl-tv-mounting" },
          { label: "LG", href: "/lg-tv-mounting" },
          { label: "Pricing", href: "/pricing" },
        ]}
      />

      <AffiliationFootnote />
      <StickyActionBar />
    </>
  )
}
