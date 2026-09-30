import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import PriceDisclaimer from "../components/PriceDisclaimer"
import {
  SeoBreadcrumb, SeoHero, Eyebrow, FaqAccordion, CityLinkBand,
  RelatedLinks, SeoCta, AffiliationFootnote, PhotoStrip, SeriesCard,
} from "../components/TvSeoLayout"
import { serviceSchema, faqSchema, breadcrumbSchema, JsonLd } from "../lib/tvSeoSchema"
import { BASE, PRICES, seriesForBrand, codeFor, guideFor, getBrand } from "../lib/tvModels"
import { photoSet } from "../lib/photos"

const URL = `${BASE}/lg-tv-mounting`

export const metadata = {
  title: "LG TV Mounting in Nashville, TN | PrimeTvNashville",
  description:
    "LG TV mounting in Nashville TN. OLED C6 and C5, QNED 75B, NU700B and UA7050 mounted by a crew that handles OLED panels properly. From $110 per TV.",
  keywords: [
    "LG TV mounting Nashville",
    "LG TV installation Nashville TN",
    "LG OLED wall mount Nashville",
    "LG C6 OLED installer",
    "LG QNED TV mounting",
    "mount LG 77 inch OLED",
  ],
  openGraph: {
    title: "LG TV Mounting in Nashville, TN | PrimeTvNashville",
    description:
      "Professional LG TV wall mounting across Nashville and Middle Tennessee. OLED, QNED and LED models handled correctly.",
    url: URL,
    siteName: "PrimeTvNashville",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "LG TV wall mounting in Nashville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: URL },
}

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 }

const FAQS = [
  {
    q: "How much does LG TV mounting cost in Nashville?",
    a: `Sets up to 55 inches start ${PRICES.upTo55.toLowerCase()}; larger sets start ${PRICES.over55.toLowerCase()}. An OLED is priced from the same starting point as any other panel of its size — we do not charge extra simply because it says OLED on the box. What moves the price is the wall, the difficulty and the bracket, and a sales representative confirms the figure before any work starts.`,
  },
  {
    q: "Is mounting an LG OLED riskier than a normal TV?",
    a: "It is less forgiving, which is not the same thing. An OLED panel is remarkably thin and it flexes, so it has to be carried on edge by two people and never laid flat on a sofa or a bed while somebody goes to find the bracket. Handled that way it is a perfectly routine install. Handled the way a heavy LED set can survive being handled, it is not.",
  },
  {
    q: "Should I buy a slim bracket for my LG C6?",
    a: "If the reason you bought a C-series is how little of it you see, then yes. A standard bracket will hold it safely but will push the panel further off the wall than the TV deserves. A flush or slim-profile mount keeps the finished look that you paid for. We will tell you which class to buy before you order — we do not sell mounts.",
  },
  {
    q: "Can you mount a 77-inch LG OLED above a fireplace?",
    a: `We will measure before we agree to it. Over-fireplace handling starts ${PRICES.fireplace.toLowerCase()}, but at 77 inches the constraint is usually the mantel rather than the TV: there has to be enough wall to clear the heat and still leave an angle you can watch from the sofa. Heat and OLED are not friends, so this is one we would rather talk you out of than rush.`,
  },
  {
    q: "Do you take the old TV down and mount the LG in the same visit?",
    a: "Yes. Tell us at booking so we allow the time. We also look at what is already in the wall rather than assuming it is reusable — an old bracket anchored into drywall alone, or into a single stud, comes out and goes back properly before a new panel goes anywhere near it.",
  },
  {
    q: "Do you hide the cables on an LG OLED install?",
    a: `Cable concealment is an add-on starting ${PRICES.cables.toLowerCase()}. It matters more on an OLED than on anything else we mount: the whole visual argument for the panel is that it nearly disappears, and a cable hanging down the wall undoes that instantly. In-wall routing gives the cleanest result; a painted surface raceway is the fallback where the wall will not allow it.`,
  },
]

