import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import PriceDisclaimer from "../components/PriceDisclaimer"
import {
  SeoBreadcrumb, SeoHero, Eyebrow, FaqAccordion, CityLinkBand,
  RelatedLinks, SeoCta, AffiliationFootnote, SeriesCard,
} from "../components/TvSeoLayout"
import { serviceSchema, faqSchema, breadcrumbSchema, JsonLd } from "../lib/tvSeoSchema"
import { BASE, PRICES, seriesForBrand, codeFor, guideFor, getBrand } from "../lib/tvModels"

const URL = `${BASE}/tcl-tv-mounting`

export const metadata = {
  title: "TCL TV Mounting in Nashville, TN | PrimeTvNashville",
  description:
    "TCL TV mounting in Nashville TN. QM5K, QM6K, QM7K, QM9K QD-Mini LED, Q6LR and F7D mounted level and anchored into studs. Starting from $110 per TV.",
  keywords: [
    "TCL TV mounting Nashville",
    "TCL TV installation Nashville TN",
    "TCL QM6K wall mount",
    "TCL QM7K installer Nashville",
    "mount TCL 85 inch TV",
    "TCL Mini LED TV mounting",
  ],
  openGraph: {
    title: "TCL TV Mounting in Nashville, TN | PrimeTvNashville",
    description:
      "Professional TCL TV wall mounting across Nashville and Middle Tennessee. QD-Mini LED, QLED and LED models.",
    url: URL,
    siteName: "PrimeTvNashville",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "TCL TV wall mounting in Nashville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: URL },
}

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 }

const FAQS = [
  {
    q: "How much does TCL TV mounting cost in Nashville?",
    a: `TVs up to 55 inches start ${PRICES.upTo55.toLowerCase()} and larger sets start ${PRICES.over55.toLowerCase()}. Most TCL calls we take are for 65-inch and up, so the larger rate is usually the starting point. These are starting prices only — the difficulty, the wall type and the bracket decide the final figure, which a sales representative confirms before any work begins.`,
  },
  {
    q: "Is a QM7K harder to mount than a QM6K?",
    a: "Not because of the model number. What changes the job is the size you bought. A 65-inch QM6K is a routine install; an 85-inch QM6K is a two-technician lift onto a wall we want to inspect first. The QM7K is sold at 75 inches, so it is always a two-person job. Read the size, not the series, when you are guessing at difficulty.",
  },
  {
    q: "Why does my TCL sit further off the wall than my old TV?",
    a: "The QM line uses QD-Mini LED backlighting, and that backlight needs depth. The chassis is thicker than the thin edge-lit LED panel it probably replaced. Put a full-motion arm behind it and the gap grows again. If a flush look matters to you, tell us before we choose the bracket — it is a bracket decision, and it is much cheaper to make once.",
  },
  {
    q: "Can you mount an 85-inch TCL above a fireplace?",
    a: `Sometimes, and we will measure before we promise. Over-fireplace handling starts ${PRICES.fireplace.toLowerCase()}, but at 85 inches the real question is whether there is enough wall above the firebox to clear the heat and still leave an angle you can watch comfortably. On a lot of Nashville mantels there is not. When that is the case we say so and suggest a different wall rather than mounting something you will regret.`,
  },
  {
    q: "Do you install the soundbar and the console at the same time?",
    a: "Yes. Most TCL installs we do include a soundbar underneath, and doing both in one visit means the cables get routed once rather than twice. Mention it when you book so we allow the time and bring what we need.",
  },
  {
    q: "Do I need to buy the mount before you arrive?",
    a: "Yes — we do not sell mounts. Send us the model and the wall type when you book and we will tell you which bracket class to buy so it reaches your studs and holds the weight. If you already own one, we will check it against the panel on arrival and tell you honestly if it is not up to the job.",
  },
]

