import Link from "next/link"
import StickyActionBar from "../components/StickyActionBar"
import {
  SeoBreadcrumb, SeoHero, Eyebrow, FaqAccordion, CityLinkBand,
  SeoCta, AffiliationFootnote, PhotoStrip,
} from "../components/TvSeoLayout"
import { serviceSchema, faqSchema, breadcrumbSchema, JsonLd } from "../lib/tvSeoSchema"
import { photoSet } from "../lib/photos"
import {
  BASE, HUB, FAN_TYPES, FAN_BRANDS, FAN_AFFILIATION_NOTE, ELECTRICAL_SCOPE,
} from "../lib/ceilingFans"

const URL = `${BASE}${HUB}`

export const metadata = {
  title: "Ceiling Fan Installation in Nashville, TN | PrimeTvNashville",
  description:
    "Ceiling fan installation in Nashville TN. Hunter, Hampton Bay, Harbor Breeze, Casablanca and more, hung level, quiet and properly braced. Get a quote.",
  keywords: [
    "ceiling fan installation Nashville",
    "ceiling fan installer Nashville TN",
    "replace ceiling fan Nashville",
    "Hunter ceiling fan installation",
    "outdoor ceiling fan installation Nashville",
    "high ceiling fan installation Nashville",
  ],
  openGraph: {
    title: "Ceiling Fan Installation in Nashville, TN | PrimeTvNashville",
    description:
      "Professional ceiling fan installation across Nashville and Middle Tennessee. Standard, LED, remote, flush mount, outdoor, smart and high-ceiling fans.",
    url: URL,
    siteName: "PrimeTvNashville",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: "Ceiling fan installation in Nashville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: URL },
}

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 }

const FAQS = [
  {
    q: "How much does ceiling fan installation cost in Nashville?",
    a: "Ceiling fan installation is quoted per job rather than at a flat rate, because almost all of the price lives in what we find in your ceiling. A straight swap onto an existing fan-rated box is at the quick end. Fitting a fan-rated brace box first, a porch ceiling, or a vaulted great room each take longer. Send us a photo of the current fixture and your ZIP code and one of our sales representatives will confirm your exact price before any work begins.",
  },
  {
    q: "Do I need an electrician to install a ceiling fan?",
    a: "Not for a replacement. If there is already a ceiling box with switched power where the fan is going, that is our work — including swapping a standard light-fixture box for a fan-rated brace box. What does need a licensed electrician is new wiring: a spot with no ceiling box at all, a new circuit, or a second switch leg so the fan and light run from separate wall switches. We are not electrical contractors and we tell you that before we quote rather than after we arrive.",
  },
  {
    q: "Can you replace a light fixture with a ceiling fan?",
    a: "Usually, and it is one of the most common jobs we are called out for. The catch is the box: a plain light-fixture box is not built to hold a moving load and must be replaced with one listed for fan support. We fit a fan-rated brace box that spans the joists. If the location has power and a switch, no electrician is needed.",
  },
  {
    q: "Which ceiling fan brands do you install?",
    a: "All of them. Hunter, Hampton Bay, Home Decorators Collection, Harbor Breeze, Casablanca, Minka-Aire, Fanimation, Emerson, Westinghouse, Big Ass Fans and Amico are the ones we see most in Middle Tennessee, and the list on this page covers where each is sold. We do not sell fans — buy whichever you like and we will hang it.",
  },
  {
    q: "How high should a ceiling fan be mounted?",
    a: "Blades should sit at least seven feet above the floor. On an eight-foot ceiling that usually means a flush mount fan with no downrod. On a high or vaulted ceiling you want the opposite — a downrod long enough to bring the blades down into the room, broadly eight to nine feet above the floor, because a fan tight to a sixteen-foot ceiling moves air nobody feels.",
  },
  {
    q: "Do you take the old ceiling fan away?",
    a: "Yes. The old fan and all the packaging leave with us unless you would rather keep them. Just say so when you book.",
  },
]

