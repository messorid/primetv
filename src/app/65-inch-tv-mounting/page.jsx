import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import PriceDisclaimer from "../components/PriceDisclaimer"
import {
  SeoBreadcrumb, SeoHero, Eyebrow, FaqAccordion, CityLinkBand,
  RelatedLinks, SeoCta, AffiliationFootnote, PhotoStrip, SizeModelTable, SizeFactsGrid,
} from "../components/TvSeoLayout"
import { serviceSchema, faqSchema, breadcrumbSchema, JsonLd } from "../lib/tvSeoSchema"
import { BASE, PRICES, seriesForSize, codeFor, guideFor, brandLabel, getSize } from "../lib/tvModels"
import { photoSet } from "../lib/photos"

const SIZE = 65
const URL = `${BASE}/65-inch-tv-mounting`

export const metadata = {
  title: "65-Inch TV Mounting in Nashville, TN | PrimeTvNashville",
  description:
    "65-inch TV mounting in Nashville TN from $140 per TV. Samsung, Hisense, TCL and LG 65 inch models mounted into studs at the right height. Same-day available.",
  keywords: [
    "65 inch TV mounting Nashville",
    "mount 65 inch TV Nashville TN",
    "65 inch TV installation near me",
    "65 inch TV wall mount height",
    "65 inch TV over fireplace Nashville",
  ],
  openGraph: {
    title: "65-Inch TV Mounting in Nashville, TN | PrimeTvNashville",
    description:
      "Professional 65-inch TV wall mounting across Nashville and Middle Tennessee. Every major brand, mounted at the right height.",
    url: URL,
    siteName: "PrimeTvNashville",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "65 inch TV wall mounting in Nashville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: URL },
}

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 }

const FAQS = [
  {
    q: "How much does it cost to mount a 65-inch TV in Nashville?",
    a: `A 65-inch TV falls into our over-55-inch bracket, so mounting starts ${PRICES.over55.toLowerCase()}. If you are having two done in the same visit at the same address, the promotional rate for two sets over 55 inches starts ${PRICES.twoOver55.toLowerCase()}. All of these are starting prices — the difficulty, the wall type and the bracket decide the final number, and a sales representative confirms it before any work begins.`,
  },
  {
    q: "What height should a 65-inch TV be mounted at?",
    a: "Centre of the screen at seated eye level, which for most sofas lands somewhere between 42 and 48 inches off the floor. A 65-inch screen is short enough that this works in nearly any room with an 8-foot ceiling, which is exactly why 65 inches is the size that most often ends up exactly where the customer pictured it. We set the final height sitting on your actual furniture, not from a tape measure against a bare wall.",
  },
  {
    q: "Does a 65-inch TV need two studs?",
    a: "Two is the target, and a 65-inch bracket usually spans a standard 16-inch stud spacing comfortably enough to get them. That is the quiet advantage of this size: the mount can almost always be centred where you want the TV rather than shifted a few inches to chase timber. We locate and confirm the studs before drilling rather than trusting a magnet.",
  },
  {
    q: "Can one technician mount a 65-inch TV?",
    a: "On drywall, usually yes — a 65-inch panel typically runs in the 40 to 60 lb range and is within one person's reach. We send two when the wall is masonry, when the mount is going above a fireplace, or when the panel is an OLED, because an OLED flexes and needs a second pair of hands regardless of what it weighs.",
  },
  {
    q: "Is 65 inches a good size to mount above a fireplace?",
    a: `It is the most forgiving size for it. There is usually enough wall left above a typical Nashville mantel to keep the screen clear of the heat plume and still land at an angle you can watch without complaint — something that stops being true at 75 and 85 inches. Over-fireplace handling starts ${PRICES.fireplace.toLowerCase()}, and we check the heat clearance before committing to a height.`,
  },
  {
    q: "Which 65-inch TVs do you mount?",
    a: "All of them. The models in the table on this page are the ones we see most in Middle Tennessee homes — Samsung Crystal UHD and The Frame, the Hisense U-series, TCL QM6K and Q6LR, LG OLED C6, plus Insignia, Roku and Toshiba sets. If yours is not listed, send us the model code from the sticker on the back.",
  },
]

