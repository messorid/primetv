"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

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

export default function CoverageMap() {
  return (
    <section id="coverage" className="w-full bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <header className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold">Coverage area</h2>
          <p className="mt-2 text-black/70">
            We serve Greater Nashville. Jobs outside the radius may include a small trip fee
          </p>
        </header>

        {/* Map */}
        <div className="mt-8 relative rounded-2xl border border-black/10 shadow-sm overflow-hidden">
          <div className="aspect-[16/9]">
            <iframe
              title="Nashville coverage map"
              src="https://www.google.com/maps?q=Nashville,+TN&hl=en&z=9&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>
          {/* subtle overlay frame */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-black/10 rounded-2xl" />
          {/* center marker */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="h-3 w-3 rounded-full bg-[#E50914] shadow" />
          </div>
        </div>

        {/* Areas + ZIP checker */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* areas list */}
          <div>
            <h3 className="text-xl font-bold">We cover these areas</h3>

            {/* desktop chips */}
            <div className="mt-4 hidden md:flex flex-wrap gap-2">
              {AREAS.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-full border border-black/15 bg-white px-3 py-1.5 text-sm text-black hover:bg-black/5"
                >
                  {name}
                </span>
              ))}
            </div>

            {/* mobile slider with swipe hint */}
            <div className="md:hidden mt-3">
              <div className="flex items-center gap-2 text-sm text-black/60">
                <svg className="h-4 w-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 12h8" strokeWidth="2" />
                  <path d="M12 8l-4 4 4 4" strokeWidth="2" />
                </svg>
                <span>Swipe to browse areas</span>
              </div>
              <div className="mt-2 flex snap-x snap-mandatory overflow-x-auto no-scrollbar gap-2">
                {AREAS.map((name) => (
                  <span
                    key={name}
                    className="snap-start shrink-0 inline-flex items-center rounded-full border border-black/15 bg-white px-3 py-1.5 text-sm text-black"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm text-black/60">
              Service radius is roughly 50 miles from downtown Nashville
            </p>
          </div>

          {/* zip quick check */}
          <ZipQuickCheck />
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-6 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-red-500/30"
          >
            Book installation
          </Link>
          <Link
            href="#quick-quote"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 font-semibold text-black hover:bg-black/5 transition"
          >
            Get a quick quote
          </Link>
        </div>
      </div>
    </section>
  )
}

/* subcomponents */

function ZipQuickCheck() {
  const [zip, setZip] = useState("")
  const [status, setStatus] = useState(null) // "in" | "maybe" | "out"
  const liveRef = useRef(null)

  useEffect(() => {
    // simple heuristic for quick guidance
    // Likely in range: TN zips starting with 370 371 372
    // Maybe: 373 or 385 could be in fringe
    // Out: others
    const v = zip.trim()
    if (v.length < 3) {
      setStatus(null)
      return
    }
    const prefix = v.slice(0, 3)
    if (["370", "371", "372"].includes(prefix)) setStatus("in")
    else if (["373", "385"].includes(prefix)) setStatus("maybe")
    else setStatus("out")
  }, [zip])

  return (
    <div aria-labelledby="zipCheckTitle" className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 id="zipCheckTitle" className="text-xl font-bold">Quick ZIP check</h3>
      <p className="mt-1 text-sm text-black/70">
        Enter your ZIP to see if you are likely inside our service radius
      </p>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="ZIP code"
          aria-describedby="zipHelp"
        />
        <span
          ref={liveRef}
          aria-live="polite"
          className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ${
            status === "in"
              ? "bg-emerald-600 text-white"
              : status === "maybe"
              ? "bg-amber-500 text-white"
              : status === "out"
              ? "bg-black text-white"
              : "bg-black/5 text-black/70"
          }`}
        >
          {status === "in" && "Likely covered"}
          {status === "maybe" && "Maybe covered"}
          {status === "out" && "Outside radius"}
          {status === null && "Status"}
        </span>
      </div>

      <p id="zipHelp" className="mt-2 text-xs text-black/60">
        This is a quick guide. Final coverage is confirmed during booking. Addresses outside the radius may include a small trip fee
      </p>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href="/book"
          className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          Book with this ZIP
        </Link>
        <Link
          href="#quote"
          className="inline-flex items-center justify-center rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5 transition"
        >
          Start quote
        </Link>
      </div>
    </div>
  )
}
