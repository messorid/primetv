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

const SIZE = 85
const URL = `${BASE}/85-inch-tv-mounting`

export const metadata = {
  title: "85-Inch TV Mounting in Nashville, TN | PrimeTvNashville",
  description:
    "85-inch TV mounting in Nashville TN from $140 per TV. Two technicians, studs confirmed, honest advice on whether your wall can take it. Book a visit today.",
  keywords: [
    "85 inch TV mounting Nashville",
    "mount 85 inch TV Nashville TN",
    "85 inch TV installation near me",
    "85 inch TV wall mount studs",
    "can drywall hold an 85 inch TV",
  ],
  openGraph: {
    title: "85-Inch TV Mounting in Nashville, TN | PrimeTvNashville",
    description:
      "Professional 85-inch TV wall mounting across Nashville and Middle Tennessee. Two technicians and a proper stud check on every job.",
    url: URL,
    siteName: "PrimeTvNashville",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "85 inch TV wall mounting in Nashville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: URL },
}

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 }

const FAQS = [
  {
    q: "How much does it cost to mount an 85-inch TV in Nashville?",
    a: `Mounting starts ${PRICES.over55.toLowerCase()} for anything over 55 inches, and an 85-inch set is at the top of that band, so expect the final figure to sit above the starting price. Two sets over 55 inches at the same address in one visit start ${PRICES.twoOver55.toLowerCase()}. The wall type, the difficulty and the bracket all move the number, and a sales representative confirms it before any work begins.`,
  },
  {
    q: "Can drywall hold an 85-inch TV, and how many studs does it need?",
    a: "Drywall on its own cannot — not with anchors, not with toggles, not with anything sold as heavy-duty. What holds an 85-inch panel is the timber behind the drywall, and the bracket has to be lagged into it. That means two confirmed studs at absolute minimum, with a third wherever the framing allows. Confirmed means found and verified, not located with a magnet and hoped for — at this size we will occasionally open a small inspection point rather than guess, because the cost of being wrong is a wall repair and a destroyed television. Done properly, an ordinary drywall wall in a Nashville home holds this size without any trouble.",
  },
  {
    q: "What is the right height for an 85-inch TV?",
    a: "Lower than you think, and usually lower than the formula suggests. Centre-of-screen at seated eye level is the general rule, but an 85-inch screen is tall enough that obeying it can put the bottom edge below the media console in front of it. In practice the honest answer is the lowest height your furniture allows. We sit down in your room and decide from there rather than working to a number.",
  },
  {
    q: "Can you mount an 85-inch TV above a fireplace?",
    a: `Often we will advise against it, and we would rather say that before you book than after we arrive. Above a typical mantel an 85-inch screen either sits inside the heat plume from the firebox or sits so high that the viewing angle spoils the room. Over-fireplace handling starts ${PRICES.fireplace.toLowerCase()} where it is workable. Where it is not, we will suggest a different wall — it is a better outcome than a correctly installed TV you never enjoy watching.`,
  },
  {
    q: "Do you need two technicians for an 85-inch TV?",
    a: "Always, without exception. An 85-inch panel typically weighs 90 lbs or more and is far wider than one person's reach. There is no version of this install that one technician should attempt and we will not send one, regardless of what the job is quoted at.",
  },
  {
    q: "Which 85-inch TVs do you mount?",
    a: "All of them — the Samsung U8000F and R85H Micro RGB, Hisense U7 and U65 Pro, the TCL QM5K, QM6K and QM9K, the LG NU700B and the Insignia F50, among others. The table on this page lists what we see most. If yours is not there, send us the model code from the sticker on the back of the panel.",
  },
]