export default function LgTvMountingPage() {
  const brand  = getBrand("lg")
  const series = seriesForBrand("lg")

  const schema = [
    serviceSchema({
      name: "LG TV Mounting in Nashville, TN",
      description:
        "Professional wall mounting and installation of LG televisions, including OLED C6 and C5, QNED and LED series, across Nashville and Middle Tennessee.",
      serviceType: "LG TV Mounting",
      url: URL,
    }),
    breadcrumbSchema([{ name: "LG TV Mounting", path: "/lg-tv-mounting" }]),
    faqSchema(FAQS),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-6 pt-6">
          <SeoBreadcrumb trail={[{ label: "LG TV Mounting" }]} />
        </div>
      </div>

      <SeoHero
        eyebrow={<Eyebrow>LG · OLED, QNED &amp; LED</Eyebrow>}
        title="LG TV Mounting"
        accent="in Nashville, TN"
        lead={brand.angle}
        body="We mount LG panels across Nashville, Brentwood, Gallatin and Lebanon — OLEDs carried on edge by two technicians, everything anchored into studs, every input tested before we leave."
        facts={[
          { label: "Up to 55 inches", value: PRICES.upTo55 },
          { label: "Over 55 inches",  value: PRICES.over55 },
          { label: "Workmanship",     value: PRICES.warranty },
        ]}
      />

      {/* TWO BRANDS IN ONE */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">
            LG Sells Two Kinds of TV, and We Treat Them Differently
          </h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl">
            <p>
              On one side of LG&rsquo;s range are the <strong>NU700B</strong> and{" "}
              <strong>UA7050</strong>: conventional LED panels, sensibly priced, that hang like any
              other television. Standard bracket, two studs, done. The NU700B at 85 inches is heavy
              because every 85-inch panel is heavy, but nothing about it needs special treatment
              beyond a second pair of hands.
            </p>
            <p>
              On the other side are the <strong>OLED C6 and C5</strong>, and those are a genuinely
              different object. An OLED panel is thin in a way that photographs badly and surprises
              people in person. It also flexes. That is not a defect — it is a consequence of there
              being no backlight behind it — but it dictates how the thing has to be handled.
            </p>
            <p>
              So we handle it accordingly. An OLED is carried <strong>on edge, by two people</strong>.
              It does not get laid face-down on a sofa while somebody fetches a tool. It does not get
              propped against a wall at an angle. The pressure that a 90 lb LED set shrugs off is the
              pressure that damages an OLED, and the damage is permanent. This is the single biggest
              difference between a professional OLED install and a weekend one, and it costs nothing
              extra — it is just knowing to do it.
            </p>
            <p>
              The second OLED-specific decision is the bracket. A C-series panel on a bulky
              full-motion arm looks wrong, and it is worth saying plainly: if you bought a C6 because
              of how close to the wall it sits, a standard mount will undo most of that. A flush or
              slim-profile bracket keeps the look. We will tell you which class to buy, though you
              will need to buy it — we do not sell mounts, we just make sure you order the right one.
            </p>
            <p>
              In between sits the <strong>QNED 75B</strong>. At 75 inches it is a two-technician job
              on weight alone, but it is a backlit panel, so it takes handling like an LED set rather
              than an OLED. It is the LG we mount most often in family rooms, and it is a
              straightforward install on a wall with decent studs.
            </p>
            <p>
              If you have an OLED specifically — LG or otherwise — our{" "}
              <Link href="/oled-tv-mounting" className="text-[#E50914] font-semibold hover:underline">
                OLED TV mounting page
              </Link>{" "}
              goes further into how we handle them.
            </p>
          </div>
        </div>
      </section>

      {/* SERIES */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">LG Series We Mount</h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            The LG sets we are called out to most in Middle Tennessee. If yours is not listed, send
            us the model code from the back of the panel — we mount the full range.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {series.map(s => {
              const guide = guideFor(s.id)
              return (
                <SeriesCard
                  key={s.id}
                  s={s}
                  code={codeFor(s, 65) || codeFor(s, 75) || codeFor(s, 77)}
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

      {/* PROCESS */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">How We Mount an LG</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "OLED panels carried on edge",
                desc: "Two technicians, panel vertical, never face-down and never propped at an angle. It is the one rule that separates an OLED install that ages well from one that does not, and it is free.",
              },
              {
                title: "Bracket matched to what you bought it for",
                desc: "We ask whether flush matters to you before we recommend a mount. On a C6 it usually does, and a slim-profile bracket is worth the small extra cost over a standard one.",
              },
              {
                title: "Studs confirmed before the first hole",
                desc: "Located and verified, with the bracket centred across two. On a 77-inch or 85-inch panel that is not a preference, it is what keeps the TV on the wall.",
              },
              {
                title: "Two technicians over 55 inches",
                desc: "On an LED set that is about weight. On an OLED it is about control — you cannot hold a flexing panel steady and align a bracket with the same pair of hands.",
              },
              {
                title: "Cables concealed where it matters most",
                desc: `An OLED with a visible cable loses the reason you bought it. In-wall concealment starts ${PRICES.cables.toLowerCase()}; a painted raceway is the fallback where the wall will not take it.`,
              },
              {
                title: "Every input tested before we go",
                desc: "Power up, cycle the inputs, confirm the soundbar and console work through the set, tidy the cables, break down the packaging. A working TV, not just a mounted one.",
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


      <PhotoStrip
        heading="LG-Class Installs We Have Done"
        intro="Flat to the wall, cables inside it, and nothing left hanging. This is the finish a C-series panel is worth."
        photos={photoSet("fireplaceDarkWall", "hiddenCablesDrywall", "hardwoodLivingRoom")}
      />

      <FaqAccordion heading="LG TV Mounting — Common Questions" faqs={FAQS} />

      <RelatedLinks
        heading="Mounting an LG by Size"
        intro="Weight and reach are decided by the size. Whether the panel flexes is decided by the technology."
        links={[
          { kicker: "Size guide", href: "/65-inch-tv-mounting", title: "65-Inch TV Mounting", desc: "The OLED C6 and UA7050 at the size most rooms are built for." },
          { kicker: "Size guide", href: "/75-inch-tv-mounting", title: "75-Inch TV Mounting", desc: "QNED 75B and NU700B — two technicians from here up." },
          { kicker: "Size guide", href: "/85-inch-tv-mounting", title: "85-Inch TV Mounting", desc: "The NU700B, and what the wall behind it has to be able to hold." },
          { kicker: "Specialty", href: "/oled-tv-mounting", title: "OLED TV Mounting", desc: "How a flexible panel is carried, braced and mounted." },
          { kicker: "Guide", href: "/blog/how-to-mount-lg-oled-c6-65-inch", title: "How to Mount a 65-Inch LG OLED C6", desc: "The slim-bracket decision and the handling rules." },
          { kicker: "Add-on", href: "/cable-concealment-nashville", title: "Cable Concealment", desc: `In-wall routing or painted raceway, ${PRICES.cables.toLowerCase()}.` },
        ]}
      />

      <CityLinkBand intro="LG and LG OLED installs across Nashville and every surrounding city below." />

      <SeoCta
        heading="OLED, QNED or LED — We Will Handle It Right"
        sub="Send us the model code and your ZIP and we will confirm the bracket class, the crew and the price."
        footLinks={[
          { label: "Samsung", href: "/samsung-tv-mounting" },
          { label: "Hisense", href: "/hisense-tv-mounting" },
          { label: "TCL", href: "/tcl-tv-mounting" },
          { label: "Pricing", href: "/pricing" },
        ]}
      />

      <AffiliationFootnote />
      <StickyActionBar />
    </>
  )
}
