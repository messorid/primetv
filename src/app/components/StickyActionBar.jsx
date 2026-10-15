"use client"

import Link from "next/link"

const PHONE = "+16156690251"

function gtag(...args) {
  if (typeof window !== "undefined" && window.gtag) window.gtag(...args)
}

function trackEvent(type) {
  const page = typeof window !== "undefined" ? window.location.pathname : "/"
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, page }),
  }).catch(() => {})
}

// The bar fixed to the bottom of the screen: the four things a visitor wants
// to do next, each a full-size target (at least 52px tall) with an icon and a
// word, rather than two buttons and two 20px "Call" / "Text" chips.
export default function StickyActionBar() {
  const page = () => (typeof window !== "undefined" ? window.location.pathname : "/")
  const item = "flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl text-[13px] font-bold active:scale-[0.97] transition-transform"
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="mx-auto max-w-3xl px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-[1fr_1fr_1fr_1.35fr] gap-1.5 rounded-2xl border border-zinc-200 bg-white/95 p-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] backdrop-blur">
          <a href={`tel:${PHONE}`}
            onClick={() => { gtag("event", "call_button", { event_category: "contact", page_path: page(), placement: "sticky_bar" }); trackEvent("call_button") }}
            className={`${item} text-ink hover:bg-soft`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" /></svg>
            Call
          </a>
          <a href={`sms:${PHONE}`}
            onClick={() => { gtag("event", "text_button", { event_category: "contact", page_path: page(), placement: "sticky_bar" }); trackEvent("text_button") }}
            className={`${item} text-ink hover:bg-soft`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m-9 6l2.5-3H18a3 3 0 003-3V7a3 3 0 00-3-3H6a3 3 0 00-3 3v10z" /></svg>
            Text
          </a>
          <Link href="/quick-quote"
            onClick={() => gtag("event", "quote_form_start", { event_category: "engagement", page_path: page(), placement: "sticky_bar", form_name: "quick_quote" })}
            className={`${item} text-ink hover:bg-soft`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 4h6m-6 4h3M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" /></svg>
            Quote
          </Link>
          <Link href="/book"
            onClick={() => gtag("event", "booking_start", { event_category: "engagement", page_path: page(), placement: "sticky_bar", form_name: "booking_form" })}
            className={`${item} bg-brand text-white hover:bg-brand-dark`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Book now
          </Link>
        </div>
      </div>
    </nav>
  )
}