export default function Size85Page() {
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
      name: "85-Inch TV Mounting in Nashville, TN",
      description:
        "Professional two-technician wall mounting and installation of 85-inch televisions from every major brand across Nashville and Middle Tennessee.",
      serviceType: "85-Inch TV Mounting",
      url: URL,
    }),
    breadcrumbSchema([{ name: "85-Inch TV Mounting", path: "/85-inch-tv-mounting" }]),
    faqSchema(FAQS),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-6 pt-6">
          <SeoBreadcrumb trail={[{ label: "85-Inch TV Mounting" }]} />
        </div>
      </div>

      <SeoHero
        eyebrow={<Eyebrow>85 inches · two technicians, always</Eyebrow>}
        title="85-Inch TV Mounting"
        accent="in Nashville, TN"
        lead={size.lead}
        body="Two technicians, studs found and confirmed before anything is drilled, and a straight answer about whether the wall you have in mind is the right one. Across Nashville, Brentwood, Franklin, Hendersonville and beyond."
        facts={[
          { label: "Mounting from", value: PRICES.over55 },
          { label: "Typical weight", value: "90+ lbs" },
          { label: "Crew",          value: "2 technicians" },
        ]}
      />

      {/* THE WALL DECIDES */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">
            At 85 Inches, the Wall Is the Project
          </h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl">
            <p>
              Every other size we mount is a question about the television. This one is a question
              about your house. {size.weightTalk}, and that weight hangs on whatever is behind the
              drywall for as long as you own the TV.
            </p>
            <p>
              So the first real task on an 85-inch install is not the panel, it is the framing.{" "}
              {size.studs} We are blunt about this because the failure mode is genuinely bad. A mount
              that was anchored into drywall rather than timber does not fail gently or immediately.
              It holds for months, then lets go, and it takes a section of wall, a very large piece of
              glass and frequently the console underneath with it. We get called out to re-anchor
              other people&rsquo;s work at this size more than at any other.
            </p>
            <p>
              {size.crew}
            </p>
            <p>
              <strong>Height is where we will disagree with the internet.</strong> {size.height} The
              standard advice — centre of screen at seated eye level, 42 to 48 inches off the floor —
              was written for smaller televisions. Apply it literally to an 85-inch screen and the
              bottom edge can end up behind your media console. The rule still points the right way;
              it just stops being arithmetic and becomes a judgement made from the sofa.
            </p>
            <p>
              <strong>And the fireplace.</strong> {size.fireplace} This is the advice customers least
              want and most often thank us for later. A screen this large above a mantel is usually
              either too hot or too high, and sometimes both. We bring a tape measure and we tell you
              what we find. If a different wall is the right answer, we would rather lose the upsell
              than mount something you end up resenting.
            </p>
            <p>
              The last thing worth saying is about price. Sets like the{" "}
              <strong>Insignia F50</strong> and the <strong>TCL QM5K</strong> have made 85 inches
              genuinely affordable, and that is a good thing. But the install is not cheaper because
              the TV was. The wall work, the crew and the bracket are identical whether the panel cost
              six hundred dollars or four thousand.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT CHANGES */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">What an 85-Inch Install Needs</h2>
          <SizeFactsGrid
            items={[
              { title: "Studs", desc: size.studs },
              { title: "Crew", desc: size.crew },
              { title: "Recommended height", desc: size.height },
              { title: "Over a fireplace", desc: size.fireplace },
              {
                title: "Brackets",
                desc: "A heavy-duty bracket rated for the panel, lagged into timber. Full-motion arms exist at this size but they multiply the leverage on the anchors and we only fit one where the framing genuinely supports it. If you want the screen to move, tell us early — it changes the wall requirement, not just the hardware.",
              },
              {
                title: "Cables",
                desc: `Concealment starts ${PRICES.cables.toLowerCase()}. At 85 inches there is usually a soundbar, a console and a streaming box to route, and a bundle of visible cables under a screen this size is very hard to ignore.`,
              },
            ]}
          />
        </div>
      </section>

      {/* MODELS */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Popular 85-Inch Models We Mount</h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            The 85-inch sets we see most in Middle Tennessee, from budget big screens to premium
            flagships. Model names link to a step-by-step guide where we have written one.
          </p>

          <SizeModelTable rows={rows} />

          <p className="mt-4 text-xs text-black/45 leading-relaxed max-w-2xl">
            Samsung The Frame at 85 inches is quoted individually rather than at the rates above —
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


      <PhotoStrip
        heading="Large-Format Installs We Have Done"
        intro="Slat walls, stacked stone and stone feature walls — the kind of wall an 85-inch panel needs, and the anchors that go with it."
        photos={photoSet("slatWallCeilingMount", "fireplaceStackedStone", "fireplaceStoneFeature")}
      />

      <FaqAccordion heading="85-Inch TV Mounting — Common Questions" faqs={FAQS} />

      <RelatedLinks
        heading="By Brand and by Size"
        intro="Every brand below sells at 85 inches. The install is the same shape; the panel and the bracket class change."
        links={[
          { kicker: "Brand", href: "/samsung-tv-mounting", title: "Samsung TV Mounting", desc: "U8000F, QN80 QLED and the R85H Micro RGB." },
          { kicker: "Brand", href: "/hisense-tv-mounting", title: "Hisense TV Mounting", desc: "U7 and U65 Pro at their largest size." },
          { kicker: "Brand", href: "/tcl-tv-mounting", title: "TCL TV Mounting", desc: "QM5K, QM6K and the QM9K flagship." },
          { kicker: "Brand", href: "/lg-tv-mounting", title: "LG TV Mounting", desc: "The NU700B at 85 inches." },
          { kicker: "Guide", href: "/blog/how-to-mount-tcl-qm5k-85-inch", title: "How to Mount an 85-Inch TCL QM5K", desc: "Our heaviest routine install, step by step." },
          { kicker: "Size guide", href: "/75-inch-tv-mounting", title: "75-Inch TV Mounting", desc: "Ten inches smaller and a noticeably easier job." },
        ]}
      />

      <CityLinkBand intro="85-inch installs across Nashville and every surrounding city below. Two technicians on every one." />

      <SeoCta
        heading="Thinking About an 85-Inch on the Wall?"
        sub="Send us the model, the wall type and your ZIP. We will tell you honestly what that wall can take before we quote."
        footLinks={[
          { label: "65-Inch", href: "/65-inch-tv-mounting" },
          { label: "75-Inch", href: "/75-inch-tv-mounting" },
          { label: "Over Fireplace", href: "/tv-mounting-over-fireplace-nashville" },
          { label: "Pricing", href: "/pricing" },
        ]}
      />

      <AffiliationFootnote />
      <StickyActionBar />
    </>
  )
}
