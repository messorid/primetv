import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import PriceDisclaimer from "../components/PriceDisclaimer"
import {
  SeoBreadcrumb, SeoHero, Eyebrow, FaqAccordion, CityLinkBand,
  RelatedLinks, SeoCta, AffiliationFootnote, SizeModelTable, SizeFactsGrid,
} from "../components/TvSeoLayout"
import { serviceSchema, faqSchema, breadcrumbSchema, JsonLd } from "../lib/tvSeoSchema"
import { BASE, PRICES, seriesForSize, codeFor, guideFor, brandLabel, getSize } from "../lib/tvModels"

const SIZE = 75
const URL = `${BASE}/75-inch-tv-mounting`

export const metadata = {
  title: "75-Inch TV Mounting in Nashville, TN | PrimeTvNashville",
  description:
    "75-inch TV mounting in Nashville TN from $140 per TV. Two technicians, studs confirmed, height set from your sofa. Samsung, Hisense, TCL, LG and more.",
  keywords: [
    "75 inch TV mounting Nashville",
    "mount 75 inch TV Nashville TN",
    "75 inch TV installation near me",
    "75 inch TV wall mount studs",
    "75 inch TV over fireplace",
  ],
  openGraph: {
    title: "75-Inch TV Mounting in Nashville, TN | PrimeTvNashville",
    description:
      "Professional 75-inch TV wall mounting across Nashville and Middle Tennessee. Two technicians on every install.",
    url: URL,
    siteName: "PrimeTvNashville",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "75 inch TV wall mounting in Nashville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: URL },
}

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 }

const FAQS = [
  {
    q: "How much does it cost to mount a 75-inch TV in Nashville?",
    a: `Mounting starts ${PRICES.over55.toLowerCase()} for any set over 55 inches, which includes every 75-inch panel. Two sets over 55 inches at the same address in the same visit start ${PRICES.twoOver55.toLowerCase()}. These are starting prices: the wall type, the difficulty and the bracket move the final figure, and one of our sales representatives confirms it before work begins.`,
  },
  {
    q: "Do you really need two people to mount a 75-inch TV?",
    a: "Yes, and not as a precaution. A 75-inch panel is physically wider than one person's arm span, so a single installer cannot support the weight and align the bracket at the same time. That exact moment — holding and aligning together — is when panels get cracked and walls get gouged. We send two technicians on every 75-inch install and we do not offer a cheaper one-person version.",
  },
  {
    q: "How many studs does a 75-inch TV need?",
    a: "Two at minimum, with the bracket centred across them rather than hanging off one edge. On standard 16-inch framing a 75-inch bracket can often reach three studs, and when it can, we take it. We find and confirm the studs properly before drilling — a magnet alone is not confirmation on a wall that has to hold this much weight.",
  },
  {
    q: "What height should I mount a 75-inch TV?",
    a: "Start from centre-of-screen at seated eye level, roughly 42 to 48 inches off the floor. The complication at 75 inches is that the screen is tall enough that a centre in that range can push the bottom edge down close to a media console. There is no table that solves this — we set the height with your furniture in the room and someone sitting on the sofa, then mark the wall.",
  },
  {
    q: "Can a 75-inch TV go above my fireplace?",
    a: `Sometimes, and this is the size where the answer starts being no. Over-fireplace handling starts ${PRICES.fireplace.toLowerCase()}, but the real constraint is geometry: many Nashville mantels do not leave enough wall to get a 75-inch screen above the heat plume and still keep a viewing angle you can tolerate for a whole film. We measure before we quote, and if the numbers do not work we will tell you and suggest a different wall.`,
  },
  {
    q: "My 75-inch TV was cheap. Does that change anything about the install?",
    a: "Not one thing. A budget 75-inch panel weighs essentially what a premium one weighs, and the wall has no idea what you paid. We get called out to inexpensive big-screen sets hung on a single stud or on drywall anchors more often than any other job, and those come down and go back up correctly.",
  },
]

