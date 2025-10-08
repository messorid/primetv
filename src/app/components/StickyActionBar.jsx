"use client"

import Link from "next/link"

const PHONE = process.env.NEXT_PUBLIC_PRIMETV_PHONE || "+1-000-000-0000"

export default function StickyActionBar() {
  return (
    <div
      role="region"
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-50"
    >
      {/* fondo para separar visualmente del contenido */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/95 via-white/70 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-3 pb-[env(safe-area-inset-bottom)]">
        <div className="mb-3 grid grid-cols-2 gap-2 rounded-2xl border border-black/10 bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
          <Link
            href="/book"
            aria-label="Book installation"
            className="inline-flex items-center justify-center rounded-xl bg-[#E50914] px-4 py-3 text-center text-sm font-semibold text-white transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]"
          >
            Book installation
          </Link>

          <Link
            href="#quick-quote"
            aria-label="Get a quick quote"
            className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-black/5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          >
            Quick quote
          </Link>
        </div>

        {/* fila util opcional: Call y Text message */}
        <div className="mb-3 flex items-center justify-center gap-3">
          <a
            href={`tel:${PHONE}`}
            className="rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-black/5"
          >
            Call
          </a>
          <a
            href={`sms:${PHONE}`}
            className="rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-black/5"
          >
            Text message
          </a>
        </div>
      </div>
    </div>
  )
}