export default function CeilingFanHubPage() {
  const schema = [
    serviceSchema({
      name: "Ceiling Fan Installation in Nashville, TN",
      description:
        "Professional ceiling fan installation and replacement across Nashville and Middle Tennessee, including standard, LED, remote control, flush mount, outdoor, smart WiFi and high-ceiling fans.",
      serviceType: "Ceiling Fan Installation",
      url: URL,
    }),
    breadcrumbSchema([{ name: "Ceiling Fan Installation", path: HUB }]),
    faqSchema(FAQS),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-6 pt-6">
          <SeoBreadcrumb trail={[{ label: "Ceiling Fan Installation" }]} />
        </div>
      </div>

      <SeoHero
        eyebrow={<Eyebrow>Ceiling fans · {FAN_TYPES.length} types · {FAN_BRANDS.length} brands</Eyebrow>}
        title="Ceiling Fan Installation"
        accent="in Nashville, TN"
        lead="Replacing a fan, swapping a light fixture for one, or hanging the first fan a room has ever had — all of it comes down to what is in the ceiling above it."
        body="We install ceiling fans across Nashville, Brentwood, Franklin, Murfreesboro and the rest of Middle Tennessee: box checked and braced, fan hung level, blades balanced, and the old one taken away."
        facts={[
          { label: "Pricing",      value: "By quote" },
          { label: "Typical job",  value: "1 to 3 hours" },
          { label: "Workmanship",  value: "30-day warranty" },
        ]}
        ctaHref="/get-installation-quote"
        ctaLabel="Get a Ceiling Fan Quote"
      />

      {/* WHAT WE DO AND WHERE WE STOP */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">
            What We Do, and Where We Hand Over to an Electrician
          </h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl">
            <p>{ELECTRICAL_SCOPE}</p>
            <p>
              We would rather lose the job at the quote than discover it on your ceiling, so it is
              worth being precise about the line. <strong>Replacing a fan</strong> with another fan:
              ours. <strong>Replacing a light fixture</strong> with a fan, where that spot already has
              a switch and power: ours, including fitting the fan-rated brace box that a light box
              cannot substitute for. <strong>Putting a fan somewhere with no ceiling box at all</strong>,
              adding a circuit, or running a second switch leg so the fan and the light work from
              separate wall switches: licensed electrician work, and we will say so.
            </p>
            <p>
              The reason the box matters so much is worth a sentence. A ceiling fan has to be
              supported by an outlet box <em>listed for fan support</em>. A standard light-fixture box
              was designed to hold a stationary lamp, not a load that pushes and pulls on its mounting
              every hour it runs. Fans hung off one hold for a while and then work loose. Checking
              that box is the first thing we do on every single install, and on a good many of them it
              is the only real work in the job.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 max-w-3xl">
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-bold">Ceiling fan installation is quoted per job.</span> The price
              depends on the ceiling, the box we find, the height and the type of fan, so we do not
              publish a flat rate. One of our sales representatives confirms your exact price before
              any work begins, and we do not sell fans — buy the one you want and we will install it.
            </p>
          </div>
        </div>
      </section>

      {/* TYPES */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Ceiling Fans We Install</h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            Each type runs into a different problem on the ceiling. Pick the one that matches what you
            bought — or what you are about to buy.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FAN_TYPES.map(t => (
              <Link
                key={t.slug}
                href={`${HUB}/${t.slug}`}
                className="group rounded-2xl border border-black/10 bg-gray-50 p-5 hover:border-[#E50914]/30 hover:bg-white hover:shadow-md transition-all"
              >
                <span className="text-2xl">{t.emoji}</span>
                <h3 className="mt-2 text-sm font-extrabold text-black group-hover:text-[#E50914] transition-colors leading-snug">
                  {t.name}
                </h3>
                <p className="mt-2 text-xs text-black/55 leading-relaxed">{t.blurb}</p>
                <span className="mt-3 block text-xs font-semibold text-[#E50914]">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">Ceiling Fan Brands We Install</h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            We do not sell fans, so we have nothing to gain from steering you anywhere. What is worth
            knowing is <strong>where each brand is sold</strong> — it is the best predictor of how easy
            a replacement remote or light module will be to find in two years.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {FAN_BRANDS.map(b => (
              <div key={b.name} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-extrabold text-black leading-snug">{b.name}</h3>
                  <span className="shrink-0 rounded-full border border-black/10 bg-gray-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black/50">
                    {b.where}
                  </span>
                </div>
                <p className="mt-2 text-sm text-black/60 leading-relaxed">{b.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PhotoStrip
        heading="Ceilings We Have Worked On"
        intro="Ceiling fans are new to our service list, so these are installs from our wider work across Middle Tennessee — the same crews, ladders and ceilings."
        photos={photoSet("slatWallCeilingMount", "fireplaceShiplap", "outdoorPatio")}
      />

      <FaqAccordion heading="Ceiling Fan Installation — Common Questions" faqs={FAQS} />

      <CityLinkBand intro="We install ceiling fans across Nashville and every surrounding city below. Pick yours for local availability." />

      <SeoCta
        heading="Got a Fan in a Box and a Bare Ceiling?"
        sub="Send us the model, a photo of the current fixture and your ZIP code. We will confirm the price before we schedule."
        ctaHref="/get-installation-quote"
        ctaLabel="Get a Ceiling Fan Quote"
        footLinks={[
          { label: "All Installation Services", href: "/home-installation-services-nashville" },
          { label: "Shelves & Wall Installation", href: "/wall-installation-services-nashville" },
          { label: "Picture & Mirror Hanging", href: "/picture-mirror-hanging-nashville" },
          { label: "TV Mounting", href: "/services/tv-mounting" },
        ]}
      />

      <AffiliationFootnote text={FAN_AFFILIATION_NOTE} />
      <StickyActionBar />
    </>
  )
}