export default function Size75Page() {
  const size   = getSize(SIZE)
  const series = seriesForSize(SIZE)

  const rows = series.map(s => {
    const guide = guideFor(s.id, SIZE)
    return {
      id: s.id,
      brand: brandLabel(s),
      model: s.name,
      panel: s.panel,
      code: codeFor(s, SIZE),
      href: guide ? `/blog/${guide.slug}` : null,
    }
  })

  const schema = [
    serviceSchema({
      name: "75-Inch TV Mounting in Nashville, TN",
      description:
        "Professional two-technician wall mounting and installation of 75-inch televisions from every major brand across Nashville and Middle Tennessee.",
      serviceType: "75-Inch TV Mounting",
      url: URL,
    }),
    breadcrumbSchema([{ name: "75-Inch TV Mounting", path: "/75-inch-tv-mounting" }]),
    faqSchema(FAQS),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-6 pt-6">
          <SeoBreadcrumb trail={[{ label: "75-Inch TV Mounting" }]} />
        </div>
      </div>

      <SeoHero
        eyebrow={<Eyebrow>75 inches · always two technicians</Eyebrow>}
        title="75-Inch TV Mounting"
        accent="in Nashville, TN"
        lead={size.lead}
        body="Two technicians on every job, studs located and confirmed, the height decided from your sofa rather than a tape measure. Across Nashville, Murfreesboro, Mount Juliet and the rest of Middle Tennessee."
        facts={[
          { label: "Mounting from", value: PRICES.over55 },
          { label: "Two TVs from",  value: PRICES.twoOver55 },
          { label: "Crew",          value: "2 technicians" },
        ]}
      />

      {/* THE THRESHOLD */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">
            75 Inches Is the Threshold Where the Job Changes
          </h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl">
            <p>
              Somewhere between 65 and 75 inches, mounting a television stops being a task and becomes
              a question about your house. Almost everything that makes a large install go wrong shows
              up for the first time at this size.
            </p>
            <p>
              Start with the obvious one. {size.weightTalk}, and more importantly the panel is wider
              than one person can span. {size.crew} We are specific about this because it is the
              point people most want to negotiate, and it is the one we will not: there is no
              single-technician version of a 75-inch install that we are willing to send.
            </p>
            <p>
              Then the wall. {size.studs} On an older Nashville home you may also be dealing with
              plaster over lath, or a masonry chimney breast, or the metal-stud partitions common in
              condo conversions. Those all hold a 75-inch TV perfectly well with the correct hardware,
              and they all need different hardware. The surcharge for concrete, tile, stone or metal
              starts at $25; drywall carries no extra charge.
            </p>
            <p>
              Then height, which is the one people underestimate. {size.height}
            </p>
            <p>
              And then the fireplace question. {size.fireplace} We would rather have that conversation
              with a tape measure in the room than talk you into something over the phone. Our{" "}
              <Link href="/tv-mounting-over-fireplace-nashville" className="text-[#E50914] font-semibold hover:underline">
                over-fireplace mounting page
              </Link>{" "}
              explains the heat-clearance check we run.
            </p>
            <p>
              One more thing specific to this size: 75 inches is where the cheapest big screens live.
              The onn. 75-inch, the Insignia F50, the Hisense R6 — these put an enormous panel in the
              room for very little money, which is genuinely good. It also means 75-inch sets are the
              ones we most often find badly mounted by somebody else. A bargain TV falling off a wall
              takes the drywall and the furniture underneath with it, and the panel was never the
              expensive part of that.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT CHANGES */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">What a 75-Inch Install Needs</h2>
          <SizeFactsGrid
            items={[
              { title: "Studs", desc: size.studs },
              { title: "Crew", desc: size.crew },
              { title: "Recommended height", desc: size.height },
              { title: "Over a fireplace", desc: size.fireplace },
              {
                title: "Brackets",
                desc: "A full-motion arm is still possible at 75 inches but it is a real trade-off: the arm adds depth, adds leverage on the anchors, and needs solid timber behind it. If you only want the TV flat against the wall, a slim fixed mount is the better answer. Tell us which you want before we choose.",
              },
              {
                title: "Cables",
                desc: `Concealment starts ${PRICES.cables.toLowerCase()}. At this size there is usually a console underneath with a soundbar and a console on it, so there is more to route than on a small TV — worth doing in the same visit rather than twice.`,
              },
            ]}
          />
        </div>
      </section>

      {/* MODELS */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Popular 75-Inch Models We Mount</h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            The 75-inch sets we see most in Middle Tennessee, from flagship Mini-LED panels to the
            budget big screens. Model names link to a step-by-step guide where we have written one.
          </p>

          <SizeModelTable rows={rows} />

          <p className="mt-4 text-xs text-black/45 leading-relaxed max-w-2xl">
            Samsung The Frame at 75 inches is quoted individually rather than at the rates above —
            see the{" "}
            <Link href="/samsung-frame-tv-installation-nashville" className="text-[#E50914] font-semibold hover:underline">
              Frame TV installation page
            </Link>.
          </p>

          <div className="mt-8">
            <PriceDisclaimer className="max-w-3xl" />
          </div>
        </div>
      </section>

      <FaqAccordion heading="75-Inch TV Mounting — Common Questions" faqs={FAQS} />

      <RelatedLinks
        heading="By Brand and by Size"
        intro="Six of our ten step-by-step guides are for 75-inch sets, because this is the size people most want to understand before booking."
        links={[
          { kicker: "Brand", href: "/samsung-tv-mounting", title: "Samsung TV Mounting", desc: "U8000H, U8000F and the QN80 QLED at 75 inches." },
          { kicker: "Brand", href: "/hisense-tv-mounting", title: "Hisense TV Mounting", desc: "U7, U65 Pro and the R6 Roku TV." },
          { kicker: "Brand", href: "/tcl-tv-mounting", title: "TCL TV Mounting", desc: "The QM7K and its QD-Mini LED depth." },
          { kicker: "Brand", href: "/lg-tv-mounting", title: "LG TV Mounting", desc: "QNED 75B and the NU700B." },
          { kicker: "Size guide", href: "/65-inch-tv-mounting", title: "65-Inch TV Mounting", desc: "The size that usually goes exactly where you wanted it." },
          { kicker: "Size guide", href: "/85-inch-tv-mounting", title: "85-Inch TV Mounting", desc: "Where the wall, not the TV, decides what is possible." },
        ]}
      />

      <CityLinkBand intro="75-inch installs across Nashville and every surrounding city below. Two technicians, wherever you are." />

      <SeoCta
        heading="Book Your 75-Inch Installation"
        sub="Send us the model, the wall type and your ZIP. We will confirm the bracket, the height and the price before we schedule."
        footLinks={[
          { label: "65-Inch", href: "/65-inch-tv-mounting" },
          { label: "85-Inch", href: "/85-inch-tv-mounting" },
          { label: "Pricing", href: "/pricing" },
          { label: "Quick Quote", href: "/quick-quote" },
        ]}
      />

      <AffiliationFootnote />
      <StickyActionBar />
    </>
  )
}
