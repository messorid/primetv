import Link from "next/link"
import { notFound } from "next/navigation"
import StickyActionBar from "../../components/StickyActionBar"
import {
  SeoBreadcrumb, SeoHero, Eyebrow, FaqAccordion, CityLinkBand,
  RelatedLinks, SeoCta, AffiliationFootnote,
} from "../../components/TvSeoLayout"
import { serviceSchema, faqSchema, breadcrumbSchema, JsonLd } from "../../lib/tvSeoSchema"
import {
  BASE, HUB, FAN_TYPES, getFanType, otherFanTypes,
  FAN_AFFILIATION_NOTE, ELECTRICAL_SCOPE,
} from "../../lib/ceilingFans"
import { getFanContent } from "../../lib/ceilingFanContent"

// All seven type pages are pre-rendered at build time.
export function generateStaticParams() {
  return FAN_TYPES.map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const t = getFanType(slug)
  if (!t) return {}

  const url = `${BASE}${HUB}/${t.slug}`
  return {
    title: t.title,
    description: t.desc,
    keywords: [
      `${t.name.toLowerCase()} installation Nashville`,
      `${t.short.toLowerCase()} ceiling fan installer Nashville TN`,
      "ceiling fan installation Nashville",
      "ceiling fan replacement Nashville TN",
    ],
    openGraph: {
      title: t.title,
      description: t.desc,
      url,
      siteName: "PrimeTvNashville",
      images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: `${t.name} installation in Nashville Tennessee` }],
      locale: "en_US",
      type: "website",
    },
    alternates: { canonical: url },
  }
}

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 }

export default async function FanTypePage({ params }) {
  const { slug } = await params
  const t = getFanType(slug)
  if (!t) notFound()

  const c = getFanContent(slug)
  if (!c) notFound()

  const url = `${BASE}${HUB}/${t.slug}`
  const others = otherFanTypes(slug)

  const schema = [
    serviceSchema({
      name: `${t.name} Installation in Nashville, TN`,
      description: t.desc,
      serviceType: "Ceiling Fan Installation",
      url,
    }),
    breadcrumbSchema([
      { name: "Ceiling Fan Installation", path: HUB },
      { name: t.name, path: `${HUB}/${t.slug}` },
    ]),
    faqSchema(c.faqs),
  ]

  return (
    <>
      <JsonLd data={schema} />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-6 pt-6">
          <SeoBreadcrumb
            trail={[
              { label: "Ceiling Fan Installation", href: HUB },
              { label: t.name },
            ]}
          />
        </div>
      </div>

      <SeoHero
        eyebrow={<Eyebrow>{t.emoji} {t.short} · Nashville &amp; Middle Tennessee</Eyebrow>}
        title={`${t.name} Installation`}
        accent="in Nashville, TN"
        lead={t.lead}
        body={t.blurb}
        facts={[
          { label: "Pricing",     value: "By quote" },
          { label: "Typical job", value: t.time },
          { label: "Workmanship", value: "30-day warranty" },
        ]}
        ctaHref="/get-installation-quote"
        ctaLabel="Get a Quote for This Fan"
      />

      {/* THE THING THAT MAKES THIS TYPE DIFFERENT */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-4">{c.storyHeading}</h2>
          <div className="space-y-4 text-black/70 leading-relaxed max-w-3xl">
            {/* Plain text, rendered as text. The copy carries no markup, so
                there is no reason to reach for dangerouslySetInnerHTML here. */}
            {c.story.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* HOW WE DO IT */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <h2 className="text-3xl font-extrabold text-black mb-8">
            What a {t.name} Install Looks Like
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {c.steps.map(s => (
              <div key={s.title} className="rounded-2xl border border-black/10 bg-gray-50 p-6">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
                <h3 className="font-extrabold text-black mb-2">{s.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 max-w-3xl">
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-bold">Where our work stops.</span> {ELECTRICAL_SCOPE}
            </p>
          </div>
        </div>
      </section>

      <FaqAccordion heading={`${t.name} — Common Questions`} faqs={c.faqs} />

      <RelatedLinks
        heading="Other Ceiling Fans We Install"
        intro="Not the type you have? Each of these runs into a different problem on the ceiling."
        links={others.map(o => ({
          kicker: o.short,
          href: `${HUB}/${o.slug}`,
          title: o.name,
          desc: o.blurb,
        }))}
      />

      <CityLinkBand intro={`${t.name} installs across Nashville and every surrounding city below.`} />

      <SeoCta
        heading={`Ready to Get Your ${t.short} Fan Up?`}
        sub="Send us the model, a photo of the current fixture and your ZIP code and we will confirm the price before we schedule."
        ctaHref="/get-installation-quote"
        ctaLabel="Get a Quote for This Fan"
        footLinks={[
          { label: "All Ceiling Fans", href: HUB },
          { label: "All Installation Services", href: "/home-installation-services-nashville" },
          { label: "Shelves & Wall Installation", href: "/wall-installation-services-nashville" },
          { label: "TV Mounting", href: "/services/tv-mounting" },
        ]}
      />

      <AffiliationFootnote text={FAN_AFFILIATION_NOTE} />
      <StickyActionBar />
    </>
  )
}
