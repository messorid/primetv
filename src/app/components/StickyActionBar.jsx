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

export default function StickyActionBar() {
  return (
    <div
      role="region"
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-50"
    >
      {/* background fade */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/95 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-3 pb-[env(safe-area-inset-bottom)]">
        {/* main actions */}
        <div className="mb-1 grid grid-cols-2 gap-2 rounded-xl border border-black/10 bg-white p-1.5 shadow-md">
          <Link
            href="/book"
            aria-label="Book installation"
            onClick={() => gtag("event", "booking_start", { event_category: "engagement", page_path: typeof window !== "undefined" ? window.location.pathname : "/", placement: "sticky_bar", form_name: "booking_form" })}
            className="flex items-center justify-center rounded-lg bg-[#E50914] px-3 py-2 text-xs font-semibold text-white active:scale-[0.97]"
          >
            Book
          </Link>

          <Link
            href="/#quick-quote"
            aria-label="Get quick quote"
            onClick={() => gtag("event", "quote_form_start", { event_category: "engagement", page_path: typeof window !== "undefined" ? window.location.pathname : "/", placement: "sticky_bar", form_name: "quick_quote" })}
            className="flex items-center justify-center rounded-lg border border-black/15 px-3 py-2 text-xs font-semibold text-black hover:bg-black/5 active:scale-[0.97]"
          >
            Quote
          </Link>
        </div>

        {/* small secondary actions */}
        <div className="flex justify-center gap-2 pb-1">
          <a
            href={`tel:${PHONE}`}
            onClick={() => { gtag("event", "call_button", { event_category: "contact", page_path: typeof window !== "undefined" ? window.location.pathname : "/", placement: "sticky_bar" }); trackEvent("call_button") }}
            className="rounded-full border border-black/15 px-2.5 py-1 text-[11px] font-medium hover:bg-black/5"
          >
            Call
          </a>

          <a
            href={`sms:${PHONE}`}
            onClick={() => { gtag("event", "text_button", { event_category: "contact", page_path: typeof window !== "undefined" ? window.location.pathname : "/", placement: "sticky_bar" }); trackEvent("text_button") }}
            className="rounded-full border border-black/15 px-2.5 py-1 text-[11px] font-medium hover:bg-black/5"
          >
            Text
          </a>
        </div>
      </div>
    </div>
  )
}
