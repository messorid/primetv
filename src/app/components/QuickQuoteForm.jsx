"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { motion } from "framer-motion"

function gtag(...args) {
  if (typeof window !== "undefined" && window.gtag) window.gtag(...args)
}

const INSTALL_SERVICES = [
  { value: "furniture",      label: "Furniture Assembly",       emoji: "🪑" },
  { value: "mirror_picture", label: "Picture / Mirror Hanging", emoji: "🪞" },
  { value: "shelves_wall",   label: "Shelves & Wall Install",   emoji: "📐" },
  { value: "gazebo",         label: "Gazebo / Pergola",         emoji: "⛺" },
  { value: "other",          label: "Other Installation",       emoji: "🔧" },
]

export default function QuickQuoteForm({ onSubmitted }) {

  const [quoteType, setQuoteType] = useState("tv") // "tv" | "installation"
  const [status, setStatus] = useState("idle")
  const [formStarted, setFormStarted] = useState(false)

  // TV form state
  const [form, setForm] = useState({ tvSize: "", location: "", name: "", phone: "", email: "" })

  // Installation form state
  const [installService, setInstallService] = useState("")
  const [installForm, setInstallForm] = useState({ description: "", name: "", phone: "", email: "" })

  const tvValid = useMemo(() =>
    form.tvSize && form.location.trim() && form.name.trim() && form.phone.trim() && form.email.trim(),
    [form]
  )

  const installValid = useMemo(() =>
    installService && installForm.name.trim() && installForm.phone.trim() && installForm.email.trim(),
    [installService, installForm]
  )

  const basePrice =
    form.tvSize === "up_to_55" ? "From $110 per TV" :
    form.tvSize === "over_55"  ? "From $140 per TV" : ""

  function isZip(v) { return /^\d{5}$/.test(v.trim()) }

  async function onSubmitTV(e) {
    e.preventDefault()
    if (!tvValid) return
    setStatus("sending")
    try {
      const payload = {
        service: form.tvSize === "up_to_55" ? "TV up to 55" : "TV over 55",
        tvSize: form.tvSize === "up_to_55" ? "Up to 55 inches" : "Over 55 inches",
        zip: isZip(form.location) ? form.location.trim() : "",
        address: isZip(form.location) ? "" : form.location.trim(),
        name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
      }
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      gtag("event", "quote_form_submit", { event_category: "lead", event_label: "quick_quote" })
      setStatus("ok")
      setForm({ tvSize: "", location: "", name: "", phone: "", email: "" })
      onSubmitted?.()
    } catch {
      setStatus("error")
    }
  }

  async function onSubmitInstall(e) {
    e.preventDefault()
    if (!installValid) return
    setStatus("sending")
    try {
      const res = await fetch("/api/installation-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: installService,
          answers: { description: installForm.description },
          contact: { name: installForm.name, phone: installForm.phone, email: installForm.email },
        }),
      })
      if (!res.ok) throw new Error()
      setStatus("ok")
      setInstallForm({ description: "", name: "", phone: "", email: "" })
      setInstallService("")
    } catch {
      setStatus("error")
    }
  }

  function switchTab(tab) {
    setQuoteType(tab)
    setStatus("idle")
  }

  return (
    <section id="quick-quote" className="relative w-full bg-gray-50 text-black py-16">
      <div aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[350px] bg-red-500/10 blur-3xl" />

      <div className="relative max-w-xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-black/10 bg-white shadow-lg overflow-hidden"
          onFocus={() => {
            if (!formStarted) {
              setFormStarted(true)
              gtag("event", "quote_form_start", { event_category: "engagement", event_label: "quick_quote" })
            }
          }}
        >
          {/* Tab switcher */}
          <div className="grid grid-cols-2 border-b border-black/8">
            <button
              type="button"
              onClick={() => switchTab("tv")}
              className={`py-3.5 text-sm font-bold transition-colors ${
                quoteType === "tv"
                  ? "bg-[#E50914] text-white"
                  : "bg-white text-black/50 hover:text-black hover:bg-black/3"
              }`}
            >
              📺 TV Mounting
            </button>
            <button
              type="button"
              onClick={() => switchTab("installation")}
              className={`py-3.5 text-sm font-bold transition-colors border-l border-black/8 ${
                quoteType === "installation"
                  ? "bg-[#E50914] text-white"
                  : "bg-white text-black/50 hover:text-black hover:bg-black/3"
              }`}
            >
              🔧 Home Installation
            </button>
          </div>

          {/* ── TV QUOTE ── */}
          {quoteType === "tv" && (
            <form onSubmit={onSubmitTV} className="p-6">
              <h3 className="text-xl font-bold">Quick TV quote</h3>
              <p className="mt-1 text-sm text-black/60">Just the basics. We reply with price and availability.</p>

              <div className="mt-5">
                <label className="text-sm font-semibold">TV size</label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setForm({ ...form, tvSize: "up_to_55" })}
                    className={`rounded-xl border py-3 text-sm font-semibold transition ${form.tvSize === "up_to_55" ? "bg-[#E50914] text-white border-[#E50914]" : "border-black/15 hover:bg-black/5"}`}>
                    Up to 55 in
                  </button>
                  <button type="button" onClick={() => setForm({ ...form, tvSize: "over_55" })}
                    className={`rounded-xl border py-3 text-sm font-semibold transition ${form.tvSize === "over_55" ? "bg-[#E50914] text-white border-[#E50914]" : "border-black/15 hover:bg-black/5"}`}>
                    Over 55 in
                  </button>
                </div>
                {basePrice && <p className="mt-2 text-xs text-black/60">{basePrice}</p>}
              </div>

              <div className="mt-5 space-y-4">
                <Input label="ZIP or City" value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="Example 37209 or Nashville" />
                <Input label="Full name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
                <Input label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="Mobile for updates" />
                <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={!tvValid || status === "sending"}
                  className="rounded-full bg-[#E50914] px-7 py-3 font-semibold text-white hover:shadow-lg hover:shadow-red-500/30 transition disabled:opacity-60">
                  {status === "sending" ? "Sending..." : "Get my quote"}
                </button>
                <Link href="/book" className="rounded-full border border-black/15 px-7 py-3 font-semibold hover:bg-black/5 transition text-center">
                  Book installation
                </Link>
              </div>

              <div className="mt-4 min-h-6">
                {status === "ok" && <p className="text-sm font-medium text-emerald-600">Thank you. We received your request.</p>}
                {status === "error" && <p className="text-sm font-medium text-[#E50914]">Something went wrong. Please try again.</p>}
              </div>

              <p className="mt-4 text-xs text-black/55">
                Drywall has no extra charge. Concrete, tile, stone or metal has a $25 surcharge.
                Cable concealment is $60 per TV. Fireplace handling from $25 extra.
              </p>
            </form>
          )}

          {/* ── INSTALLATION QUOTE ── */}
          {quoteType === "installation" && (
            <form onSubmit={onSubmitInstall} className="p-6">
              <h3 className="text-xl font-bold">Home Installation quote</h3>
              <p className="mt-1 text-sm text-black/60">Tell us what you need and we'll reply with pricing.</p>

              {/* Service selector */}
              <div className="mt-5">
                <label className="text-sm font-semibold">What do you need installed?</label>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {INSTALL_SERVICES.map(s => (
                    <button key={s.value} type="button" onClick={() => setInstallService(s.value)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold text-left transition ${
                        installService === s.value
                          ? "bg-[#E50914] text-white border-[#E50914]"
                          : "border-black/15 hover:bg-black/5"
                      }`}>
                      <span>{s.emoji}</span>
                      {s.label}
                      {installService === s.value && <span className="ml-auto">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional description */}
              {installService && (
                <div className="mt-4">
                  <label className="text-sm font-semibold">Brief description <span className="text-black/40 font-normal">(optional)</span></label>
                  <textarea
                    value={installForm.description}
                    onChange={e => setInstallForm({ ...installForm, description: e.target.value })}
                    placeholder="E.g. IKEA KALLAX shelf unit, 1 piece..."
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
                  />
                </div>
              )}

              <div className="mt-4 space-y-3">
                <Input label="Full name" value={installForm.name} onChange={v => setInstallForm({ ...installForm, name: v })} />
                <Input label="Phone" value={installForm.phone} onChange={v => setInstallForm({ ...installForm, phone: v })} placeholder="Mobile for updates" />
                <Input label="Email" type="email" value={installForm.email} onChange={v => setInstallForm({ ...installForm, email: v })} />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={!installValid || status === "sending"}
                  className="rounded-full bg-[#E50914] px-7 py-3 font-semibold text-white hover:shadow-lg hover:shadow-red-500/30 transition disabled:opacity-60">
                  {status === "sending" ? "Sending..." : "Request quote"}
                </button>
                <Link href="/get-installation-quote" className="rounded-full border border-black/15 px-7 py-3 font-semibold hover:bg-black/5 transition text-center text-sm">
                  Full quote form →
                </Link>
              </div>

              <div className="mt-4 min-h-6">
                {status === "ok" && <p className="text-sm font-medium text-emerald-600">Thank you! We'll get back to you with pricing shortly.</p>}
                {status === "error" && <p className="text-sm font-medium text-[#E50914]">Something went wrong. Please try again.</p>}
              </div>
            </form>
          )}

        </motion.div>
      </div>
    </section>
  )
}

function Input({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="mt-1 rounded-xl border border-black/15 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
      />
    </div>
  )
}