export default function TclTvMountingPage() {
  const brand  = getBrand("tcl")
  const series = seriesForBrand("tcl")

  const schema = [
    serviceSchema({
      name: "TCL TV Mounting in Nashville, TN",
      description:
        "Professional wall mounting and installation of TCL televisions, including the QM5K, QM6K, QM7K and QM9K QD-Mini LED series, across Nashville and Middle Tennessee.",
      serviceType: "TCL TV Mounting",
      url: URL,
    }),
    breadcrumbSchema([{ name: "TCL TV Mounting", path: "/tcl-tv-mounting" }]),
    faqSchema(FAQS),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-6 pt-6">
          <SeoBreadcrumb trail={[{ label: "TCL TV Mounting" }]} />
        </div>
      </div>

      <SeoHero
        eyebrow={<Eyebrow>TCL · QD-Mini LED, QLED &amp; LED</Eyebrow>}
        title="TCL TV Mounting"
        accent="in Nashville, TN"
        lead={brand.angle}
        body="We mount TCL panels across Nashville, Franklin, Spring Hill and Nolensville — levelled, anchored into studs, with the finished gap to the wall checked before we call it done."
        facts={[
          { label: "Up to 55 inches", value: PRICES.upTo55 },
          { label: "Over 55 inches",  value: PRICES.over55 },
          { label: "Workmanship",     value: PRICES.warranty },
        ]}
      />

      {/* THE QM NAMING TRAP */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">
            The QM Number Does Not Tell You How Hard the Install Is
          </h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl">
            <p>
              TCL&rsquo;s QM line reads like a ladder — QM5K, QM6K, QM7K, QM9K — and customers
              reasonably assume a higher number means a bigger, harder job. It does not. The series
              number tracks picture quality and features. What decides the install is which size TCL
              chose to sell that series in.
            </p>
            <p>
              The <strong>QM5K</strong> is sold at 85 inches. It is the &ldquo;lowest&rdquo; number in
              the range and it is one of the heaviest installs we do. The <strong>QM6K</strong> comes
              at both 65 and 85 inches, which means two genuinely different appointments hiding
              behind one model name: the 65-inch is a straightforward afternoon, the 85-inch needs
              two technicians and a wall we have checked. The <strong>QM7K</strong> sits at 75 inches
              and the <strong>QM9K</strong>, the flagship, at 85.
            </p>
            <p>
              So when you book, give us the size. It is the number that changes what we bring.
            </p>
            <p>
              The other thing worth knowing about the QM series is depth. QD-Mini LED backlighting
              needs physical room behind the panel, so these sets are thicker than the edge-lit LED
              TVs most of them replace. Customers notice it — we get asked about it more on TCL than
              on any other brand. It is not a fault, and it is not something a different installer
              would fix. It is the backlight.
            </p>
            <p>
              What we can do is choose the bracket around it. A slim fixed mount keeps a QM panel as
              close to the wall as it will go; a full-motion arm adds depth in exchange for being able
              to angle the screen into a kitchen or around a corner. You cannot have both, and the
              decision is much easier to make before there are holes in the wall than after. Tell us
              which matters more to you when you book.
            </p>
            <p>
              At the lighter end, the <strong>Q6LR</strong> and <strong>F7D</strong> at 65 inches are
              among the quickest installs we do. Both are light, conventional panels that go up on a
              standard tilt bracket, and both are good candidates for a full-motion arm if you need
              to angle the picture — the weight penalty that makes that awkward on a QM9K simply is
              not there.
            </p>
          </div>
        </div>
      </section>

      {/* SERIES */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">TCL Series We Mount</h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            Sizes listed are the ones we see in Middle Tennessee homes. Not sure which you have?
            The model code is on a sticker on the back of the panel — send it to us.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {series.map(s => {
              const guide = guideFor(s.id)
              return (
                <SeriesCard
                  key={s.id}
                  s={s}
                  code={codeFor(s, 65) || codeFor(s, 75) || codeFor(s, 85)}
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
          <h2 className="text-3xl font-extrabold text-black mb-8">What We Do on a TCL Install</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "Bracket chosen around the chassis depth",
                desc: "We ask how flush you want the TV before we pick a mount, because on a QD-Mini LED panel that single answer rules out half the options. Slim fixed for close to the wall, full-motion if you need the angle.",
              },
              {
                title: "Studs located and the bracket centred",
                desc: "Found and confirmed, not guessed. On the 85-inch QM sets the bracket goes across two studs minimum, and we take a third when the spacing allows it.",
              },
              {
                title: "Two technicians on 75 and 85 inches",
                desc: "The QM7K, QM5K and QM9K are all large-format sets. Panels get damaged when one person tries to carry the weight and align the mount at the same time, so we do not work that way.",
              },
              {
                title: "Height set from where you actually sit",
                desc: "Centre of the screen near seated eye level. On an 85-inch TCL that rule runs into the media console underneath, so we sit down in the room and find the lowest height the furniture allows.",
              },
              {
                title: "Soundbar and sources in the same visit",
                desc: "Most TCL installs come with a soundbar or a console. Doing them together means the cables are routed once. Tell us at booking and we will allow the time.",
              },
              {
                title: "Gap checked with the TV hanging",
                desc: "The finished distance to the wall gets checked with the panel on the mount, while there is still time to change the bracket rather than live with it.",
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

      <FaqAccordion heading="TCL TV Mounting — Common Questions" faqs={FAQS} />

      <RelatedLinks
        heading="Mounting a TCL by Size"
        intro="With TCL especially, the size is the thing that changes the appointment. Start here."
        links={[
          { kicker: "Size guide", href: "/65-inch-tv-mounting", title: "65-Inch TV Mounting", desc: "QM6K, Q6LR and F7D — the quickest end of the TCL range." },
          { kicker: "Size guide", href: "/75-inch-tv-mounting", title: "75-Inch TV Mounting", desc: "The QM7K, and where a second technician becomes mandatory." },
          { kicker: "Size guide", href: "/85-inch-tv-mounting", title: "85-Inch TV Mounting", desc: "QM5K, QM6K and the QM9K flagship on a wall that has to take it." },
          { kicker: "Guide", href: "/blog/how-to-mount-tcl-qm5k-85-inch", title: "How to Mount an 85-Inch TCL QM5K", desc: "The heaviest install in the TCL range, step by step." },
          { kicker: "Guide", href: "/blog/how-to-mount-tcl-qm6k-65-inch", title: "How to Mount a 65-Inch TCL QM6K", desc: "The same series at the size that fits most rooms." },
          { kicker: "Add-on", href: "/soundbar-installation-nashville", title: "Soundbar Installation", desc: "Mounted below or above the TV with the cables routed once." },
        ]}
      />

      <CityLinkBand intro="TCL installs across Nashville and every city below. Pick yours for local pricing and availability." />

      <SeoCta
        heading="Tell Us the Size and We Will Bring the Right Crew"
        sub="Send the model code and your ZIP. We will confirm the bracket, the crew and the price before we book you in."
        footLinks={[
          { label: "Samsung", href: "/samsung-tv-mounting" },
          { label: "Hisense", href: "/hisense-tv-mounting" },
          { label: "LG", href: "/lg-tv-mounting" },
          { label: "Pricing", href: "/pricing" },
        ]}
      />

      <AffiliationFootnote />
      <StickyActionBar />
    </>
  )
}
