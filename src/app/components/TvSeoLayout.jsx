// Layout primitives shared by the brand, size and OLED pages.
//
// Only the chrome is shared — breadcrumbs, accordions, the city band, the CTA.
// Every word of body copy lives in the page that owns it, so the pages are not
// one template with the name swapped out.

import Link from "next/link"
import Image from "next/image"
import { AFFILIATION_NOTE, CITIES, PHONE_DISPLAY, PHONE_HREF } from "../lib/tvModels"

// Real job photos on the page. Portrait originals get a taller frame so the
// install is not cropped away at the top and bottom, which is exactly what
// happens to an over-fireplace shot squeezed into a landscape box.
export function PhotoStrip({ heading, intro, photos, priority = false }) {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <h2 className="text-3xl font-extrabold text-black mb-2">{heading}</h2>
        {intro && <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">{intro}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((p, i) => (
            <figure
              key={p.src}
              className={`relative overflow-hidden rounded-2xl border border-black/10 bg-gray-100 ${
                p.tall ? "aspect-[3/4]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={priority && i === 0}
              />
            </figure>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-black/40">
          Photos of our own installations in Nashville and Middle Tennessee.
        </p>
      </div>
    </section>
  )
}

export function SeoBreadcrumb({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-black/40">
      <Link href="/" className="hover:text-[#E50914] transition">Home</Link>
      {trail.map((t, i) => (
        <span key={t.label} className="flex items-center gap-1.5">
          <span aria-hidden="true">/</span>
          {i === trail.length - 1 || !t.href
            ? <span className="text-black/60 font-medium">{t.label}</span>
            : <Link href={t.href} className="hover:text-[#E50914] transition">{t.label}</Link>}
        </span>
      ))}
    </nav>
  )
}

export function SeoHero({ eyebrow, title, accent, lead, body, facts }) {
  return (
    <section className="relative w-full bg-white text-black overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-[#E50914] via-black to-[#E50914]" />
      <div aria-hidden="true" className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#E50914]/6 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-5 md:px-6 py-14 md:py-20">
        {eyebrow}

        <h1 className="text-3xl md:text-5xl font-black leading-tight text-black">
          {title}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-red-500">
            {accent}
          </span>
        </h1>

        <p className="mt-5 text-lg text-black/60 max-w-2xl leading-relaxed">{lead}</p>
        {body && <p className="mt-4 text-base text-black/70 max-w-2xl leading-relaxed">{body}</p>}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/book" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white shadow-xl shadow-red-500/25 hover:bg-red-700 transition">
            Book Your Installation
          </Link>
          <a href={PHONE_HREF} className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition">
            Call {PHONE_DISPLAY}
          </a>
        </div>

        {facts && (
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {facts.map(f => (
              <div key={f.label} className="rounded-2xl border border-black/10 bg-gray-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/35">{f.label}</p>
                <p className="mt-1 text-sm font-extrabold text-black">{f.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export function Eyebrow({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/70 mb-5">
      <span className="h-2 w-2 rounded-full bg-[#E50914] animate-pulse" />
      {children}
    </div>
  )
}

export function FaqAccordion({ heading, faqs }) {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <h2 className="text-3xl font-extrabold text-black mb-8">{heading}</h2>
        <div className="grid gap-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-2xl border border-black/10 bg-white p-5 open:shadow-md transition">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <h3 className="text-base font-bold text-black">{faq.q}</h3>
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/20 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-black/75 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// Every new page links out to the existing city pages from here.
export function CityLinkBand({ intro }) {
  return (
    <section className="w-full bg-white py-14 border-t border-black/[0.06]">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <h2 className="text-2xl font-extrabold text-black mb-2">Where We Install</h2>
        <p className="text-black/60 mb-6 text-sm max-w-2xl leading-relaxed">{intro}</p>
        <div className="flex flex-wrap gap-2">
          {CITIES.map(c => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-full border border-black/10 bg-gray-50 px-4 py-2 text-sm font-semibold text-black/70 hover:border-[#E50914]/30 hover:bg-white hover:text-[#E50914] transition"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Cross-links between the brand pages, the size pages and the guides.
export function RelatedLinks({ heading, intro, links }) {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <h2 className="text-2xl font-extrabold text-black mb-2">{heading}</h2>
        {intro && <p className="text-black/60 mb-8 text-sm max-w-2xl">{intro}</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="group rounded-2xl border border-black/10 bg-white p-5 hover:border-[#E50914]/30 hover:shadow-md transition-all"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/35">{l.kicker}</span>
              <h3 className="mt-1 text-sm font-extrabold text-black group-hover:text-[#E50914] transition-colors leading-snug">
                {l.title}
              </h3>
              {l.desc && <p className="mt-2 text-xs text-black/55 leading-relaxed">{l.desc}</p>}
              <span className="mt-3 block text-xs font-semibold text-[#E50914]">Read more →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SeoCta({ heading, sub, footLinks }) {
  return (
    <section className="w-full bg-black text-white py-16">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold">{heading}</h2>
        <p className="mt-3 text-white/60 text-lg">{sub}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/book" className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition">
            Book Your Installation
          </Link>
          <a href={PHONE_HREF} className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition">
            Call {PHONE_DISPLAY}
          </a>
        </div>
        {footLinks && (
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-3 text-sm text-white/40">
            {footLinks.map((l, i) => (
              <span key={l.href} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true">·</span>}
                <Link href={l.href} className="hover:text-white/70 transition">{l.label}</Link>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export function AffiliationFootnote() {
  return (
    <section className="w-full bg-white py-8 border-t border-black/[0.06]">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <p className="text-[11px] leading-relaxed text-black/40">{AFFILIATION_NOTE}</p>
      </div>
    </section>
  )
}

// Used on size pages: every model sold at that size, grouped so a reader can
// find their own TV quickly. Brand is shown because the page is not brand-scoped.
export function SizeModelTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <caption className="sr-only">Popular TV models we mount at this size</caption>
          <thead>
            <tr className="bg-gray-50 text-left">
              <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-black/40">Brand</th>
              <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-black/40">Model</th>
              <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-black/40">Panel</th>
              <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-black/40">Model code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06]">
            {rows.map(r => (
              <tr key={r.id} className="hover:bg-gray-50/70 transition">
                <td className="px-4 py-3 text-black/50 whitespace-nowrap">{r.brand}</td>
                <td className="px-4 py-3 font-semibold text-black">
                  {r.href
                    ? <Link href={r.href} className="hover:text-[#E50914] transition">{r.model}</Link>
                    : r.model}
                </td>
                <td className="px-4 py-3 text-black/55 whitespace-nowrap">{r.panel}</td>
                <td className="px-4 py-3 text-black/55 font-mono text-xs whitespace-nowrap">{r.code || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// The three things that genuinely change with screen size.
export function SizeFactsGrid({ items }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {items.map(i => (
        <div key={i.title} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#E50914] mb-3" />
          <h3 className="font-extrabold text-black mb-2">{i.title}</h3>
          <p className="text-sm text-black/60 leading-relaxed">{i.desc}</p>
        </div>
      ))}
    </div>
  )
}

// Used on brand pages: one card per series.
export function SeriesCard({ s, code, guideHref, sizesLabel }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-extrabold text-black leading-snug">{s.name}</h3>
        <span className="shrink-0 rounded-full border border-black/10 bg-gray-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black/50">
          {s.panel}
        </span>
      </div>

      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
        <div>
          <dt className="inline text-black/40 font-semibold">Sizes: </dt>
          <dd className="inline text-black/70 font-medium">{sizesLabel}</dd>
        </div>
        {code && (
          <div>
            <dt className="inline text-black/40 font-semibold">Model code: </dt>
            <dd className="inline text-black/70 font-medium font-mono">{code}</dd>
          </div>
        )}
      </dl>

      <p className="mt-3 text-sm text-black/60 leading-relaxed">{s.note}</p>

      {guideHref && (
        <Link href={guideHref} className="mt-4 inline-flex text-xs font-semibold text-[#E50914] hover:underline">
          How we mount this one →
        </Link>
      )}
    </div>
  )
}
