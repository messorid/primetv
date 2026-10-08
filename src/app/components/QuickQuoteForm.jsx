"use client"

// Quick quote: the short form on the homepage and every city page.
//
// Same payloads and the same analytics events as before; what changed is how
// it treats the person filling it in. Labels are connected to their fields,
// the phone formats itself and stops at ten digits, inputs are 16px so iOS
// does not zoom in, and pressing the button with something missing now says
// what is missing instead of sitting there greyed out.

import Link from "next/link"
import { useId, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  TextField, PhoneField, EmailField, TextAreaField, ChoiceGroup,
  ErrorSummary, FormAlert, PrimaryButton, focusField,
} from "./forms/FormKit"
import {
  isValidUSPhone, isValidEmail, isValidName, isValidZip, validate, MESSAGES,
} from "../lib/formValidation"

function gtag(...args) {
  if (typeof window !== "undefined" && window.gtag) window.gtag(...args)
}

const PHONE_DISPLAY = "(615) 669-0251"
const PHONE_HREF = "tel:+16156690251"

const INSTALL_SERVICES = [
  { value: "furniture",      label: "Furniture Assembly",       emoji: "🪑" },
  { value: "mirror_picture", label: "Picture / Mirror Hanging", emoji: "🪞" },
  { value: "shelves_wall",   label: "Shelves & Wall Install",   emoji: "📐" },
  { value: "ceiling_fan",    label: "Ceiling Fan Install",      emoji: "🌀" },
  { value: "gazebo",         label: "Gazebo / Pergola",         emoji: "⛺" },
  { value: "playset",        label: "Playground / Playset",     emoji: "🛝" },
  { value: "other",          label: "Other Installation",       emoji: "🔧" },
]

const TV_SIZES = [
  { value: "up_to_55", label: "Up to 55 in", desc: "From $110" },
  { value: "over_55",  label: "Over 55 in",  desc: "From $140" },
]

const TV_LABELS = { tvSize: "TV size", location: "ZIP or city", name: "Name", phone: "Phone", email: "Email" }
const INSTALL_LABELS = { service: "Service", name: "Name", phone: "Phone", email: "Email" }

const EMPTY_TV = { tvSize: "", location: "", name: "", phone: "", email: "" }
const EMPTY_INSTALL = { description: "", name: "", phone: "", email: "" }

const isZip = v => isValidZip(v)

function tvErrors(f) {
  return validate([
    ["tvSize",   !!f.tvSize,                      MESSAGES.choose("a TV size")],
    ["location", f.location.trim().length >= 3,   "Enter your ZIP code or city, like 37209 or Franklin."],
    ["name",     isValidName(f.name),             MESSAGES.name],
    ["phone",    isValidUSPhone(f.phone),         MESSAGES.phone],
    ["email",    isValidEmail(f.email),           MESSAGES.email],
  ])
}

function installErrors(service, f) {
  return validate([
    ["service", !!service,                MESSAGES.choose("the service you need")],
    ["name",    isValidName(f.name),      MESSAGES.name],
    ["phone",   isValidUSPhone(f.phone),  MESSAGES.phone],
    ["email",   isValidEmail(f.email),    MESSAGES.email],
  ])
}

