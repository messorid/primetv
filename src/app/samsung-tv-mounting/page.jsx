import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import PriceDisclaimer from "../components/PriceDisclaimer"
import {
  SeoBreadcrumb, SeoHero, Eyebrow, FaqAccordion, CityLinkBand,
  RelatedLinks, SeoCta, AffiliationFootnote, PhotoStrip, SeriesCard,
} from "../components/TvSeoLayout"
import { serviceSchema, faqSchema, breadcrumbSchema, JsonLd } from "../lib/tvSeoSchema"
import {
  BASE, PRICES, seriesForBrand, codeFor, guideFor, getBrand,
} from "../lib/tvModels"
import { photoSet } from "../lib/photos"

const URL = `${BASE}/samsung-tv-mounting`

export const metadata = {
  title: "Samsung TV Mounting in Nashville, TN | PrimeTvNashville",
  description:
    "Samsung TV mounting in Nashville TN. Crystal UHD U8000H, U8000F, QN80 QLED, S90F OLED and The Frame mounted level and secure. From $110 per TV.",
  keywords: [
    "Samsung TV mounting Nashville",
    "Samsung TV installation Nashville TN",
    "Samsung U8000H wall mount",
    "Samsung QLED mounting Nashville",
    "Samsung Frame TV installer Nashville",
    "mount Samsung 75 inch TV",
  ],
  openGraph: {
    title: "Samsung TV Mounting in Nashville, TN | PrimeTvNashville",
    description:
      "Professional Samsung TV wall mounting across Nashville and Middle Tennessee. Crystal UHD, QLED, OLED and The Frame.",
    url: URL,
    siteName: "PrimeTvNashville",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "Samsung TV wall mounting in Nashville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: URL },
}

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 }

const FAQS = [
  {
    q: "How much does it cost to mount a Samsung TV in Nashville?",
    a: `Samsung TVs up to 55 inches start ${PRICES.upTo55.toLowerCase()} and larger sets start ${PRICES.over55.toLowerCase()}. Those are starting prices — the final figure depends on the difficulty of the job, the wall you are mounting on and the bracket being installed. The Frame is the exception and is quoted individually. One of our sales representatives confirms your price before any work begins.`,
  },
  {
    q: "Do you supply the wall mount for my Samsung TV?",
    a: "No, and we are upfront about it: we do not sell mounts. What we will do is tell you which class of bracket fits the set you bought before you order one, so you are not returning a bracket that cannot reach your studs. If you already have a mount, we will check it against your TV and your wall when we arrive.",
  },
  {
    q: "Can you mount a Samsung TV above my fireplace?",
    a: `Yes, and it is one of the most common requests we get in Nashville. Over-fireplace handling starts ${PRICES.fireplace.toLowerCase()} on top of the mounting price. We check heat clearance above the firebox before committing to a height, and on a 75 or 85-inch panel we sometimes find there is not enough wall to clear the heat and still keep a watchable angle. When that happens we say so rather than mounting it anyway. There is more detail on our `,
    link: { label: "TV over fireplace page", href: "/tv-mounting-over-fireplace-nashville" },
  },
  {
    q: "Is The Frame mounted differently from a normal Samsung TV?",
    a: "Completely. The Frame uses its own no-gap bracket so it sits flush like a picture, and it has an external One Connect box that has to be given a home somewhere out of sight. The finished result only looks right if the cable is hidden too, so it is a different job with a different price. We quote it individually.",
  },
  {
    q: "Do you hide the cables on a Samsung install?",
    a: `Cable concealment is an add-on starting ${PRICES.cables.toLowerCase()}. We either route the cables inside the wall for a completely invisible finish or run a painted surface raceway where in-wall routing is not possible. On a thin Crystal UHD panel there is very little room behind the set, so if you want the TV close to the wall the cables have to go somewhere — this is worth deciding before we drill, not after.`,
  },
  {
    q: "What if my wall is brick, stone or concrete?",
    a: `We mount on all of them. The surcharge for concrete, tile, stone or metal starts ${PRICES.hardWall.replace("From $25 for", "at $25 for").toLowerCase()}, because those surfaces need different anchors and a slower, more careful approach. Drywall carries no extra charge.`,
  },
]

