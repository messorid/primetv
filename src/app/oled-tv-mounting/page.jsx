import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import PriceDisclaimer from "../components/PriceDisclaimer"
import {
  SeoBreadcrumb, SeoHero, Eyebrow, FaqAccordion, CityLinkBand,
  RelatedLinks, SeoCta, AffiliationFootnote, SizeModelTable,
} from "../components/TvSeoLayout"
import { serviceSchema, faqSchema, breadcrumbSchema, JsonLd } from "../lib/tvSeoSchema"
import { BASE, PRICES, SERIES, codeFor, guideFor, brandLabel } from "../lib/tvModels"

const URL = `${BASE}/oled-tv-mounting`

export const metadata = {
  title: "OLED TV Mounting in Nashville, TN | PrimeTvNashville",
  description:
    "OLED TV mounting in Nashville TN. LG C6 and C5 and Samsung S90F panels carried on edge by two technicians and mounted flush. Starting from $140 per TV.",
  keywords: [
    "OLED TV mounting Nashville",
    "OLED TV installation Nashville TN",
    "LG OLED C6 wall mount",
    "LG C5 77 inch installer",
    "Samsung S90F OLED mounting",
    "flush mount OLED TV",
  ],
  openGraph: {
    title: "OLED TV Mounting in Nashville, TN | PrimeTvNashville",
    description:
      "Professional OLED TV wall mounting across Nashville and Middle Tennessee. LG C6, C5 and Samsung S90F handled the way a flexible panel has to be.",
    url: URL,
    siteName: "PrimeTvNashville",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "OLED TV wall mounting in Nashville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: URL },
}

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 }

const FAQS = [
  {
    q: "Do you charge more to mount an OLED TV?",
    a: `No. An OLED starts from the same rate as any other panel its size — ${PRICES.over55.toLowerCase()} for anything over 55 inches. What we do differently costs nothing: two technicians instead of one, the panel carried vertically, and a slower pace at the moment it goes onto the bracket. As always the final figure depends on the wall, the difficulty and the bracket, and a sales representative confirms it first.`,
  },
  {
    q: "Why does an OLED need two people when a heavier LED TV does not?",
    a: "Because the risk is not weight, it is flex. An OLED panel has no backlight behind it, so it is extraordinarily thin and it bends under its own weight if it is held wrongly. One person holding an OLED and reaching to align a bracket is putting a twisting load through the middle of the screen. Two people keep it flat and vertical. A heavy LED set is stiff enough to forgive the same handling; an OLED is not.",
  },
  {
    q: "Can an OLED TV be laid flat while you work?",
    a: "No, and this is the rule we are least flexible about. An OLED never goes face-down on a sofa, a bed or a carpet, and it never gets propped at an angle against a wall. It stays vertical, on its edge, supported at both ends, from the moment it leaves the box until it is on the bracket. Damage from bad handling is permanent and it is not covered by anybody's warranty.",
  },
  {
    q: "Should I buy a slim or flush mount for my OLED?",
    a: "If the reason you chose an OLED is how close to the wall it sits, then yes — a standard bracket holds it perfectly safely but pushes it out far enough to lose the effect you paid for. A slim-profile or flush mount preserves it. We do not sell mounts, so there is nothing in this for us; send us the model before you order and we will tell you which class to buy.",
  },
  {
    q: "Can you mount an OLED above a fireplace?",
    a: `We will measure first and we may well advise against it. Heat is harder on an OLED than on a backlit panel, and above a working firebox there has to be genuine clearance. Over-fireplace handling starts ${PRICES.fireplace.toLowerCase()} where the geometry works. On a 77-inch C5 above a typical Nashville mantel it frequently does not, and we would rather point you at a different wall than install something that cooks slowly for years.`,
  },
  {
    q: "Do you hide the cables on an OLED install?",
    a: `Concealment starts ${PRICES.cables.toLowerCase()} and it matters more here than on anything else we mount. The entire visual argument for an OLED is that the television nearly disappears into the wall, and a single cable hanging below it undoes that in one glance. In-wall routing gives the clean result; a painted surface raceway is the fallback where the wall cannot be opened.`,
  },
]

