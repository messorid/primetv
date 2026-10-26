// The services, as a grid. They used to sit in a sideways slider, which hid
// four of the six cards off-screen and could not be reached by keyboard; a
// grid shows every price at once. On a phone each card is a compact row.
import Image from "next/image"
import Link from "next/link"
import { Section, SectionHeader } from "./ui/Section"

const SERVICES = [
  {
    slug: "promo-2tvs-under55",
    title: "Promo 2 TVs up to 55 in",
    desc: "Same visit and address. Brackets not included",
    img: "/images/tvpromo.png",
    priceLabel: "From $199",
    time: "Typically 90 to 120 min",
    notes: ["Same visit same address", "Bracket not included", "Drywall no extra"],
    promo: true,
    ctaLabel: "Use promo",
    href: "/book",
  },
  {
    slug: "promo-2tvs-over55",
    title: "Promo 2 TVs over 55 in",
    desc: "Same visit and address. Brackets not included",
    img: "/images/tvpromo2.png",
    priceLabel: "From $260",
    time: "Typically 120 to 150 min",
    notes: ["Same visit same address", "Bracket not included", "Two person handling"],
    promo: true,
    ctaLabel: "Use promo",
    href: "/book",
  },
  {
    slug: "tv-up-to-55",
    title: "TV up to 55 inches",
    desc: "Secure wall mount on drywall with studs",
    img: "/images/tv3.jpeg",
    priceLabel: "From $110 per TV",
    time: "45 to 75 min",
    notes: ["Drywall no extra", "Bracket not included"],
    ctaLabel: "Book this service",
    href: "/book",
  },
  {
    slug: "tv-over-55",
    title: "TV over 55 inches",
    desc: "Two person handling and precise leveling",
    img: "/images/tv1.jpeg",
    priceLabel: "From $140 per TV",
    time: "60 to 90 min",
    notes: ["Drywall no extra", "Bracket not included"],
    highlight: true,
    ctaLabel: "Book this service",
    href: "/book",
  },
  {
    slug: "over-fireplace",
    title: "Over fireplace",
    desc: "Heat clearance check and cable path planning",
    img: "/images/tv4.jpeg",
    priceLabel: "From $25 extra",
    time: "75 to 120 min",
    notes: ["Add on", "Depends on setup"],
    addon: true,
    ctaLabel: "Add to booking",
    href: "/book",
  },
  {
    slug: "cable-concealment",
    title: "Cable concealment",
    desc: "In wall power kit or external raceway",
    img: "/images/tv2.jpeg",
    priceLabel: "From $70 add on",
    time: "30 to 60 min",
    notes: ["Add on per TV"],
    addon: true,
    ctaLabel: "Add to booking",
    href: "/book",
  },
]

export default function ServicesSection() {
  return (
    <Section id="services" labelledBy="services-title">
      <SectionHeader
        id="services-title"
        eyebrow="Services & prices"
        title="Choose your TV installation"
        sub="Starting prices per TV. Your final price depends on the job, the wall type and the mount — confirmed by our team before any work begins."
      />

      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {SERVICES.map(s => <ServiceCard key={s.slug} {...s} />)}
      </ul>

      <p className="mt-6 text-sm text-muted">
        Prices do not include the bracket. We don&apos;t sell mounts, but we help you choose the right one for your TV and wall.
        Pull-down mantel mounts and Samsung Frame TVs are quoted separately.
      </p>
    </Section>
  )
}

function ServiceCard({ slug, title, desc, img, priceLabel, time, notes = [], promo, addon, highlight }) {
  const tag = promo ? "Promo" : addon ? "Add-on" : highlight ? "Most booked" : null
  const cta = promo ? "Book this promo" : addon ? "Add to a booking" : "Book this service"
  return (
    <li className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm ${highlight ? "border-brand ring-1 ring-brand" : "border-zinc-200"}`}>
      <div className="flex gap-4 p-4 sm:block sm:p-0">
        {/* Photo: a thumbnail on phones, the card's top on wider screens. */}
        <div className="relative size-24 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:aspect-[16/10] sm:size-auto sm:w-full sm:rounded-none">
          <Image src={img} alt="" fill sizes="(max-width:640px) 96px, (max-width:1024px) 50vw, 33vw" className="object-cover" />
          {tag && (
            <span className="absolute left-2 top-2 hidden rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white sm:inline-block">{tag}</span>
          )}
        </div>
        <div className="min-w-0 sm:p-5 sm:pb-0">
          {tag && <p className="text-xs font-bold uppercase tracking-wide text-brand-dark sm:hidden">{tag}</p>}
          <h3 className="text-lg font-extrabold leading-snug text-ink">{title}</h3>
          <p className="mt-1 text-xl font-black text-brand-dark">{priceLabel}</p>
          <p className="mt-1 text-sm text-body">{desc}</p>
        </div>
      </div>
      <div className="mt-auto px-4 pb-4 sm:px-5 sm:pb-5">
        <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted sm:mt-3">
          {time && <li>⏱ {time}</li>}
          {notes.map(n => <li key={n} className="hidden sm:list-item">{n}</li>)}
        </ul>
        <Link
          href={`/book?service=${encodeURIComponent(slug)}`}
          className={`flex min-h-[48px] items-center justify-center rounded-full px-5 text-base font-bold transition-colors ${
            promo || highlight ? "bg-brand text-white hover:bg-brand-dark" : "border-2 border-zinc-300 text-ink hover:border-ink"
          }`}
        >
          {cta}<span className="sr-only">: {title}</span>
        </Link>
      </div>
    </li>
  )
}
