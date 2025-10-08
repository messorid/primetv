"use client"

import { useMemo } from "react"

const PHONE = process.env.NEXT_PUBLIC_PRIMETV_PHONE || "+1-000-000-0000"

export default function ContactOptions() {
  const smsHref = useMemo(() => {
    const msg = "Hi, I would like a quick TV mounting quote"
    return `sms:${PHONE}?&body=${encodeURIComponent(msg)}`
  }, [])

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="text-xl font-bold">Talk to a specialist</h3>
      <p className="mt-1 text-sm text-black/70">
        Business hours Mon to Sat 9 to 6. Same day options when available
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`tel:${PHONE}`}
          className="inline-flex items-center justify-center rounded-xl bg-[#E50914] px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
        >
          Call
        </a>
        <a
          href={smsHref}
          className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-black/5"
        >
          Text message
        </a>
      </div>

      <div className="mt-5 rounded-xl border border-black/10 bg-white p-4">
        <h4 className="font-semibold">What to have ready</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-black/80 space-y-1">
          <li>TV size and wall material</li>
          <li>Address or ZIP code</li>
          <li>Preferred date and time window</li>
          <li>Add ons like cable concealment or fireplace</li>
        </ul>
      </div>

      <p className="mt-3 text-xs text-black/60">
        Prices do not include the bracket mount. We do not sell mounts but we help you choose the right model
      </p>
    </div>
  )
}