export default function OledTvMountingPage() {
  const oleds = SERIES.filter(s => s.panel === "OLED")

  const rows = oleds.flatMap(s =>
    s.sizes.map(size => {
      const guide = guideFor(s.id, size)
      return {
        id: `${s.id}-${size}`,
        brand: brandLabel(s),
        model: `${s.name} — ${size}"`,
        panel: "OLED",
        code: codeFor(s, size),
        href: guide ? `/blog/${guide.slug}` : null,
      }
    })
  )

  const schema = [
    serviceSchema({
      name: "OLED TV Mounting in Nashville, TN",
      description:
        "Professional wall mounting of OLED televisions, including the LG OLED C6 and C5 and the Samsung S90F, across Nashville and Middle Tennessee.",
      serviceType: "OLED TV Mounting",
      url: URL,
    }),
    breadcrumbSchema([{ name: "OLED TV Mounting", path: "/oled-tv-mounting" }]),
    faqSchema(FAQS),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-6 pt-6">
          <SeoBreadcrumb trail={[{ label: "OLED TV Mounting" }]} />
        </div>
      </div>

      <SeoHero
        eyebrow={<Eyebrow>OLED · LG C6, C5 &amp; Samsung S90F</Eyebrow>}
        title="OLED TV Mounting"
        accent="in Nashville, TN"
        lead="An OLED is the thinnest television you will ever own, and the only one where how it is carried matters as much as how it is anchored."
        body="We mount OLED panels across Nashville and Middle Tennessee: two technicians, carried on edge, never laid flat, and set on a bracket that keeps the panel as close to the wall as you bought it to be."
        facts={[
          { label: "Mounting from", value: PRICES.over55 },
          { label: "Crew",          value: "2 technicians" },
          { label: "Workmanship",   value: PRICES.warranty },
        ]}
      />

      {/* THE HANDLING PROBLEM */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">
            The Risk on an OLED Is Not Weight. It Is Flex.
          </h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl">
            <p>
              An 85-inch LED television is dangerous to mount because it is heavy. A 65-inch OLED is
              the opposite problem: it is comparatively light and it is dangerously easy to handle
              badly. These two facts need completely different installers, and most of what makes an
              OLED install go right happens before the drill comes out.
            </p>
            <p>
              An OLED panel has no backlight behind it. That is the whole reason the picture looks the
              way it does, and it is the reason the panel is thin enough to flex under its own weight.
              Pick one up by two corners and the middle bends. Lay it face-down on a sofa and the
              cushions push unevenly against the screen. Prop it at an angle against a wall while you
              go and find a socket set, and the weight concentrates along one edge.
            </p>
            <p>
              None of those things break an OLED reliably. That is exactly why they keep happening. An
              installer who has got away with it ten times has learned the wrong lesson, and when it
              does go wrong the damage is internal, permanent, visible on every bright scene for the
              rest of the television&rsquo;s life, and not covered by anyone&rsquo;s warranty.
            </p>
            <p>
              So our rules are simple and we do not bend them. The panel stays{" "}
              <strong>vertical, on its edge, supported at both ends, carried by two people</strong>,
              from the box to the bracket. It does not get laid down. It does not get leaned. The
              second technician is not there to share the weight — they are there so that nobody has
              to hold the screen with one hand and align a mount with the other.
            </p>
            <p>
              That is the part that costs nothing and matters most. We do not charge extra for an
              OLED.
            </p>
          </div>
        </div>
      </section>

      {/* THE BRACKET */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">
            The Bracket Decision People Get Wrong
          </h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl mb-10">
            <p>
              Here is the thing nobody mentions in the shop. You spend a premium on an OLED because it
              is startlingly thin, and then a standard wall bracket pushes it out far enough from the
              wall that it looks like any other television.
            </p>
            <p>
              A slim-profile or flush mount fixes this, and it is usually a modest difference in
              price. If a flat, almost-part-of-the-wall look is why you bought the panel, it is worth
              it. If you actually need the screen to swing out — into a kitchen, around a corner — then
              a full-motion arm is the right call and you accept the depth. What you should not do is
              buy a bulky arm by default and then wonder why the TV sticks out.
            </p>
            <p>
              We do not sell mounts, which means we have nothing to gain from steering you either way.
              Send us the model code before you order and we will tell you which class of bracket fits
              your panel and reaches your studs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "Carried on edge, by two",
                desc: "Vertical from the box to the bracket, supported at both ends. Never face-down, never leaned at an angle, never held by one person while the other lines up hardware.",
              },
              {
                title: "Bracket matched to the point of an OLED",
                desc: "Slim or flush where you want the panel tight to the wall; a full-motion arm only where you genuinely need the screen to move. We tell you which to buy — we do not sell them.",
              },
              {
                title: "Studs confirmed, not assumed",
                desc: "An OLED is lighter than an equivalent LED set but it still hangs off timber, not drywall. Located and verified, bracket centred across two studs.",
              },
              {
                title: "Heat treated as a real constraint",
                desc: "Above a fireplace we measure clearance before agreeing to the position. Heat is harder on an OLED than on a backlit panel, and we will recommend a different wall when the numbers say so.",
              },
              {
                title: "Cables concealed properly",
                desc: `A visible cable ruins the one thing an OLED does better than everything else. In-wall routing from ${PRICES.cables.toLowerCase()}, painted raceway where the wall will not open.`,
              },
              {
                title: "Calibrated, tested, walked through",
                desc: "Inputs cycled, soundbar and console confirmed working through the set, picture mode sanity-checked in your actual room light before we pack up.",
              },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-black/10 bg-gray-50 p-6">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-extrabold text-black mb-2">{f.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODELS */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">OLED Models We Mount</h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            The OLED panels we are called out to most in Middle Tennessee. Other OLED models are
            handled the same way — send us the code from the back of the set.
          </p>

          <SizeModelTable rows={rows} />

          <div className="mt-8">
            <PriceDisclaimer className="max-w-3xl" />
          </div>
        </div>
      </section>

      <FaqAccordion heading="OLED TV Mounting — Common Questions" faqs={FAQS} />

      <RelatedLinks
        heading="Related Pages"
        intro="OLED sits inside two of our brand pages, and the size pages cover what changes as the panel gets bigger."
        links={[
          { kicker: "Brand", href: "/lg-tv-mounting", title: "LG TV Mounting", desc: "The OLED C6 and C5, plus QNED and LED sets." },
          { kicker: "Brand", href: "/samsung-tv-mounting", title: "Samsung TV Mounting", desc: "The S90F OLED alongside Crystal UHD, QLED and The Frame." },
          { kicker: "Guide", href: "/blog/how-to-mount-lg-oled-c6-65-inch", title: "How to Mount a 65-Inch LG OLED C6", desc: "The handling rules and the slim-bracket decision, step by step." },
          { kicker: "Size guide", href: "/65-inch-tv-mounting", title: "65-Inch TV Mounting", desc: "Where the C6 and S90F sit, and the height that suits them." },
          { kicker: "Specialty", href: "/samsung-frame-tv-installation-nashville", title: "Samsung Frame TV Installation", desc: "The other premium Samsung that needs its own approach." },
          { kicker: "Add-on", href: "/cable-concealment-nashville", title: "Cable Concealment", desc: `In-wall routing from ${PRICES.cables.toLowerCase()} — the finishing touch an OLED needs.` },
        ]}
      />

      <CityLinkBand intro="OLED installs across Nashville and every surrounding city below. Same handling rules everywhere." />

      <SeoCta
        heading="Let Us Put Your OLED Up Properly"
        sub="Send the model code and your ZIP. We will confirm the bracket class, the crew and the price before we schedule."
        footLinks={[
          { label: "LG", href: "/lg-tv-mounting" },
          { label: "Samsung", href: "/samsung-tv-mounting" },
          { label: "Pricing", href: "/pricing" },
          { label: "Quick Quote", href: "/quick-quote" },
        ]}
      />

      <AffiliationFootnote />
      <StickyActionBar />
    </>
  )
}
