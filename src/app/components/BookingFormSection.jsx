"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { validateCoupon } from "@/app/lib/coupons"

const STEPS = ["Date & Time", "TV Details", "Address", "Your Info"]

const TV_SIZES = [
  { label: '20" – 55"', price: "$110" },
  { label: '60" – 70"', price: "$150" },
  { label: '75"+',      price: "Ask price" },
]

const WALL_TYPES = [
  { label: "Drywall",       surcharge: 0   },
  { label: "Brick / Stone", surcharge: 25  },
  { label: "Concrete",      surcharge: 25  },
  { label: "Tile",          surcharge: 25  },
  { label: "Metal / Steel", surcharge: 25  },
]

const PROMOS = [
  { label: 'Promo 2 TVs up to 55"',            price: "$199" },
  { label: 'Promo 2 TVs over 55" (up to 70")', price: "$260" },
]

const REFERRAL_OPTIONS = ["Google", "Instagram", "Facebook", "TikTok", "YouTube", "Friend", "Other"]
const PAYMENT_OPTIONS  = ["Cash", "Zelle", "Card", "PayPal", "Venmo", "Other"]
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
]

function emptyTv() {
  return { size: "", exactSize: "", wallType: "", comments: "" }
}

export default function BookingFormSection() {
  const [step,      setStep]      = useState(0)
  const [direction, setDirection] = useState(1)
  const [status,    setStatus]    = useState("idle") // idle | sending | ok | error
  const topRef = useRef(null)

  useEffect(() => {
    if (status === "ok") {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [status])

  const [selectedPromo,  setSelectedPromo]  = useState("")
  const [couponCode,     setCouponCode]     = useState("")
  const [couponStatus,   setCouponStatus]   = useState("idle") // idle | valid | invalid
  const [appliedCoupon,  setAppliedCoupon]  = useState(null)
  const [couponComment,  setCouponComment]  = useState("")
  const [date,           setDate]           = useState("")
  const [timePreference, setTimePreference] = useState("")
  const [tvs,            setTvs]            = useState([emptyTv()])
  const [address,        setAddress]        = useState({ street: "", apt: "", city: "", state: "TN", zip: "" })
  const [info,           setInfo]           = useState({
    firstName: "", lastName: "", email: "", phone: "",
    referral: "", payment: "", agreed: false,
  })

  const today = new Date().toISOString().split("T")[0]

  const skipTvStep = !!selectedPromo || !!appliedCoupon?.skipTvDetails

  // Step 1 is valid if: promo or skipTvDetails coupon active, OR TVs all filled out
  const stepValid = [
    date && timePreference,
    skipTvStep || (tvs.length > 0 && tvs.every(tv => tv.size && tv.wallType)),
    address.street.trim() && address.city.trim() && address.state && /^\d{5}$/.test(address.zip),
    info.firstName.trim() && info.lastName.trim() && info.email.includes("@") &&
      info.phone.trim() && info.referral && info.payment && info.agreed,
  ]

  // Skip TV Details step when a promo or skipTvDetails coupon is active
  function goNext() {
    if (!stepValid[step]) return
    setDirection(1)
    setStep(s => (s === 0 && skipTvStep ? 2 : s + 1))
  }

  function goBack() {
    setDirection(-1)
    setStep(s => (s === 2 && skipTvStep ? 0 : s - 1))
  }

  function addTv()           { setTvs(prev => [...prev, emptyTv()]) }
  function removeTv(i)       { setTvs(prev => prev.filter((_, idx) => idx !== i)) }
  function updateTv(i, f, v) { setTvs(prev => prev.map((tv, idx) => idx === i ? { ...tv, [f]: v } : tv)) }

  function handlePromoToggle(label) {
    setSelectedPromo(p => p === label ? "" : label)
  }

  function applyCoupon() {
    const result = validateCoupon(couponCode)
    if (result) {
      setAppliedCoupon(result)
      setCouponStatus("valid")
    } else {
      setAppliedCoupon(null)
      setCouponStatus("invalid")
    }
  }

  function clearCoupon() {
    setCouponCode("")
    setCouponStatus("idle")
    setAppliedCoupon(null)
    setCouponComment("")
  }

  async function submit() {
    if (!stepValid[3]) return
    setStatus("sending")
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPromo,
          couponCode:         appliedCoupon ? couponCode : "",
          appliedCouponLabel: appliedCoupon?.offer ?? "",
          couponComment:      appliedCoupon?.skipTvDetails ? couponComment : "",
          date,
          timePreference,
          tvs: skipTvStep ? [] : tvs,
          address,
          info,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus("ok")
    } catch {
      setStatus("error")
    }
  }

  /* ── Success ──────────────────────────────────────────────────────────── */
  if (status === "ok") {
    return (
      <section ref={topRef} className="relative w-full bg-gray-50 py-24 text-black">
        <div className="relative max-w-md mx-auto px-5 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-6xl mb-5"
          >
            📺
          </motion.div>
          <h2 className="text-3xl font-extrabold">Booking Confirmed!</h2>
          <p className="mt-3 text-black/60 leading-relaxed">
            We&apos;ve sent a confirmation to <strong>{info.email}</strong>.
            Our team will contact you shortly to confirm your appointment.
          </p>
          <p className="mt-4 text-sm text-black/50">
            Questions? Call us at{" "}
            <a href="tel:+16156690251" className="text-[#E50914] font-semibold">
              (615) 669-0251
            </a>
          </p>
        </div>
      </section>
    )
  }

  /* ── Form ─────────────────────────────────────────────────────────────── */
  return (
    <section id="book" className="relative w-full bg-gray-50 text-black py-16">

      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[350px] bg-red-500/10 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-xl mx-auto px-5">

        {/* header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Book Your Installation</h1>
          <p className="mt-1 text-black/55 text-sm">Fast and easy — takes less than 2 minutes</p>
        </div>

        {/* progress */}
        <div className="flex items-center mb-7">
          {STEPS.map((label, i) => {
            const skipped = i === 1 && skipTvStep
            const passed  = i < step || (skipped && step > 1)
            const active  = i === step && !skipped
            return (
              <div key={i} className="flex-1 flex flex-col items-center relative">
                {i < STEPS.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-[2px] transition-colors duration-500 ${
                      passed ? "bg-[#E50914]" : "bg-black/10"
                    }`}
                  />
                )}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    skipped
                      ? "bg-black/8 text-black/25"
                      : passed
                      ? "bg-[#E50914] text-white"
                      : active
                      ? "bg-[#E50914] text-white ring-4 ring-red-200"
                      : "bg-black/10 text-black/40"
                  }`}
                >
                  {passed && !skipped ? "✓" : skipped ? "—" : i + 1}
                </div>
                <span
                  className={`mt-1 text-[11px] font-medium hidden sm:block ${
                    skipped
                      ? "text-black/25"
                      : active
                      ? "text-black"
                      : "text-black/35"
                  }`}
                >
                  {skipped ? "In promo" : label}
                </span>
              </div>
            )
          })}
        </div>

        {/* animated card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={{
              enter:  d => ({ opacity: 0, x: d > 0 ? 50 : -50 }),
              center: { opacity: 1, x: 0 },
              exit:   d => ({ opacity: 0, x: d > 0 ? -50 : 50 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28 }}
            className="rounded-2xl border border-black/10 bg-white p-6 shadow-lg"
          >

            {/* ── STEP 0 — Date & Time ── */}
            {step === 0 && (
              <div>
                <StepHeader title="When do you need our services?" sub="Choose a date and preferred time window" />

                {/* PROMO */}
                <div className="mb-5 rounded-xl border border-black/10 bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E50914] mb-3">Promos</p>
                  <div className="space-y-2.5">
                    {PROMOS.map(promo => (
                      <label key={promo.label} className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => handlePromoToggle(promo.label)}>
                        <div className={`w-5 h-5 flex-none rounded border-2 flex items-center justify-center transition ${
                          selectedPromo === promo.label
                            ? "bg-[#E50914] border-[#E50914]"
                            : "border-black/25 group-hover:border-[#E50914]/60"
                        }`}>
                          {selectedPromo === promo.label && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-black/80 flex-1">{promo.label}</span>
                        <span className="text-sm font-bold text-black">{promo.price}</span>
                      </label>
                    ))}
                  </div>

                  {selectedPromo && (() => {
                    const promo = PROMOS.find(p => p.label === selectedPromo)
                    return (
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-[#E50914]/8 border border-[#E50914]/20 px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold text-[#E50914] uppercase tracking-wide">Package total</p>
                          <p className="text-xs text-black/55 mt-0.5">TV details included in price</p>
                        </div>
                        <span className="text-2xl font-extrabold text-[#E50914]">{promo?.price}</span>
                      </div>
                    )
                  })()}

                  {!selectedPromo && (
                    <p className="mt-2.5 text-xs text-black/40">Select a promo if it applies (optional)</p>
                  )}

                  {/* Coupon code */}
                  <div className="mt-3 pt-3 border-t border-black/8">
                    <label className="text-xs font-semibold text-black/60">Coupon Code (optional)</label>

                    {appliedCoupon ? (
                      <div className="mt-1.5 rounded-xl border border-emerald-300 bg-emerald-50 overflow-hidden">
                        <div className="flex items-center gap-2 px-3 py-2.5">
                          <svg className="w-4 h-4 text-emerald-600 flex-none" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-emerald-700">{appliedCoupon.offer}</p>
                          </div>
                          <button type="button" onClick={clearCoupon}
                            className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex-none">
                            Remove
                          </button>
                        </div>
                        {appliedCoupon.skipTvDetails && (
                          <div className="border-t border-emerald-200 px-3 pb-3 pt-2.5 bg-white/60">
                            <label className="text-xs font-semibold text-emerald-800">
                              Additional comments <span className="font-normal text-black/40">(optional)</span>
                            </label>
                            <textarea
                              rows={3}
                              value={couponComment}
                              onChange={e => setCouponComment(e.target.value)}
                              placeholder="Anything you'd like us to know about the installation…"
                              className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-1.5 flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponStatus("idle") }}
                          placeholder="Enter coupon code"
                          className={`flex-1 rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 uppercase placeholder:normal-case placeholder:text-black/30 transition ${
                            couponStatus === "invalid"
                              ? "border-red-400 focus:ring-red-200"
                              : "border-black/15 focus:ring-red-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={!couponCode.trim()}
                          className="rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-black/80 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Apply
                        </button>
                      </div>
                    )}

                    {couponStatus === "invalid" && !appliedCoupon && (
                      <p className="mt-1.5 text-xs text-red-500 font-medium">Invalid code. Please check and try again.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold">Preferred Date</label>
                    <input
                      type="date"
                      value={date}
                      min={today}
                      onChange={e => setDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/15 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Time Preference</label>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {["Morning (8am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)", "Flexible"].map(t => (
                        <Chip key={t} label={t} active={timePreference === t} onClick={() => setTimePreference(t)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 1 — TV Details (only shown when no promo) ── */}
            {step === 1 && !selectedPromo && (
              <div>
                <StepHeader title="TV Details" sub="Tell us about each TV you need mounted" />
                <div className="space-y-5">
                  {tvs.map((tv, i) => (
                    <div key={i} className="rounded-xl border border-black/10 bg-gray-50 p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">TV #{i + 1}</span>
                        {tvs.length > 1 && (
                          <button type="button" onClick={() => removeTv(i)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold">
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Size */}
                      <div>
                        <label className="text-xs font-semibold text-black/60 uppercase tracking-wide">TV Size</label>
                        <div className="mt-1.5 grid grid-cols-3 gap-2">
                          {TV_SIZES.map(s => (
                            <button
                              key={s.label}
                              type="button"
                              onClick={() => updateTv(i, "size", s.label)}
                              className={`rounded-xl border py-2 px-2 text-left transition ${
                                tv.size === s.label
                                  ? "bg-[#E50914] text-white border-[#E50914]"
                                  : "border-black/15 bg-white hover:bg-black/5"
                              }`}
                            >
                              <span className="block text-xs font-semibold">{s.label}</span>
                              <span className={`block text-[11px] mt-0.5 ${tv.size === s.label ? "text-white/80" : "text-black/45"}`}>
                                {s.price}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="number"
                            min="20"
                            max="120"
                            value={tv.exactSize}
                            onChange={e => updateTv(i, "exactSize", e.target.value)}
                            placeholder='Exact size (e.g. 65")'
                            className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                          />
                          <span className="text-sm text-black/50 whitespace-nowrap">inches</span>
                        </div>
                      </div>

                      {/* Wall type */}
                      <div>
                        <label className="text-xs font-semibold text-black/60 uppercase tracking-wide">Wall Type</label>
                        <div className="mt-1.5 grid grid-cols-2 gap-2">
                          {WALL_TYPES.map(w => (
                            <button
                              key={w.label}
                              type="button"
                              onClick={() => updateTv(i, "wallType", w.label)}
                              className={`rounded-xl border py-2 px-2 text-left transition ${
                                tv.wallType === w.label
                                  ? "bg-[#E50914] text-white border-[#E50914]"
                                  : "border-black/15 bg-white hover:bg-black/5"
                              }`}
                            >
                              <span className="block text-xs font-semibold">{w.label}</span>
                              <span className={`block text-[11px] mt-0.5 ${tv.wallType === w.label ? "text-white/80" : "text-black/45"}`}>
                                {w.surcharge === 0 ? "Standard" : `+$${w.surcharge}`}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comments */}
                      <div>
                        <label className="text-xs font-semibold text-black/60 uppercase tracking-wide">
                          Comments <span className="normal-case font-normal">(optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={tv.comments}
                          onChange={e => updateTv(i, "comments", e.target.value)}
                          placeholder="Fireplace, high wall, specific location…"
                          className="mt-1.5 w-full rounded-xl border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={addTv}
                  className="mt-4 w-full rounded-xl border-2 border-dashed border-black/20 py-3 text-sm font-semibold text-black/50 hover:border-[#E50914] hover:text-[#E50914] transition">
                  + Add Another TV
                </button>
              </div>
            )}

            {/* ── STEP 2 — Address ── */}
            {step === 2 && (
              <div>
                <StepHeader title="Service Address" sub="Where should our technician go?" />
                <div className="space-y-4">
                  <FormInput label="Street Address" value={address.street}
                    onChange={v => setAddress(a => ({ ...a, street: v }))} placeholder="123 Main St" />
                  <FormInput label="Apt / Suite (optional)" value={address.apt}
                    onChange={v => setAddress(a => ({ ...a, apt: v }))} placeholder="Apt 4B" />
                  <FormInput label="City" value={address.city}
                    onChange={v => setAddress(a => ({ ...a, city: v }))} placeholder="Nashville" />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold">State</label>
                      <select value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-black/15 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white">
                        {US_STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <FormInput label="ZIP Code" value={address.zip}
                      onChange={v => setAddress(a => ({ ...a, zip: v }))} placeholder="37209" />
                  </div>
                  {address.zip && !/^\d{5}$/.test(address.zip) && (
                    <p className="text-xs text-red-500">Please enter a valid 5-digit ZIP code</p>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 3 — Personal Info ── */}
            {step === 3 && (
              <div>
                <StepHeader title="Your Information" sub="We'll use this to confirm your booking" />
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormInput label="First Name" value={info.firstName}
                      onChange={v => setInfo(i => ({ ...i, firstName: v }))} />
                    <FormInput label="Last Name" value={info.lastName}
                      onChange={v => setInfo(i => ({ ...i, lastName: v }))} />
                  </div>
                  <FormInput label="Email" type="email" value={info.email}
                    onChange={v => setInfo(i => ({ ...i, email: v }))} placeholder="your@email.com" />
                  <FormInput label="Phone Number" type="tel" value={info.phone}
                    onChange={v => setInfo(i => ({ ...i, phone: v }))} placeholder="(615) 000-0000" />

                  <div>
                    <label className="text-sm font-semibold">How did you hear about us?</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {REFERRAL_OPTIONS.map(r => (
                        <Chip key={r} label={r} active={info.referral === r}
                          onClick={() => setInfo(i => ({ ...i, referral: r }))} pill />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Preferred Payment Method</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {PAYMENT_OPTIONS.map(p => (
                        <Chip key={p} label={p} active={info.payment === p}
                          onClick={() => setInfo(i => ({ ...i, payment: p }))} pill />
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer mt-1">
                    <input type="checkbox" checked={info.agreed}
                      onChange={e => setInfo(i => ({ ...i, agreed: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 accent-[#E50914] flex-none" />
                    <span className="text-sm text-black/65 leading-snug">
                      I agree to the <span className="font-semibold text-black">Terms & Conditions</span> and
                      authorize PrimeTvNashville to perform the requested services.
                    </span>
                  </label>
                </div>

                {status === "error" && (
                  <p className="mt-4 text-sm font-medium text-[#E50914]">
                    Something went wrong. Please try again or call us at (615) 669-0251.
                  </p>
                )}
              </div>
            )}

            {/* nav buttons */}
            <div className="mt-6 flex justify-between gap-3">
              {step > 0 ? (
                <button type="button" onClick={goBack}
                  className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold hover:bg-black/5 transition">
                  ← Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button type="button" onClick={goNext} disabled={!stepValid[step]}
                  className="rounded-full bg-[#E50914] px-7 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-red-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue →
                </button>
              ) : (
                <button type="button" onClick={submit} disabled={!stepValid[3] || status === "sending"}
                  className="rounded-full bg-[#E50914] px-7 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-red-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  {status === "sending" ? "Booking…" : "Confirm Booking"}
                </button>
              )}
            </div>

          </motion.div>
        </AnimatePresence>

        {/* pricing note */}
        <p className="mt-4 text-xs text-black/40 text-center">
          Drywall standard · Concrete / Tile / Stone / Metal +$25 · Fireplace from +$25
        </p>

      </div>
    </section>
  )
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function StepHeader({ title, sub }) {
  return (
    <div className="mb-5">
      <h3 className="text-xl font-bold">{title}</h3>
      {sub && <p className="mt-0.5 text-sm text-black/55">{sub}</p>}
    </div>
  )
}

function FormInput({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="mt-1 rounded-xl border border-black/15 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
      />
    </div>
  )
}

function Chip({ label, active, onClick, small = false, pill = false }) {
  const base = "border font-medium transition text-center cursor-pointer"
  const size = small ? "py-2 px-2 text-xs rounded-xl" : "py-3 px-3 text-sm rounded-xl"
  const shape = pill ? "rounded-full px-3 py-1.5 text-xs" : size
  const color = active
    ? "bg-[#E50914] text-white border-[#E50914]"
    : "border-black/15 hover:bg-black/5"

  return (
    <button type="button" onClick={onClick} className={`${base} ${shape} ${color}`}>
      {label}
    </button>
  )
}
