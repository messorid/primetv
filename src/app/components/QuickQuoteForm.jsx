"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

export default function QuickQuoteForm({ onSubmitted }) {
  const [status, setStatus] = useState("idle") // idle | sending | ok | error
  const [form, setForm] = useState({
    tvSize: "",     // up_to_55 | over_55
    location: "",   // ZIP or City
    name: "",
    phone: "",
    email: "",
  })

  const valid = useMemo(() => {
    return (
      form.tvSize &&
      form.location.trim() &&
      form.name.trim() &&
      form.phone.trim() &&
      form.email.trim()
    )
  }, [form])

  const basePrice =
    form.tvSize === "up_to_55" ? "From 110 per TV" :
    form.tvSize === "over_55" ? "From 140 per TV" : ""

  function isZip(v) {
    return /^\d{5}$/.test(v.trim())
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!valid) return
    setStatus("sending")
    try {
      // Mapeo al formato que acepta /api/quote
      const payload = {
        service: form.tvSize === "up_to_55" ? "TV up to 55" : "TV over 55",
        tvSize: form.tvSize === "up_to_55" ? "Up to 55 inches" : "Over 55 inches",
        zip: isZip(form.location) ? form.location.trim() : "",
        address: isZip(form.location) ? "" : form.location.trim(), // city si no es ZIP
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      }

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Request failed")

      setStatus("ok")
      setForm({ tvSize: "", location: "", name: "", phone: "", email: "" })
      onSubmitted?.()
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={onSubmit} id="quick-quote" className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm" >
      <h3 className="text-xl font-bold">Quick quote</h3>
      <p className="mt-1 text-sm text-black/70">
        Just the basics. We will reply with price and availability
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3">
        {/* TV size selector compacto */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">TV size</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, tvSize: "up_to_55" })}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                form.tvSize === "up_to_55"
                  ? "border-[#E50914] bg-[#E50914] text-white"
                  : "border-black/15 bg-white hover:bg-black/5"
              }`}
            >
              Up to 55 in
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, tvSize: "over_55" })}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                form.tvSize === "over_55"
                  ? "border-[#E50914] bg-[#E50914] text-white"
                  : "border-black/15 bg-white hover:bg-black/5"
              }`}
            >
              Over 55 in
            </button>
          </div>
          {basePrice && <p className="mt-2 text-xs text-black/60">{basePrice}</p>}
        </div>

        {/* ZIP o City */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">ZIP or City</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Example 37209 or Nashville"
            className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Full name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Mobile for updates"
            className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={!valid || status === "sending"}
          className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-6 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Get my quote"}
        </button>
        <Link
          href="/book"
          className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 font-semibold text-black transition hover:bg-black/5"
        >
          Book installation
        </Link>
      </div>

      {/* Status */}
      <div className="mt-3 min-h-6" aria-live="polite">
        {status === "ok" && (
          <p className="text-sm font-medium text-emerald-600">
            Thank you. We received your request and will reply shortly
          </p>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-[#E50914]">
            There was an error. Please try again
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-black/60">
        Drywall has no extra charge. Concrete tile stone or metal has a 25 surcharge. Cable concealment is 60 per TV. Fireplace handling from 25 extra
      </p>
    </form>
  )
}
