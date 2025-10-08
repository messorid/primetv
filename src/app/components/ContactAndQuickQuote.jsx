"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

const PHONE = process.env.NEXT_PUBLIC_PRIMETV_PHONE || "+1-000-000-0000"

export default function ContactAndQuickQuote() {
  const [status, setStatus] = useState("idle") // idle | sending | ok | error
  const [form, setForm] = useState({
    service: "",
    tvSize: "",
    mountType: "",
    zip: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  const smsHref = useMemo(() => {
    const msg = `Hi, I would like a quick TV mounting quote.
Service: ${form.service || "-"}
TV size: ${form.tvSize || "-"}
ZIP: ${form.zip || "-"}
Name: ${form.name || "-"}`.trim()
    return `sms:${PHONE}?&body=${encodeURIComponent(msg)}`
  }, [form, PHONE])

  const valid = useMemo(() => {
    return form.service && form.tvSize && form.name && (form.phone || form.email)
  }, [form])

  async function onSubmit(e) {
    e.preventDefault()
    if (!valid) return
    setStatus("sending")
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Request failed")
      setStatus("ok")
      setForm({
        service: "",
        tvSize: "",
        mountType: "",
        zip: "",
        address: "",
        preferredDate: "",
        preferredTime: "",
        name: "",
        phone: "",
        email: "",
        notes: "",
      })
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="w-full bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <header className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold">Contact and quick quote</h2>
          <p className="mt-2 text-black/70">
            Call or send a text message, or fill this short form to get a fast quote
          </p>
        </header>

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* Left column: contact options */}
          <div className="space-y-4">
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

              <p className="mt-3 text-xs text-black/60">
                Prices do not include the bracket mount. We do not sell mounts but we help you choose the right model
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">What to have ready</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-black/80 space-y-1">
                <li>TV size and wall material</li>
                <li>Address or ZIP code</li>
                <li>Preferred date and time window</li>
                <li>Add ons like cable concealment or fireplace</li>
              </ul>
            </div>
          </div>

          {/* Right column: quick quote form */}
          <form onSubmit={onSubmit} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold">Quick quote form</h3>
            <p className="mt-1 text-sm text-black/70">
              Fill only the basics. We will reply with price and availability
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* service */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Service</label>
                <select
                  required
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  <option value="">Select service</option>
                  <option value="TV up to 55">TV up to 55 inches</option>
                  <option value="TV over 55">TV over 55 inches</option>
                  <option value="Multi TV or commercial">Multi TV or commercial</option>
                </select>
              </div>

              {/* tv size */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">TV size</label>
                <input
                  required
                  placeholder="Example 55"
                  value={form.tvSize}
                  onChange={(e) => setForm({ ...form, tvSize: e.target.value })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              {/* mount type */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Mount type</label>
                <select
                  value={form.mountType}
                  onChange={(e) => setForm({ ...form, mountType: e.target.value })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  <option value="">Customer has a mount</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Tilt">Tilt</option>
                  <option value="Full motion">Full motion</option>
                  <option value="Need guidance">Need guidance</option>
                </select>
              </div>

              {/* zip */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">ZIP</label>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  placeholder="Example 37209"
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value.replace(/\D/g, "") })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              {/* address */}
              <div className="sm:col-span-2 flex flex-col">
                <label className="text-sm font-medium">Address</label>
                <input
                  placeholder="Street and city"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              {/* date */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Preferred date</label>
                <input
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              {/* time window */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Preferred time window</label>
                <select
                  value={form.preferredTime}
                  onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  <option value="">Select a window</option>
                  <option value="9 to 12">9 to 12</option>
                  <option value="12 to 3">12 to 3</option>
                  <option value="3 to 6">3 to 6</option>
                </select>
              </div>

              {/* contact info */}
              <div className="flex flex-col">
                <label className="text-sm font-medium">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium">Phone</label>
                <input
                  placeholder="Mobile for updates"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Optional"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              {/* notes */}
              <div className="sm:col-span-2 flex flex-col">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Wall type, over fireplace, cable concealment, parking or access details"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>

            {/* submit */}
            <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={!valid || status === "sending"}
                data-ga="cta_quote_submit"
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

            {/* status */}
            <div className="mt-3 min-h-6" aria-live="polite">
              {status === "ok" && (
                <p className="text-sm font-medium text-emerald-600">
                  Thank you. We received your request and will reply shortly
                </p>
              )}
              {status === "error" && (
                <p className="text-sm font-medium text-[#E50914]">
                  There was an error. Please try again or use Call or Text message
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-black/60">
              Drywall has no extra charge. Concrete tile stone or metal has a 25 surcharge. Cable concealment is 60 per TV. Fireplace handling from 25 extra
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
