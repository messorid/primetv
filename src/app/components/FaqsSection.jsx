"use client"

import Link from "next/link"
import { useMemo } from "react"

const FAQS = [
  {
    q: "Do you bring the TV bracket?",
    a: (
      <>
        Prices do not include the bracket mount and we do not sell mounts. We help you choose and find the correct model for your TV and wall. We install customer supplied VESA compatible mounts safely
      </>
    ),
  },
  {
    q: "Can you hide the cables?",
    a: (
      <>
        Yes. Cable concealment is a 60 add on per TV. We use an in wall power kit or an external raceway depending on your wall and code requirements
      </>
    ),
  },
  {
    q: "How long does installation take?",
    a: (
      <>
        TVs up to 55 inches usually take 45 to 75 minutes. TVs over 55 inches usually take 60 to 90 minutes. Add ons like cable concealment or fireplace may add extra time
      </>
    ),
  },
  {
    q: "What if my wall is brick concrete tile stone or metal?",
    a: (
      <>
        There is a 25 surcharge for hard surfaces to cover anchors and drilling. Drywall has no extra charge
      </>
    ),
  },
  {
    q: "Can you mount over a fireplace?",
    a: (
      <>
        Yes. Fireplace handling starts from 25 extra. We check heat clearance and choose the safest height and anchor points
      </>
    ),
  },
  {
    q: "What TV sizes do you handle?",
    a: (
      <>
        We mount most TVs from 32 to 85 plus. For very large or commercial grids we may request photos or a site visit
      </>
    ),
  },
  {
    q: "What areas do you cover?",
    a: (
      <>
        Greater Nashville with a radius of roughly 50 miles. Jobs outside the radius may include a small trip fee. See{" "}
        <Link href="#coverage" className="underline underline-offset-2 decoration-[#E50914] hover:text-[#E50914]">
          coverage area
        </Link>
      </>
    ),
  },
  {
    q: "Warranty and reschedule",
    a: (
      <>
        Workmanship warranty on the installation. You can reschedule subject to availability. Please let us know at least 24 hours in advance
      </>
    ),
  },
]

export default function FaqsSection() {
  const jsonLd = useMemo(() => {
    const mainEntity = FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          typeof f.a === "string"
            ? f.a
            : // render a plain text fallback when the answer is JSX
              stripHtml(renderToStringSafe(f.a)),
      },
    }))
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    }
  }, [])

  return (
    <section id="faqs" className="w-full bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <header className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold">FAQs</h2>
          <p className="mt-2 text-black/70">Quick answers for common questions about TV mounting</p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-3">
          {FAQS.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm open:shadow-md transition"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <h3 className="text-base md:text-lg font-bold">{item.q}</h3>
                <span
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 text-sm text-black/80">{item.a}</div>
              {/* red glow edge on open */}
              <div className="pointer-events-none mt-4 h-px w-full bg-gradient-to-r from-transparent via-[#E50914]/40 to-transparent" />
            </details>
          ))}
        </div>

        {/* bottom CTAs */}
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

      {/* SEO: FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}

/* helpers: render JSX to string without HTML for JSON-LD */
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

function renderToStringSafe(node) {
  try {
    return renderToStaticMarkup(<>{node}</>)
  } catch {
    return ""
  }
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}
