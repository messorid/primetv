"use client"

import Link from "next/link"
import { useMemo } from "react"
import { motion } from "framer-motion"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

const FAQS = [
  {
    q: "Do you bring the TV bracket?",
    a: (
      <>
        Prices do not include the bracket mount and we do not sell mounts. 
        We help you choose the correct model for your TV and wall. 
        We install customer supplied VESA compatible mounts safely.
      </>
    ),
  },
  {
    q: "Can you hide the cables?",
    a: (
      <>
        Yes. Cable concealment is a 60 add on per TV. 
        We use an in wall power kit or external raceway depending on the wall type.
      </>
    ),
  },
  {
    q: "How long does installation take?",
    a: (
      <>
        TVs up to 55 inches usually take 45 to 75 minutes. 
        TVs over 55 inches usually take 60 to 90 minutes. 
        Add ons may add extra time.
      </>
    ),
  },
  {
    q: "What if my wall is brick concrete tile stone or metal?",
    a: (
      <>
        There is a 25 surcharge for hard surfaces to cover anchors and drilling. 
        Drywall has no extra charge.
      </>
    ),
  },
  {
    q: "Can you mount over a fireplace?",
    a: (
      <>
        Yes. Fireplace handling starts from 25 extra. 
        We check heat clearance and choose the safest mounting height.
      </>
    ),
  },
  {
    q: "What TV sizes do you handle?",
    a: (
      <>
        We mount most TVs from 32 to 85 plus. 
        For very large or commercial installations we may request photos.
      </>
    ),
  },
  {
    q: "What areas do you cover?",
    a: (
      <>
        Greater Nashville within roughly 50 miles. 
        Jobs outside the radius may include a small trip fee. 
        See{" "}
        <Link
          href="#coverage"
          className="underline underline-offset-2 decoration-[#E50914] hover:text-[#E50914]"
        >
          coverage area
        </Link>
      </>
    ),
  },
  {
    q: "Warranty and reschedule",
    a: (
      <>
        Workmanship warranty included. 
        You can reschedule depending on availability with 24 hours notice.
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
            : stripHtml(renderToStringSafe(f.a)),
      },
    }))

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    }

  }, [])

  return (

    <section
      id="faqs"
      className="relative w-full bg-gray-50 text-black overflow-hidden"
    >

      {/* background glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[350px] bg-red-500/10 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-6 py-16 md:py-20">

        <header className="max-w-3xl">

          <h2 className="text-3xl md:text-4xl font-extrabold">
            FAQs
          </h2>

          <p className="mt-2 text-black/70">
            Quick answers for common questions about TV mounting
          </p>

        </header>


        <div className="mt-10 grid gap-4">

          {FAQS.map((item,i)=>(
            <motion.details
              key={i}
              initial={{opacity:0,y:20}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true}}
              transition={{duration:.4,delay:i*0.05}}
              className="group rounded-2xl border border-black/10 bg-white p-6 shadow-sm open:shadow-lg transition"
            >

              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">

                <h3 className="text-base md:text-lg font-bold">
                  {item.q}
                </h3>

                <span
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/20 text-black transition group-open:rotate-45"
                >
                  +
                </span>

              </summary>

              <div className="mt-3 text-sm text-black/80">
                {item.a}
              </div>

              <div className="pointer-events-none mt-4 h-px w-full bg-gradient-to-r from-transparent via-[#E50914]/40 to-transparent"/>

            </motion.details>
          ))}

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
            Get a quick quote
          </Link>

        </div>

      </div>


      {/* SEO FAQ JSON LD */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

    </section>

  )
}


/* helpers */

function renderToStringSafe(node){
  try{
    return renderToStaticMarkup(<>{node}</>)
  }catch{
    return ""
  }
}

function stripHtml(html){
  return html.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim()
}
