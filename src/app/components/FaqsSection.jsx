"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Section, SectionHeader } from "./ui/Section"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

const FAQS = [
  {
    q: "Do you bring the TV bracket?",
    a: (
      <>
        Prices do not include the bracket, and we don&apos;t sell mounts. 
        We help you choose the right model for your TV and wall, 
        and we install the VESA-compatible mount you buy.
      </>
    ),
  },
  {
    q: "Can you hide the cables?",
    a: (
      <>
        Yes. Cable concealment is a $70 add-on per TV. 
        We use an in-wall power kit or an external raceway, depending on the wall type.
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
    q: "What if my wall is brick, concrete, tile, stone or metal?",
    a: (
      <>
        There is a $25 surcharge for hard surfaces, to cover the anchors and drilling. 
        Drywall has no extra charge.
      </>
    ),
  },
  {
    q: "Can you mount over a fireplace?",
    a: (
      <>
        Yes. Fireplace mounting starts from $25 extra. 
        We check the heat clearance and choose the safest mounting height.
      </>
    ),
  },
  {
    q: "What TV sizes do you handle?",
    a: (
      <>
        We mount most TVs from 32 inches to 85 inches and up. 
        For very large or commercial installations we may ask for photos first.
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
    q: "Is there a warranty, and can I reschedule?",
    a: (
      <>
        Yes — a workmanship warranty is included. 
        You can reschedule with 24 hours&apos; notice, depending on availability.
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
    <Section id="faqs" tone="soft" labelledBy="faqs-title">
      <SectionHeader id="faqs-title" eyebrow="FAQ" title="Questions people ask before booking" />
      <div className="mt-8 space-y-3">
        {FAQS.map(item => (
          <details key={item.q} className="group rounded-2xl border border-zinc-200 bg-white open:shadow-sm">
            <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 [&::-webkit-details-marker]:hidden">
              <h3 className="text-base sm:text-lg font-bold text-ink">{item.q}</h3>
              <span aria-hidden="true" className="flex size-8 flex-none items-center justify-center rounded-full border-2 border-zinc-300 text-lg font-bold text-ink transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="px-5 pb-5 text-base leading-relaxed text-body">{item.a}</div>
          </details>
        ))}
      </div>
      <p className="mt-6 text-base text-body">
        Another question?{" "}
        <a href="tel:+16156690251" className="font-bold text-ink underline decoration-brand decoration-2 underline-offset-4">Call (615) 669-0251</a>{" "}
        or{" "}
        <a href="sms:+16156690251" className="font-bold text-ink underline decoration-brand decoration-2 underline-offset-4">send us a text</a>.
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Section>
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

// Plain text for the FAQPage schema. renderToStaticMarkup escapes quotes and
// apostrophes, so they are decoded back or Google would read "don&#x27;t".
function stripHtml(html){
  return html
    .replace(/<[^>]*>/g," ")
    .replace(/&#x27;|&#39;|&apos;/g,"'")
    .replace(/&quot;/g,'"')
    .replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&amp;/g,"&")
    .replace(/\s+/g," ").trim()
}