export default function Size65Page() {
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
      name: "65-Inch TV Mounting in Nashville, TN",
      description:
        "Professional wall mounting and installation of 65-inch televisions from every major brand across Nashville and Middle Tennessee.",
      serviceType: "65-Inch TV Mounting",
      url: URL,
    }),
    breadcrumbSchema([{ name: "65-Inch TV Mounting", path: "/65-inch-tv-mounting" }]),
    faqSchema(FAQS),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-6 pt-6">
          <SeoBreadcrumb trail={[{ label: "65-Inch TV Mounting" }]} />
        </div>
      </div>

      <SeoHero
        eyebrow={<Eyebrow>65 inches · {series.length} models we mount</Eyebrow>}
        title="65-Inch TV Mounting"
        accent="in Nashville, TN"
        lead={size.lead}
        body="Levelled, anchored into studs, set at the height that suits your sofa rather than the wall, and tested on every input before we leave. Across Nashville, Brentwood, Franklin and the rest of Middle Tennessee."
        facts={[
          { label: "Mounting from",  value: PRICES.over55 },
          { label: "Two TVs from",   value: PRICES.twoOver55 },
          { label: "Workmanship",    value: PRICES.warranty },
        ]}
      />

      {/* WHY 65 IS THE EASY ONE */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">
            Why 65 Inches Usually Goes Exactly Where You Wanted It
          </h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl">
            <p>
              Of the three big sizes we mount, 65 inches is the one that most often ends up in the
              precise spot the customer imagined. That is not luck. It comes down to the relationship
              between the width of the bracket and the spacing of the timber inside your wall.
            </p>
            <p>
              Residential framing in Nashville is typically on 16-inch centres. A 65-inch mount is
              wide enough to reach across two of those studs from most starting positions, which means
              we can usually centre the bracket where you want the screen instead of sliding it four
              inches left to catch something solid. On a 75 or 85-inch panel the bracket has more
              reach but the stakes are higher, and on smaller TVs the bracket often cannot span two
              studs at all. Sixty-five inches sits in the sweet spot.
            </p>
            <p>
              Weight helps too. {size.weightTalk}, which is inside what one experienced technician can
              control on a drywall install. {size.crew}
            </p>
            <p>
              <strong>Height is where most 65-inch installs go wrong</strong>, and it is the easiest
              thing to get right. {size.height} The mistake is mounting from a measurement taken
              against an empty wall, before the sofa is where it will actually live. We do it the
              other way round: furniture in place, someone sitting down, mark the wall from there.
              Our guide on the{" "}
              <Link href="/blog/best-height-to-mount-65-inch-tv" className="text-[#E50914] font-semibold hover:underline">
                best height to mount a 65-inch TV
              </Link>{" "}
              walks through the arithmetic if you want to check our working.
            </p>
            <p>
              <strong>Above a fireplace</strong>, 65 inches is the size that actually works.{" "}
              {size.fireplace} By 75 inches that headroom has usually gone. If a mantel install is
              what you are planning, this is the size to be planning it with.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT CHANGES */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">What a 65-Inch Install Needs</h2>
          <SizeFactsGrid
            items={[
              { title: "Studs", desc: size.studs },
              { title: "Crew", desc: size.crew },
              { title: "Recommended height", desc: size.height },
              { title: "Over a fireplace", desc: size.fireplace },
              {
                title: "Brackets",
                desc: "Fixed, tilt and full-motion all work at this size, and a 65-inch panel is light enough that a full-motion arm is a genuinely practical choice if you need to angle the picture into a kitchen or around a corner. We do not sell mounts, but we will tell you which class to buy before you order.",
              },
              {
                title: "Cables",
                desc: `Concealment starts ${PRICES.cables.toLowerCase()}. In-wall routing for an invisible finish, or a paintable surface raceway where the wall will not take it. Decide before we drill — it is a different hole.`,
              },
            ]}
          />
        </div>
      </section>

      {/* MODELS */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Popular 65-Inch Models We Mount</h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            The 65-inch sets we are called out to most often in Middle Tennessee. Model names link to
            a step-by-step guide where we have written one.
          </p>

          <SizeModelTable rows={rows} />

          <p className="mt-4 text-xs text-black/45 leading-relaxed max-w-2xl">
            Samsung The Frame is quoted individually rather than at the rates above — see the{" "}
            <Link href="/samsung-frame-tv-installation-nashville" className="text-[#E50914] font-semibold hover:underline">
              Frame TV installation page
            </Link>.
          </p>

          <div className="mt-8">
            <PriceDisclaimer className="max-w-3xl" />
          </div>
        </div>
      </section>


      <PhotoStrip
        heading="65-Inch Installs We Have Done"
        intro="The size that usually lands exactly where the customer wanted it — above a mantel, between built-ins, or on a plain wall."
        photos={photoSet("smallRoom", "fireplaceShiplap", "builtInShelves")}
      />

      <FaqAccordion heading="65-Inch TV Mounting — Common Questions" faqs={FAQS} />

      <RelatedLinks
        heading="By Brand and by Size"
        intro="Already know the brand? Start there. Comparing sizes? The 75 and 85-inch pages cover what changes."
        links={[
          { kicker: "Brand", href: "/samsung-tv-mounting", title: "Samsung TV Mounting", desc: "Crystal UHD U8000H and U7900, S90F OLED and The Frame." },
          { kicker: "Brand", href: "/hisense-tv-mounting", title: "Hisense TV Mounting", desc: "U7, U6, E6SR and E7 at 65 inches." },
          { kicker: "Brand", href: "/tcl-tv-mounting", title: "TCL TV Mounting", desc: "QM6K, Q6LR and F7D — the quickest installs in the range." },
          { kicker: "Brand", href: "/lg-tv-mounting", title: "LG TV Mounting", desc: "OLED C6 and the UA7050." },
          { kicker: "Size guide", href: "/75-inch-tv-mounting", title: "75-Inch TV Mounting", desc: "Ten inches bigger and a genuinely different appointment." },
          { kicker: "Size guide", href: "/85-inch-tv-mounting", title: "85-Inch TV Mounting", desc: "Where the wall, not the TV, decides what is possible." },
        ]}
      />

      <CityLinkBand intro="65-inch installs across Nashville and every surrounding city below. Pick yours for local availability." />

      <SeoCta
        heading="Book Your 65-Inch Installation"
        sub="Tell us the model, the wall and your ZIP code. We will confirm the bracket class, the height and the price."
        footLinks={[
          { label: "All Sizes", href: "/75-inch-tv-mounting" },
          { label: "Pricing", href: "/pricing" },
          { label: "Over Fireplace", href: "/tv-mounting-over-fireplace-nashville" },
          { label: "Quick Quote", href: "/quick-quote" },
        ]}
      />

      <AffiliationFootnote />
      <StickyActionBar />
    </>
  )
}