export default function QuickQuoteForm({ onSubmitted }) {
  const uid = useId()
  const fid = name => `${uid}-${name}`

  const [quoteType, setQuoteType] = useState("tv") // "tv" | "installation"
  const [status, setStatus] = useState("idle")     // idle | sending | ok | error
  const [formStarted, setFormStarted] = useState(false)

  const [form, setForm] = useState(EMPTY_TV)
  const [installService, setInstallService] = useState("")
  const [installForm, setInstallForm] = useState(EMPTY_INSTALL)

  // Errors show for a field once it has been left, or for every field once
  // the person has tried to submit. Nobody is told off mid-keystroke.
  const [touched, setTouched] = useState({})
  const [tried, setTried] = useState(false)

  const errorsTV = useMemo(() => tvErrors(form), [form])
  const errorsInstall = useMemo(() => installErrors(installService, installForm), [installService, installForm])
  const errors = quoteType === "tv" ? errorsTV : errorsInstall
  const shown = field => (tried || touched[field]) ? errors[field] : undefined
  const blur = field => () => setTouched(t => ({ ...t, [field]: true }))

  function switchTab(tab) {
    setQuoteType(tab)
    setStatus("idle")
    setTried(false)
    setTouched({})
  }

  // Arrow keys move between the two tabs, as a tab list should.
  function onTabKey(e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const next = quoteType === "tv" ? "installation" : "tv"
    switchTab(next)
    document.getElementById(fid(`tab-${next}`))?.focus()
  }

  async function onSubmitTV(e) {
    e.preventDefault()
    setTried(true)
    if (Object.keys(errorsTV).length) return
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
      setForm(EMPTY_TV)
      setTried(false)
      setTouched({})
      onSubmitted?.()
    } catch {
      setStatus("error")
    }
  }

  async function onSubmitInstall(e) {
    e.preventDefault()
    setTried(true)
    if (Object.keys(errorsInstall).length) return
    setStatus("sending")
    try {
      const res = await fetch("/api/installation-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: installService,
          answers: { description: installForm.description },
          contact: { name: installForm.name.trim(), phone: installForm.phone.trim(), email: installForm.email.trim() },
        }),
      })
      if (!res.ok) throw new Error()
      setStatus("ok")
      setInstallForm(EMPTY_INSTALL)
      setInstallService("")
      setTried(false)
      setTouched({})
    } catch {
      setStatus("error")
    }
  }

  const tabClass = active =>
    `min-h-[56px] px-3 text-[15px] font-bold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/60 ${
      active ? "bg-[#E50914] text-white" : "bg-white text-black/55 hover:bg-black/[0.03] hover:text-black"
    }`

  return (
    <section id="quick-quote" className="relative w-full bg-gray-50 py-14 text-black sm:py-16">
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-[350px] w-[700px] max-w-full -translate-x-1/2 bg-red-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-xl px-4 sm:px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
          onFocus={() => {
            if (!formStarted) {
              setFormStarted(true)
              gtag("event", "quote_form_start", { event_category: "engagement", event_label: "quick_quote" })
            }
          }}
        >
          {/* Tabs */}
          <div role="tablist" aria-label="Type of quote" className="grid grid-cols-2 border-b border-black/10">
            <button
              type="button" role="tab" id={fid("tab-tv")}
              aria-selected={quoteType === "tv"} aria-controls={fid("panel-tv")}
              tabIndex={quoteType === "tv" ? 0 : -1}
              onClick={() => switchTab("tv")} onKeyDown={onTabKey}
              className={tabClass(quoteType === "tv")}
            >
              <span aria-hidden="true">📺 </span>TV Mounting
            </button>
            <button
              type="button" role="tab" id={fid("tab-installation")}
              aria-selected={quoteType === "installation"} aria-controls={fid("panel-installation")}
              tabIndex={quoteType === "installation" ? 0 : -1}
              onClick={() => switchTab("installation")} onKeyDown={onTabKey}
              className={`${tabClass(quoteType === "installation")} border-l border-black/10`}
            >
              <span aria-hidden="true">🔧 </span>Home Installation
            </button>
          </div>

          {status === "ok" ? (
            <SuccessPanel onAgain={() => setStatus("idle")} />
          ) : quoteType === "tv" ? (
            // ── TV QUOTE ──────────────────────────────────────────────────────
            <form
              id={fid("panel-tv")} role="tabpanel" aria-labelledby={fid("tab-tv")}
              onSubmit={onSubmitTV} noValidate className="p-5 sm:p-6"
            >
              <h3 className="text-xl font-extrabold">Quick TV quote</h3>
              <p className="mt-1 text-sm leading-relaxed text-black/60">
                Five quick answers. We reply with your price and available times.
                Fields marked <span className="text-[#E50914]">*</span> are required.
              </p>

              <div className="mt-6 space-y-5">
                <ChoiceGroup
                  id={fid("tvSize")} legend="TV size" required columns={2} size="sm"
                  options={TV_SIZES} value={form.tvSize}
                  onChange={v => setForm(f => ({ ...f, tvSize: v }))}
                  hint="Starting prices, per TV. Your final price is confirmed before any work."
                  error={shown("tvSize")}
                />
                <TextField
                  id={fid("location")} label="ZIP code or city" required
                  value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))}
                  onBlur={blur("location")} error={shown("location")}
                  autoComplete="postal-code" placeholder="37209 or Franklin"
                  hint="So we can confirm we cover your area." enterKeyHint="next"
                />
                <TextField
                  id={fid("name")} label="Full name" required
                  value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))}
                  onBlur={blur("name")} error={shown("name")}
                  autoComplete="name" autoCapitalize="words" placeholder="Jane Smith" enterKeyHint="next"
                />
                <PhoneField
                  id={fid("phone")} label="Mobile phone" required
                  value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))}
                  onBlur={blur("phone")} error={shown("phone")} enterKeyHint="next"
                />
                <EmailField
                  id={fid("email")} label="Email" required
                  value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))}
                  onBlur={blur("email")} error={shown("email")} enterKeyHint="send"
                  hint="Where we can reach you with your quote."
                />
              </div>

              {tried && (
                <div className="mt-5">
                  <ErrorSummary errors={errorsTV} labels={TV_LABELS} onJump={k => focusField(fid(k))} />
                </div>
              )}
              {status === "error" && <SendError />}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton type="submit" busy={status === "sending"} className="w-full sm:w-auto">
                  Get my quote
                </PrimaryButton>
                <Link href="/book"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-black/12 px-6 text-base font-semibold transition hover:bg-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/15">
                  Book installation
                </Link>
              </div>

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-[13px] leading-relaxed text-amber-900">
                  <span className="font-bold">Prices start from the amounts shown.</span> Your final
                  price depends on the difficulty of the installation, the wall type and the mount
                  or bracket being installed. Pull-down mantel mounts (MantelMount and similar) are
                  priced separately. One of our sales representatives confirms your exact price
                  before any work begins.
                </p>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-black/55">
                Drywall has no extra charge. Concrete, tile, stone or metal starts at a $25 surcharge.
                Cable concealment from $60 per TV. Fireplace handling from $25 extra.
                Samsung Frame TV and mantel mounts are quoted separately.
              </p>
            </form>
          ) : (
            // ── HOME INSTALLATION QUOTE ──────────────────────────────────────
            <form
              id={fid("panel-installation")} role="tabpanel" aria-labelledby={fid("tab-installation")}
              onSubmit={onSubmitInstall} noValidate className="p-5 sm:p-6"
            >
              <h3 className="text-xl font-extrabold">Home installation quote</h3>
              <p className="mt-1 text-sm leading-relaxed text-black/60">
                Pick the service, tell us a little about it, and we reply with pricing.
                Fields marked <span className="text-[#E50914]">*</span> are required.
              </p>

              <div className="mt-6 space-y-5">
                <ChoiceGroup
                  id={fid("service")} legend="What do you need installed?" required columns={1} size="sm"
                  options={INSTALL_SERVICES} value={installService} onChange={setInstallService}
                  error={shown("service")}
                />
                {installService && (
                  <TextAreaField
                    id={fid("description")} label="Brief description" optional
                    value={installForm.description}
                    onChange={v => setInstallForm(f => ({ ...f, description: v }))}
                    placeholder="E.g. IKEA KALLAX shelf unit, 1 piece"
                    hint="Brand, model or a link helps us quote accurately."
                    rows={3} maxLength={600}
                  />
                )}
                <TextField
                  id={fid("name")} label="Full name" required
                  value={installForm.name} onChange={v => setInstallForm(f => ({ ...f, name: v }))}
                  onBlur={blur("name")} error={shown("name")}
                  autoComplete="name" autoCapitalize="words" placeholder="Jane Smith" enterKeyHint="next"
                />
                <PhoneField
                  id={fid("phone")} label="Mobile phone" required
                  value={installForm.phone} onChange={v => setInstallForm(f => ({ ...f, phone: v }))}
                  onBlur={blur("phone")} error={shown("phone")} enterKeyHint="next"
                />
                <EmailField
                  id={fid("email")} label="Email" required
                  value={installForm.email} onChange={v => setInstallForm(f => ({ ...f, email: v }))}
                  onBlur={blur("email")} error={shown("email")} enterKeyHint="send"
                  hint="Where we can reach you with your quote."
                />
              </div>

              {tried && (
                <div className="mt-5">
                  <ErrorSummary errors={errorsInstall} labels={INSTALL_LABELS} onJump={k => focusField(fid(k))} />
                </div>
              )}
              {status === "error" && <SendError />}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton type="submit" busy={status === "sending"} className="w-full sm:w-auto">
                  Request quote
                </PrimaryButton>
                <Link href="/get-installation-quote"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-black/12 px-6 text-base font-semibold transition hover:bg-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/15">
                  Detailed quote form →
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function SuccessPanel({ onAgain }) {
  return (
    <div role="status" className="p-6 text-center sm:p-8">
      <div aria-hidden="true" className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">✓</div>
      <h3 className="text-xl font-extrabold">Request received — thank you!</h3>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-black/65">
        We&rsquo;ll reply with your price and available times. Need it sooner? Call or text{" "}
        <a href={PHONE_HREF} className="font-semibold text-[#E50914] underline underline-offset-2">{PHONE_DISPLAY}</a>.
      </p>
      <button type="button" onClick={onAgain}
        className="mt-6 inline-flex min-h-[48px] items-center rounded-full border-2 border-black/12 px-6 text-sm font-semibold hover:bg-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/15">
        Send another request
      </button>
    </div>
  )
}

function SendError() {
  return (
    <div className="mt-5">
      <FormAlert tone="error">
        We couldn&rsquo;t send that just now — your details are still here, so try again in a moment.
        Or call or text us at{" "}
        <a href={PHONE_HREF} className="font-semibold underline underline-offset-2">{PHONE_DISPLAY}</a>.
      </FormAlert>
    </div>
  )
}