export default function SamsungTvMountingPage() {
  const brand  = getBrand("samsung")
  const series = seriesForBrand("samsung")

  const schema = [
    serviceSchema({
      name: "Samsung TV Mounting in Nashville, TN",
      description:
        "Professional wall mounting and installation of Samsung televisions, including Crystal UHD, QLED, OLED and The Frame, across Nashville and Middle Tennessee.",
      serviceType: "Samsung TV Mounting",
      url: URL,
    }),
    breadcrumbSchema([{ name: "Samsung TV Mounting", path: "/samsung-tv-mounting" }]),
    faqSchema(FAQS.map(f => ({ q: f.q, a: f.link ? `${f.a}${f.link.label}.` : f.a }))),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-6 pt-6">
          <SeoBreadcrumb trail={[{ label: "Samsung TV Mounting" }]} />
        </div>
      </div>

      <SeoHero
        eyebrow={<Eyebrow>Samsung · 9 series we mount</Eyebrow>}
        title="Samsung TV Mounting"
        accent="in Nashville, TN"
        lead={brand.angle}
        body="We mount Samsung panels every week across Nashville, Brentwood, Franklin and Murfreesboro — levelled, anchored into studs, cables managed, and tested on every input before we leave."
        facts={[
          { label: "Up to 55 inches", value: PRICES.upTo55 },
          { label: "Over 55 inches",  value: PRICES.over55 },
          { label: "Workmanship",     value: PRICES.warranty },
        ]}
      />

      {/* WHY SAMSUNG IS NOT ONE JOB */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">
            Three Very Different Installs Under One Badge
          </h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl">
            <p>
              People book a &ldquo;Samsung TV mount&rdquo; as though it were one thing. In practice a
              Crystal UHD U7900 and a Samsung Frame TV have almost nothing in common from an
              installer&rsquo;s point of view, and the difference shows up in the quote.
            </p>
            <p>
              The <strong>Crystal UHD line</strong> — the U8000H, U8000F and U7900 — is the bulk of
              what we hang. These are conventional LED panels. They go onto a standard fixed, tilt or
              full-motion bracket, they anchor into studs, and the whole job is about getting the
              height right for the room rather than working around the TV. The 65-inch sets are often
              a single-technician install. The 85-inch U8000F is not, ever.
            </p>
            <p>
              The <strong>QLED and OLED sets</strong> — QN80F, QN80H, S90F — tend to land on better
              walls. Stone features, above mantels, in rooms someone has just finished renovating.
              That changes the anchor, the amount of care, and usually the price. The S90F is an OLED,
              which means the panel flexes: it gets carried on edge by two people and never laid
              face-down on a sofa while somebody fetches the bracket.
            </p>
            <p>
              And then there is <strong>The Frame</strong>, which is a different service entirely.
              It has its own flush bracket, an external One Connect box that has to be hidden, and a
              single transparent cable that customers reasonably expect to disappear into the wall.
              None of that is covered by a standard mounting rate, which is why we quote it on its own.
              If that is what you have, start on our{" "}
              <Link href="/samsung-frame-tv-installation-nashville" className="text-[#E50914] font-semibold hover:underline">
                Samsung Frame TV installation page
              </Link>{" "}
              instead.
            </p>
            <p>
              Samsung also sells the <strong>M70H and M80H Smart Monitors</strong>, which are not
              really TVs but get mounted like small ones. We put those up in home offices and
              bedrooms fairly regularly. They are light enough that a solid anchor or a single stud
              will hold them, and the interesting part of the job is usually cable routing to a desk.
            </p>
          </div>
        </div>
      </section>

      {/* SERIES */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Samsung Series We Mount</h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            The sizes and model codes below are the ones we see most in Middle Tennessee homes. If
            yours is not listed, we almost certainly still mount it — send us the model number.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {series.map(s => {
              const guide = guideFor(s.id)
              return (
                <SeriesCard
                  key={s.id}
                  s={s}
                  code={codeFor(s, 75) || codeFor(s, 65) || codeFor(s, 85)}
                  guideHref={guide ? `/blog/${guide.slug}` : null}
                  sizesLabel={
                    s.sizes.length
                      ? s.sizes.map(n => `${n}"`).join(" · ")
                      : "Monitor sizes"
                  }
                />
              )
            })}
          </div>

          <div className="mt-8">
            <PriceDisclaimer className="max-w-3xl" />
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">
            What a Samsung Install Looks Like
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "Stud location before anything else",
                desc: "We find and confirm the studs, not guess at them. On the larger Crystal UHD sets the bracket has to be centred across two of them, and where they actually fall sometimes shifts the TV a few inches from where you imagined it. Better to know that before there is a hole in the wall.",
              },
              {
                title: "Height decided sitting down",
                desc: "We work out the height from your sofa, not from a tape measure against an empty wall. Centre of screen near seated eye level is the rule; on a 75 or 85-inch Samsung the furniture underneath often decides the rest.",
              },
              {
                title: "Bracket checked against the panel",
                desc: "Thin Samsung panels leave very little clearance behind them. We fit the arms to the TV and check the reach against your stud spacing before drilling, which is the step that prevents a bracket that technically fits but cannot be tightened.",
              },
              {
                title: "Two technicians on anything over 55 inches",
                desc: "A 75 or 85-inch Samsung is wider than one person's reach. Panels get damaged when somebody tries to support the weight and align the bracket at the same time, so we send two.",
              },
              {
                title: "Cables managed, concealed if you want",
                desc: `Every install ends with the cables tidied. If you want them gone entirely, in-wall concealment is an add-on starting ${PRICES.cables.toLowerCase()}.`,
              },
              {
                title: "Tested on every input",
                desc: "We power the TV up, cycle the inputs, confirm the soundbar or console you are using actually works through it, and clean up. You get a working TV, not a mounted one.",
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
        heading="Samsung Installs We Have Done"
        intro="A Frame TV in Art Mode on painted brick, an over-fireplace mount on a dark accent wall, and a large panel with a soundbar underneath. All our own work."
        photos={photoSet("frameArtMode", "fireplaceDarkWall", "soundbarSubwoofer")}
      />

      <FaqAccordion heading="Samsung TV Mounting — Common Questions" faqs={FAQS.map(f => ({
        q: f.q,
        a: f.link
          ? <>{f.a}<Link href={f.link.href} className="text-[#E50914] font-semibold hover:underline">{f.link.label}</Link>.</>
          : f.a,
      }))} />

      <RelatedLinks
        heading="Mounting a Samsung by Size"
        intro="The size of the panel changes the crew, the wall requirement and the height more than the brand does."
        links={[
          { kicker: "Size guide", href: "/65-inch-tv-mounting", title: "65-Inch TV Mounting", desc: "The U7900, U8000H and The Frame at the size most living rooms settle on." },
          { kicker: "Size guide", href: "/75-inch-tv-mounting", title: "75-Inch TV Mounting", desc: "U8000H, U8000F and QN80 — where a second technician stops being optional." },
          { kicker: "Size guide", href: "/85-inch-tv-mounting", title: "85-Inch TV Mounting", desc: "U8000F and the R85H Micro RGB, and what your wall has to be able to take." },
          { kicker: "Specialty", href: "/samsung-frame-tv-installation-nashville", title: "Samsung Frame TV Installation", desc: "No-gap mount, One Connect routing and Art Mode setup." },
          { kicker: "Specialty", href: "/oled-tv-mounting", title: "OLED TV Mounting", desc: "How we handle the S90F and other flexible OLED panels." },
          { kicker: "Add-on", href: "/cable-concealment-nashville", title: "Cable Concealment", desc: `In-wall routing or painted raceway, ${PRICES.cables.toLowerCase()}.` },
        ]}
      />

      <CityLinkBand intro="We mount Samsung TVs across Nashville and the surrounding cities. Pick your city for local pricing and availability." />

      <SeoCta
        heading="Ready to Get Your Samsung on the Wall?"
        sub="Send us the model number and your ZIP code. We will confirm the bracket, the price and the date."
        footLinks={[
          { label: "All Brands", href: "/hisense-tv-mounting" },
          { label: "TV Mounting Service", href: "/services/tv-mounting" },
          { label: "Pricing", href: "/pricing" },
          { label: "Get a Quick Quote", href: "/quick-quote" },
        ]}
      />

      <AffiliationFootnote />
      <StickyActionBar />
    </>
  )
}
