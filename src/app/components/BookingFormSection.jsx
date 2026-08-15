"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { validateCoupon } from "@/app/lib/coupons"
import { TV_SIZES, priceHintForSize } from "@/app/lib/tvSizes"
import { MiniCalendar, TimeSlots } from "./DateTimePicker"

function gtag(...args) {
  if (typeof window !== "undefined" && window.gtag) window.gtag(...args)
}

const STEPS = ["Date & Time", "TV Details", "Address", "Your Info"]

const WALL_TYPES = [
  { label: "Drywall",       surcharge: 0  },
  { label: "Brick / Stone", surcharge: 25 },
  { label: "Concrete",      surcharge: 25 },
  { label: "Tile",          surcharge: 25 },
  { label: "Metal / Steel", surcharge: 25 },
]

const PROMOS = [
  { label: '2 TVs up to 55"',                    price: "$199" },
  { label: '2 TVs up to 70"',                    price: "$250" },
  { label: '1 TV up to 55" + 1 TV up to 70"',   price: "$230" },
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
  return { size: "", wallType: "", comments: "" }
}

export default function BookingFormSection() {
  const [step,      setStep]      = useState(0)
  const [direction, setDirection] = useState(1)
  const [status,    setStatus]    = useState("idle")
  const topRef = useRef(null)

  useEffect(() => {
    if (status === "ok") {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [status])

  // Step 0 — date & time
  const [date,           setDate]           = useState("")
  const [timePreference, setTimePreference] = useState("")

  // Step 1 — TV details
  const [moreTvs,          setMoreTvs]          = useState(false)
  const [moreTvsComment,   setMoreTvsComment]   = useState("")
  const [couponCode,       setCouponCode]       = useState("")
  const [couponStatus,     setCouponStatus]     = useState("idle")
  const [appliedCoupon,    setAppliedCoupon]    = useState(null)
  const [couponComment,    setCouponComment]    = useState("")
  const [customMode,       setCustomMode]       = useState("sized") // "sized" | "commentOnly"
  const [customTvSize,     setCustomTvSize]     = useState("")
  const [customTvQty,      setCustomTvQty]      = useState(1)
  const [customPrice,      setCustomPrice]      = useState("")
  const [bookingMode,      setBookingMode]      = useState("standard") // "standard" | "promo" | "bundle"
  const [tvs,              setTvs]              = useState([emptyTv()])
  const [selectedPromo,    setSelectedPromo]    = useState("")
  const [cableConcealment, setCableConcealment] = useState(0) // number of hidden cable runs
  const [bundleDetails,    setBundleDetails]    = useState("")

  // Steps 2 & 3
  const [address, setAddress] = useState({ street: "", apt: "", city: "", state: "TN", zip: "" })
  const [info,    setInfo]    = useState({
    firstName: "", lastName: "", email: "", phone: "",
    referral: "", payment: "", agreed: false,
  })

  const today = new Date().toISOString().split("T")[0]

  // Step 1 validity per mode
  const step1Valid = appliedCoupon?.customQuote
    ? customPrice !== "" && !isNaN(parseFloat(customPrice)) &&
      (customMode === "sized" ? customTvSize.trim().length > 0 : couponComment.trim().length > 0)
    : moreTvs
    ? true
    : bookingMode === "standard"
    ? tvs.length > 0 && tvs.every(tv => tv.size && tv.wallType)
    : bookingMode === "promo"
    ? selectedPromo !== ""
    : bundleDetails.trim().length > 0 // "bundle" mode

  const stepValid = [
    date && timePreference,
    step1Valid,
    address.street.trim() && address.city.trim() && address.state && /^\d{5}$/.test(address.zip),
    info.firstName.trim() && info.lastName.trim() && info.email.includes("@") &&
      info.phone.trim() && info.referral && info.payment && info.agreed,
  ]

  function goNext() {
    if (!stepValid[step]) return
    setDirection(1)
    setStep(s => s + 1)
  }

  function goBack() {
    setDirection(-1)
    setStep(s => s - 1)
  }

  function addTv()           { setTvs(prev => [...prev, emptyTv()]) }
  function removeTv(i)       { setTvs(prev => prev.filter((_, idx) => idx !== i)) }
  function updateTv(i, f, v) { setTvs(prev => prev.map((tv, idx) => idx === i ? { ...tv, [f]: v } : tv)) }

  function switchMode(mode) {
    setBookingMode(mode)
    if (mode !== "promo") setSelectedPromo("")
  }

  function applyCoupon() {
    const result = validateCoupon(couponCode)
    if (result) { setAppliedCoupon(result); setCouponStatus("valid") }
    else        { setAppliedCoupon(null);   setCouponStatus("invalid") }
  }

  function clearCoupon() {
    setCouponCode(""); setCouponStatus("idle"); setAppliedCoupon(null); setCouponComment("")
    setCustomMode("sized"); setCustomTvSize(""); setCustomTvQty(1); setCustomPrice("")
  }

  async function submit() {
    if (!stepValid[3]) return
    setStatus("sending")
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingMode,
          selectedPromo:      bookingMode === "promo"   ? selectedPromo   : "",
          comboDetails:       bookingMode === "bundle"  ? bundleDetails   : "",
          tvs:                bookingMode === "standard" && !moreTvs ? tvs : [],
          cableConcealment,
          couponCode:         appliedCoupon ? couponCode : "",
          appliedCouponLabel: appliedCoupon?.offer ?? "",
          couponComment:      appliedCoupon?.skipTvDetails || appliedCoupon?.customQuote ? couponComment : "",
          couponHidden:       !!appliedCoupon?.hideCodeFromClient,
          customQuote:        !!appliedCoupon?.customQuote,
          customMode:         appliedCoupon?.customQuote ? customMode : "",
          customTvSize:       appliedCoupon?.customQuote && customMode === "sized" ? customTvSize : "",
          customTvQty:        appliedCoupon?.customQuote && customMode === "sized" ? (parseInt(customTvQty) || 1) : null,
          customPrice:        appliedCoupon?.customQuote && customPrice !== "" ? parseFloat(customPrice) : null,
          moreTvs,
          moreTvsComment,
          date,
          timePreference,
          address,
          info,
        }),
      })
      if (!res.ok) throw new Error()
      gtag("event", "booking_complete", {
        event_category: "conversion",
        page_path: "/book",
        service: bookingMode === "promo" ? selectedPromo : bookingMode,
        city: address.city || "Nashville",
        form_name: "booking_form",
      })
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
            const passed = i < step
            const active = i === step
            return (
              <div key={i} className="flex-1 flex flex-col items-center relative">
                {i < STEPS.length - 1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-[2px] transition-colors duration-500 ${passed ? "bg-[#E50914]" : "bg-black/10"}`} />
                )}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  passed ? "bg-[#E50914] text-white" :
                  active ? "bg-[#E50914] text-white ring-4 ring-red-200" :
                           "bg-black/10 text-black/40"
                }`}>
                  {passed ? "✓" : i + 1}
                </div>
                <span className={`mt-1 text-[11px] font-medium hidden sm:block ${
                  active ? "text-black" : "text-black/35"
                }`}>
                  {label}
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

                <div className="space-y-4">
                  <MiniCalendar
                    selectedDate={date}
                    minDate={today}
                    onChange={d => { setDate(d); setTimePreference("") }}
                  />
                  {date && (
                    <div>
                      <p className="text-sm font-semibold text-black/70 mb-2">
                        {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        {" — "}
                        <span className="font-normal text-black/50">Select a time</span>
                      </p>
                      <TimeSlots selected={timePreference} onChange={setTimePreference} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 1 — TV Details ── */}
            {step === 1 && (
              <div>
                <StepHeader title="TV Details" sub="Tell us about your installation" />

                {/* 3+ TVs toggle */}
                <div className="mb-5 rounded-xl border border-black/10 bg-gray-50 p-3">
                  <button
                    type="button"
                    onClick={() => { setMoreTvs(p => !p); setCableConcealment(0) }}
                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      moreTvs
                        ? "bg-gray-900 border-gray-900 text-white"
                        : "border-black/15 bg-white hover:bg-black/5"
                    }`}
                  >
                    <div>
                      <span className="block text-sm font-bold">3 or more TVs</span>
                      <span className={`block text-xs mt-0.5 ${moreTvs ? "text-white/60" : "text-black/45"}`}>
                        Pricing varies — we&apos;ll confirm your quote
                      </span>
                    </div>
                    <span className="text-lg">📺📺📺</span>
                  </button>

                  {moreTvs && (
                    <div className="mt-3 space-y-3">
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 font-medium">
                        Pricing for 3+ TVs varies. We&apos;ll contact you to confirm the total before the appointment.
                      </p>
                      <div>
                        <label className="text-xs font-semibold text-black/60">
                          How many TVs & any details <span className="font-normal">(optional)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={moreTvsComment}
                          onChange={e => setMoreTvsComment(e.target.value)}
                          placeholder="e.g. 4 TVs — 2 in living room, 1 bedroom, 1 office. All drywall."
                          className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                        />
                      </div>
                      <CouponField
                        appliedCoupon={appliedCoupon}
                        couponCode={couponCode}
                        couponStatus={couponStatus}
                        couponComment={couponComment}
                        onCodeChange={v => { setCouponCode(v.toUpperCase()); setCouponStatus("idle") }}
                        onApply={applyCoupon}
                        onClear={clearCoupon}
                        onCommentChange={setCouponComment}
                        customMode={customMode} onCustomModeChange={setCustomMode}
                        customTvSize={customTvSize} onCustomTvSizeChange={setCustomTvSize}
                        customTvQty={customTvQty} onCustomTvQtyChange={setCustomTvQty}
                        customPrice={customPrice} onCustomPriceChange={setCustomPrice}
                      />
                    </div>
                  )}
                </div>

                {/* Mode tabs — shown only when NOT 3+ TVs */}
                {!moreTvs && (
                  <div>
                    <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-black/10 bg-gray-50 p-1.5 mb-5">
                      {[
                        { id: "standard", label: "Standard" },
                        { id: "promo",    label: "Promos"   },
                        { id: "bundle",   label: "Bundle"   },
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => switchMode(m.id)}
                          className={`rounded-xl py-2 text-xs font-bold transition ${
                            bookingMode === m.id
                              ? "bg-white shadow text-black"
                              : "text-black/45 hover:text-black/70"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    {/* ── Standard ── */}
                    {bookingMode === "standard" && (
                      <div>
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

                              <div>
                                <label className="text-xs font-semibold text-black/60 uppercase tracking-wide">TV Size</label>
                                <div className="mt-1.5">
                                  <TvSizeSelect value={tv.size} onChange={v => updateTv(i, "size", v)} />
                                </div>
                              </div>

                              <div>
                                <label className="text-xs font-semibold text-black/60 uppercase tracking-wide">Wall Type</label>
                                <div className="mt-1.5 grid grid-cols-2 gap-2">
                                  {WALL_TYPES.map(w => (
                                    <button key={w.label} type="button" onClick={() => updateTv(i, "wallType", w.label)}
                                      className={`rounded-xl border py-2 px-2 text-left transition ${
                                        tv.wallType === w.label
                                          ? "bg-[#E50914] text-white border-[#E50914]"
                                          : "border-black/15 bg-white hover:bg-black/5"
                                      }`}>
                                      <span className="block text-xs font-semibold">{w.label}</span>
                                      <span className={`block text-[11px] mt-0.5 ${tv.wallType === w.label ? "text-white/80" : "text-black/45"}`}>
                                        {w.surcharge === 0 ? "Standard" : `+$${w.surcharge}`}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>

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

                    {/* ── Promos ── */}
                    {bookingMode === "promo" && (
                      <div>
                        <div className="space-y-2.5">
                          {PROMOS.map(promo => (
                            <label
                              key={promo.label}
                              onClick={() => setSelectedPromo(p => p === promo.label ? "" : promo.label)}
                              className="flex items-center gap-3 cursor-pointer group rounded-xl border p-4 transition hover:border-[#E50914]/40"
                            >
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
                                <p className="text-xs font-semibold text-[#E50914] uppercase tracking-wide">Promo price</p>
                                <p className="text-xs text-black/55 mt-0.5">{selectedPromo}</p>
                              </div>
                              <span className="text-2xl font-extrabold text-[#E50914]">{promo?.price}</span>
                            </div>
                          )
                        })()}

                        {!selectedPromo && (
                          <p className="mt-3 text-xs text-black/40">Select the promo that fits your installation</p>
                        )}
                      </div>
                    )}

                    {/* ── Bundle ── */}
                    {bookingMode === "bundle" && (
                      <div>
                        <div className="rounded-xl border border-black/10 bg-gray-50 p-4">
                          <p className="text-xs font-semibold text-black/50 uppercase tracking-wide mb-1">
                            Describe your installation
                          </p>
                          <p className="text-xs text-black/40 mb-3 leading-relaxed">
                            Tell us what you need — number of TVs, locations, wall types, any special requirements.
                            Our team will review and reach out to confirm everything before the appointment.
                          </p>
                          <textarea
                            rows={5}
                            value={bundleDetails}
                            onChange={e => setBundleDetails(e.target.value)}
                            placeholder="e.g. 2 TVs — living room on brick wall + master bedroom on drywall. Also need a soundbar mounted below the bedroom TV..."
                            className="w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                          />
                          <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 font-medium">
                            We&apos;ll reach out to confirm availability and details — no payment required now.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ── Add-ons (Standard + Promos only) ── */}
                    {bookingMode !== "bundle" && (
                      <div className="mt-5 rounded-2xl border-2 border-dashed border-black/15 bg-gray-50 p-4">
                        <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-3">Add-ons</p>
                        <CableToggle count={cableConcealment} onChange={setCableConcealment} />
                      </div>
                    )}

                    {/* ── Coupon ── */}
                    {bookingMode !== "bundle" && (
                      <CouponField
                        appliedCoupon={appliedCoupon} couponCode={couponCode}
                        couponStatus={couponStatus} couponComment={couponComment}
                        onCodeChange={v => { setCouponCode(v.toUpperCase()); setCouponStatus("idle") }}
                        onApply={applyCoupon} onClear={clearCoupon} onCommentChange={setCouponComment}
                        customMode={customMode} onCustomModeChange={setCustomMode}
                        customTvSize={customTvSize} onCustomTvSizeChange={setCustomTvSize}
                        customTvQty={customTvQty} onCustomTvQtyChange={setCustomTvQty}
                        customPrice={customPrice} onCustomPriceChange={setCustomPrice}
                      />
                    )}
                  </div>
                )}
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
                          onClick={() => setInfo(i => ({ ...i, referral: r }))} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Preferred Payment Method</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {PAYMENT_OPTIONS.map(p => (
                        <Chip key={p} label={p} active={info.payment === p}
                          onClick={() => setInfo(i => ({ ...i, payment: p }))} />
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

/* ── Sub-components ───────────────────────────────────────────────────────── */

function CableToggle({ count, onChange }) {
  const total = count * 60
  return (
    <div>
      <div className="flex items-center justify-between gap-3 bg-white rounded-xl border border-black/10 px-4 py-3">
        <div>
          <span className="text-sm font-bold">🔌 Hidden Cable Concealment</span>
          <span className="block text-xs text-black/50 mt-0.5">
            In-wall routing or raceway — <strong className="text-black/70">$60 per run</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 flex-none">
          <button
            type="button"
            onClick={() => onChange(Math.max(0, count - 1))}
            disabled={count === 0}
            className="w-9 h-9 rounded-full border-2 border-black/20 flex items-center justify-center text-xl font-bold hover:bg-black/10 transition disabled:opacity-25 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="w-7 text-center text-base font-extrabold">{count}</span>
          <button
            type="button"
            onClick={() => onChange(Math.min(10, count + 1))}
            className="w-9 h-9 rounded-full border-2 border-[#E50914] text-[#E50914] flex items-center justify-center text-xl font-bold hover:bg-[#E50914] hover:text-white transition"
          >
            +
          </button>
        </div>
      </div>
      {count > 0 && (
        <div className="mt-2 flex items-center justify-between rounded-xl bg-[#E50914]/8 border border-[#E50914]/20 px-4 py-2.5">
          <span className="text-xs text-[#E50914] font-semibold">{count} hidden cable run{count > 1 ? "s" : ""}</span>
          <span className="text-sm font-extrabold text-[#E50914]">+${total}</span>
        </div>
      )}
    </div>
  )
}

// Single-choice (radio-style) TV size picker with a search box — always picks
// exactly one value from TV_SIZES, so every submission stores the same
// normalized size string for later reporting (Admin → Reporte).
function TvSizeSelect({ value, onChange, tone = "red" }) {
  const [query, setQuery] = useState("")
  const [open,  setOpen]  = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    function onOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [])

  const digits   = query.replace(/[^0-9]/g, "")
  const filtered = TV_SIZES.filter(s => String(s).includes(digits))

  const ring   = tone === "emerald" ? "focus:ring-emerald-300" : "focus:ring-red-300"
  const border = tone === "emerald" ? "border-emerald-200" : "border-black/15"
  const active = tone === "emerald" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-[#E50914]"
  const hover  = tone === "emerald" ? "hover:bg-emerald-50" : "hover:bg-red-50"

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        value={open ? query : (value ? `${value}"` : "")}
        onFocus={() => { setOpen(true); setQuery("") }}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search TV size…"
        className={`w-full rounded-xl border ${border} bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring}`}
      />
      {open && (
        <div className={`absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border ${border} bg-white shadow-lg`}>
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-xs text-black/40">No matches</p>
          ) : filtered.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => { onChange(String(s)); setOpen(false); setQuery("") }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition ${hover} ${
                value === String(s) ? `${active} font-semibold` : "text-black/80"
              }`}
            >
              <span>{s}&quot;</span>
              <span className="text-xs text-black/40">{priceHintForSize(s)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CouponField({
  appliedCoupon, couponCode, couponStatus, couponComment, onCodeChange, onApply, onClear, onCommentChange,
  customMode, onCustomModeChange, customTvSize, onCustomTvSizeChange, customTvQty, onCustomTvQtyChange,
  customPrice, onCustomPriceChange,
}) {
  return (
    <div className="mt-4 pt-4 border-t border-black/8">
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
            <button type="button" onClick={onClear}
              className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex-none">
              Remove
            </button>
          </div>

          {appliedCoupon.customQuote && (
            <div className="border-t border-emerald-200 px-3 pb-3 pt-2.5 bg-white/60 space-y-3">
              <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-1">
                {[
                  { id: "sized",       label: "TV Size & Qty" },
                  { id: "commentOnly", label: "Comment Only"  },
                ].map(m => (
                  <button key={m.id} type="button" onClick={() => onCustomModeChange(m.id)}
                    className={`rounded-lg py-1.5 text-xs font-bold transition ${
                      customMode === m.id ? "bg-white shadow text-emerald-800" : "text-emerald-700/50 hover:text-emerald-700"
                    }`}>
                    {m.label}
                  </button>
                ))}
              </div>

              {customMode === "sized" && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-emerald-800">TV Size</label>
                    <div className="mt-1">
                      <TvSizeSelect value={customTvSize} onChange={onCustomTvSizeChange} tone="emerald" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-emerald-800">Qty</label>
                    <input
                      type="number" min="1"
                      value={customTvQty}
                      onChange={e => onCustomTvQtyChange(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-emerald-800">Installation Price ($)</label>
                <input
                  type="number" step="0.01" min="0"
                  value={customPrice}
                  onChange={e => onCustomPriceChange(e.target.value)}
                  placeholder="0.00"
                  className="mt-1 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-800">
                  {customMode === "commentOnly" ? "Job Description" : "Additional comments"}
                  {customMode === "sized" && <span className="font-normal text-black/40"> (optional)</span>}
                </label>
                <textarea
                  rows={3}
                  value={couponComment}
                  onChange={e => onCommentChange(e.target.value)}
                  placeholder={customMode === "commentOnly"
                    ? "Describe the job — what's being installed and where…"
                    : "Anything you'd like us to know about the installation…"}
                  className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                />
              </div>
            </div>
          )}

          {appliedCoupon.skipTvDetails && !appliedCoupon.customQuote && (
            <div className="border-t border-emerald-200 px-3 pb-3 pt-2.5 bg-white/60">
              <label className="text-xs font-semibold text-emerald-800">
                Additional comments <span className="font-normal text-black/40">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={couponComment}
                onChange={e => onCommentChange(e.target.value)}
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
            onChange={e => onCodeChange(e.target.value)}
            placeholder="Enter coupon code"
            className={`flex-1 rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 uppercase placeholder:normal-case placeholder:text-black/30 transition ${
              couponStatus === "invalid" ? "border-red-400 focus:ring-red-200" : "border-black/15 focus:ring-red-300"
            }`}
          />
          <button
            type="button"
            onClick={onApply}
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
  )
}

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

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${
        active ? "bg-[#E50914] text-white border-[#E50914]" : "border-black/15 hover:bg-black/5"
      }`}
    >
      {label}
    </button>
  )
}
