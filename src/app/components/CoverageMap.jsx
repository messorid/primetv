"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

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
    <section
      id="coverage"
      className="relative w-full bg-gray-50 text-black overflow-hidden"
    >

      {/* glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[400px] bg-red-500/10 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-6 py-16 md:py-20">

        {/* header */}
        <header className="max-w-3xl">

          <h2 className="text-3xl md:text-4xl font-extrabold">
            Coverage area
          </h2>

          <p className="mt-2 text-black/70">
            We serve Greater Nashville and nearby areas. 
            Jobs outside the radius may include a small trip fee
          </p>

        </header>


        {/* MAP */}
        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:.6 }}
          className="mt-10 relative rounded-2xl border border-black/10 shadow-lg overflow-hidden"
        >

          <div className="aspect-[16/9]">

            <iframe
              title="Nashville coverage map"
              src="https://www.google.com/maps?q=Nashville,+TN&hl=en&z=9&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />

          </div>

          {/* center marker */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

            <div className="relative flex items-center justify-center">

              <span className="absolute h-6 w-6 rounded-full bg-[#E50914]/40 animate-ping" />

              <span className="relative h-3 w-3 rounded-full bg-[#E50914] shadow-lg" />

            </div>

          </div>

        </motion.div>



        {/* AREAS + ZIP */}
        <div className="mt-10 grid md:grid-cols-2 gap-10">

          {/* areas */}
          <div>

            <h3 className="text-xl font-bold">
              Areas we serve
            </h3>

            {/* desktop chips */}
            <div className="mt-4 hidden md:flex flex-wrap gap-2">

              {AREAS.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-full border border-black/15 bg-white px-3 py-1.5 text-sm hover:bg-black/5 transition"
                >
                  {name}
                </span>
              ))}

            </div>

            {/* mobile slider */}
            <div className="md:hidden mt-3">

              <div className="flex items-center gap-2 text-sm text-black/60">
                <span>Swipe to browse areas</span>
              </div>

              <div className="mt-2 flex snap-x snap-mandatory overflow-x-auto gap-2">

                {AREAS.map((name) => (
                  <span
                    key={name}
                    className="snap-start shrink-0 rounded-full border border-black/15 bg-white px-3 py-1.5 text-sm"
                  >
                    {name}
                  </span>
                ))}

              </div>

            </div>

            <p className="mt-4 text-sm text-black/60">
              Our typical service radius is around 50 miles from downtown Nashville
            </p>

          </div>


          {/* ZIP checker */}
          <ZipQuickCheck />

        </div>



        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">

          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-7 py-4 font-semibold text-white hover:shadow-lg hover:shadow-red-500/30 transition"
          >
            Book installation
          </Link>

          <Link
            href="#quick-quote"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-7 py-4 font-semibold hover:bg-black/5 transition"
          >
            Get quick quote
          </Link>

        </div>

      </div>

    </section>
  )
}



/* ZIP CHECKER */

function ZipQuickCheck() {

  const [zip, setZip] = useState("")
  const [status, setStatus] = useState(null)

  useEffect(() => {

    const v = zip.trim()

    if (v.length < 3) {
      setStatus(null)
      return
    }

    const prefix = v.slice(0,3)

    if (["370","371","372"].includes(prefix)) setStatus("in")
    else if (["373","385"].includes(prefix)) setStatus("maybe")
    else setStatus("out")

  },[zip])


  return (

    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold">
        Quick ZIP check
      </h3>

      <p className="mt-1 text-sm text-black/70">
        Enter your ZIP to see if you are likely inside our service area
      </p>


      <div className="mt-4 flex items-center gap-2">

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          value={zip}
          onChange={(e)=>setZip(e.target.value.replace(/\D/g,""))}
          placeholder="ZIP code"
          className="w-full rounded-xl border border-black/15 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
        />

        <span
          className={`whitespace-nowrap rounded-xl px-3 py-3 text-sm font-semibold ${
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


      <p className="mt-2 text-xs text-black/60">
        This is only a quick guide. Final coverage is confirmed during booking
      </p>


      <div className="mt-4 flex gap-2">

        <Link
          href="/book"
          className="rounded-full bg-[#E50914] px-4 py-2 text-sm font-semibold text-white"
        >
          Book with this ZIP
        </Link>

        <Link
          href="#quote"
          className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-black/5"
        >
          Start quote
        </Link>

      </div>

    </div>

  )

}
