"use client"
// Where we work: the areas (linked to their own pages where one exists), a
// quick ZIP check, and a map. The ZIP check comes first on a phone because it
// answers the actual question — "do you come to me?" — fastest.
import Link from "next/link"
import { useEffect, useState } from "react"
import { Section, SectionHeader, ButtonLink } from "./ui/Section"

const AREAS = [
  "Nashville",
  "Franklin",
  "Brentwood",
  "Hendersonville",
  "Gallatin",
  "Smyrna",
  "Murfreesboro",
  "Mount Juliet",
  "Hermitage",
  "Antioch",
  "Bellevue",
  "Madison",
  "Goodlettsville",
  "Lebanon",
  "La Vergne",
  "Nolensville",
  "Spring Hill north",
  "Thompsons Station north",
  "Green Hills",
  "East Nashville",
  "Germantown",
  "The Gulch",
  "Berry Hill",
  "Donelson"
]

// Areas with their own TV mounting page.
const PAGES = {
  "Nashville": "/tv-mounting-nashville", "Franklin": "/tv-mounting-franklin", "Brentwood": "/tv-mounting-brentwood",
  "Hendersonville": "/tv-mounting-hendersonville", "Gallatin": "/tv-mounting-gallatin", "Smyrna": "/tv-mounting-smyrna",
  "Murfreesboro": "/tv-mounting-murfreesboro", "Mount Juliet": "/tv-mounting-mount-juliet", "Goodlettsville": "/tv-mounting-goodlettsville",
  "Lebanon": "/tv-mounting-lebanon", "La Vergne": "/tv-mounting-la-vergne", "Nolensville": "/tv-mounting-nolensville",
  "Spring Hill north": "/tv-mounting-spring-hill",
}

export default function CoverageMap() {
  return (
    <Section id="coverage" labelledBy="coverage-title">
      <SectionHeader id="coverage-title" eyebrow="Service area" title="We come to you across Greater Nashville"
        sub="Around 50 miles from downtown Nashville. Jobs outside that radius may include a small trip fee." />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <h3 className="text-lg font-extrabold text-ink">Areas we serve</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {AREAS.map(name => (
              <li key={name}>
                {PAGES[name] ? (
                  <Link href={PAGES[name]}
                    className="inline-flex min-h-[44px] items-center rounded-full border-2 border-zinc-300 bg-white px-4 text-base font-semibold text-ink hover:border-ink">
                    {name.replace(" north", "")}
                  </Link>
                ) : (
                  <span className="inline-flex min-h-[44px] items-center rounded-full bg-soft px-4 text-base text-body">{name}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">Linked areas have their own page with local details.</p>
        </div>

        <div className="order-1 space-y-5 lg:order-2">
          <ZipQuickCheck />
          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            <iframe
              title="Map of the Nashville area we serve"
              src="https://www.google.com/maps?q=Nashville,+TN&hl=en&z=9&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[16/10] w-full"
            />
          </div>
        </div>
      </div>
    </Section>
  )
}

const ZIP_STATUS = {
  in:    { label: "Good news — you're very likely in our area.", cls: "border-emerald-300 bg-emerald-50 text-emerald-900" },
  maybe: { label: "You may be in our area — book and we'll confirm.", cls: "border-amber-300 bg-amber-50 text-amber-950" },
  out:   { label: "That looks outside our usual area. Call us and we'll check.", cls: "border-zinc-300 bg-soft text-ink" },
}

function ZipQuickCheck() {
  const [zip, setZip] = useState("")
  const [status, setStatus] = useState(null)
  useEffect(() => {
    const v = zip.trim()
    if (v.length < 5) { setStatus(null); return }
    const prefix = v.slice(0, 3)
    if (["370", "371", "372"].includes(prefix)) setStatus("in")
    else if (["373", "385"].includes(prefix)) setStatus("maybe")
    else setStatus("out")
  }, [zip])
  const st = status && ZIP_STATUS[status]
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
      <h3 className="text-lg font-extrabold text-ink">Do you come to my area?</h3>
      <label htmlFor="coverage-zip" className="mt-3 block text-base font-semibold text-ink">Your ZIP code</label>
      <input
        id="coverage-zip"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="postal-code"
        maxLength={5}
        value={zip}
        onChange={e => setZip(e.target.value.replace(/\D/g, ""))}
        placeholder="37209"
        aria-describedby="coverage-zip-result"
        className="mt-1.5 w-full min-h-[52px] rounded-xl border-2 border-zinc-300 px-4 text-lg focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
      />
      <p id="coverage-zip-result" aria-live="polite"
        className={`mt-3 rounded-xl border px-4 py-3 text-base font-semibold ${st ? st.cls : "border-transparent px-0 py-0 text-muted font-normal"}`}>
        {st ? st.label : "Type all 5 digits to check. Final coverage is confirmed when you book."}
      </p>
      {st && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/book" size="sm">Book installation</ButtonLink>
          <ButtonLink href="tel:+16156690251" variant="secondary" size="sm">Call (615) 669-0251</ButtonLink>
        </div>
      )}
    </div>
  )
}
