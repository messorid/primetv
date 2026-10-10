"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { validateCoupon } from "@/app/lib/coupons"
import { TV_SIZES, priceHintForSize } from "@/app/lib/tvSizes"
import { MiniCalendar, TimeSlots } from "./DateTimePicker"
import {
  TextField, PhoneField, EmailField, ZipField, SelectField, ChoiceGroup,
  CheckboxField, ErrorSummary, StepHeading, PrimaryButton, SecondaryButton, focusField,
} from "./forms/FormKit"
import { isValidUSPhone, isValidEmail, isValidName, isValidZip, validate, MESSAGES } from "../lib/formValidation"

function gtag(...args) {
  if (typeof window !== "undefined" && window.gtag) window.gtag(...args)
}

const STEPS = ["Date & Time", "Service Details", "Address", "Your Info"]

// Hard surfaces need specialised anchors and the cost depends on the material
// and the difficulty, so no figure is published here — a rep quotes it.
const WALL_TYPES = [
  { label: "Drywall",       note: "Standard" },
  { label: "Brick / Stone", note: "By quote" },
  { label: "Concrete",      note: "By quote" },
  { label: "Tile",          note: "By quote" },
  { label: "Metal / Steel", note: "By quote" },
]

const TV_MODELS = [
  { id: "standard", label: "Standard TV", icon: "📺" },
  { id: "frame",    label: "Frame TV",    icon: "🖼️" },
]

const HOME_INSTALL_SERVICES = [
  { id: "furniture",      label: "Furniture Assembly",       icon: "🪑" },
  { id: "mirror_picture", label: "Picture / Mirror Hanging", icon: "🪞" },
  { id: "shelves_wall",   label: "Shelves & Wall Install",   icon: "📐" },
  { id: "ceiling_fan",    label: "Ceiling Fan Install",      icon: "🌀" },
  { id: "gazebo",         label: "Gazebo / Pergola",         icon: "⛺" },
  { id: "playset",        label: "Playground / Playset",     icon: "🛝" },
  { id: "other",          label: "Other Installation",       icon: "🔧" },
]

const PROMOS = [
  { label: '2 TVs up to 55"',                    price: "From $199" },
  { label: '2 TVs up to 70"',                    price: "From $250" },
  { label: '1 TV up to 55" + 1 TV up to 70"',   price: "From $230" },
]

const REFERRAL_OPTIONS = ["Google", "Instagram", "Facebook", "TikTok", "YouTube", "Friend", "Other"]
// No cards and no checks — the note under the choices says so too.
const PAYMENT_OPTIONS  = ["Cash", "Zelle", "PayPal", "Venmo", "Other"]
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
]

function emptyTv() {
  return { model: "standard", size: "", measurements: "", wallType: "", comments: "" }
}

export default function BookingFormSection() {
  const [step,      setStep]      = useState(0)
  const [direction, setDirection] = useState(1)
  const [status,    setStatus]    = useState("idle")
  const topRef = useRef(null)
  // Errors for a step appear once Continue has been pressed on it, or a field
  // has been left. Pressing Continue with something missing now lists what is
  // missing, instead of a greyed-out button that never explains itself.
  const [tried,   setTried]   = useState({})
  const [touched, setTouched] = useState({})
  const blur = field => () => setTouched(t => ({ ...t, [field]: true }))
  // Moves focus to the new step's heading once its slide-in animation ends,
  // so keyboard and screen reader users land on "Service Address" rather than
  // on a button that has just disappeared.
  const headingRef = useRef(null)
  const navigated  = useRef(false)

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
  // "standard" | "promo" | "bundle" | "homeinstall"
  const [bookingMode,      setBookingMode]      = useState("standard")
  const [tvs,              setTvs]              = useState([emptyTv()])
  const [selectedPromo,    setSelectedPromo]    = useState("")
  const [cableConcealment, setCableConcealment] = useState(0) // number of hidden cable runs
  const [bundleDetails,    setBundleDetails]    = useState("")
  const [homeInstallService, setHomeInstallService] = useState("")
  const [homeInstallDetails, setHomeInstallDetails] = useState("")

  // Steps 2 & 3
  const [address, setAddress] = useState({ street: "", apt: "", city: "", state: "TN", zip: "" })
  const [info,    setInfo]    = useState({
    firstName: "", lastName: "", email: "", phone: "",
    referral: "", payment: "", agreed: false,
  })

  const today = new Date().toISOString().split("T")[0]

  // A Frame TV is quoted from its measurements, so those are required in place
  // of the price the standard flow would show.
  const tvValid = tv =>
    tv.wallType && (tv.model === "frame" ? tv.measurements.trim().length > 0 : !!tv.size)

  // Step 1 validity per mode
  const step1Valid = appliedCoupon?.customQuote
    ? customPrice !== "" && !isNaN(parseFloat(customPrice)) &&
      (customMode === "sized" ? customTvSize.trim().length > 0 : couponComment.trim().length > 0)
    : moreTvs
    ? true
    : bookingMode === "standard"
    ? tvs.length > 0 && tvs.every(tvValid)
    : bookingMode === "promo"
    ? selectedPromo !== ""
    : bookingMode === "homeinstall"
    ? homeInstallService !== "" && homeInstallDetails.trim().length > 0
    : bundleDetails.trim().length > 0 // "bundle" mode

  // What, specifically, is missing on the service step — it has several modes
  // and the person needs to know which part to fill in.
  function step1Problem() {
    if (appliedCoupon?.customQuote) {
      if (customPrice === "" || isNaN(parseFloat(customPrice))) return "Enter the installation price for this coupon."
      return customMode === "sized" ? "Choose the TV size for this coupon." : "Describe the job for this coupon."
    }
    if (bookingMode === "standard") {
      const bad = tvs.findIndex(tv => !tvValid(tv))
      if (bad === -1) return ""
      const tv = tvs[bad]
      const which = tvs.length > 1 ? `TV ${bad + 1}: ` : ""
      if (!tv.wallType) return `${which}choose the wall type.`
      return tv.model === "frame" ? `${which}enter the Frame TV measurements.` : `${which}choose the TV size.`
    }
    if (bookingMode === "promo") return "Choose a promotion."
    if (bookingMode === "homeinstall") return homeInstallService ? "Describe what you need installed." : "Choose the home installation service."
    return "Describe the installation you need."
  }

  const stepErrors = [
    validate([
      ["date", !!date,           "Choose a date on the calendar."],
      ["time", !!timePreference, "Choose a time window."],
    ]),
    step1Valid ? {} : { service: step1Problem() },
    validate([
      ["street", address.street.trim().length >= 3, "Enter the street address, like 123 Main St."],
      ["city",   address.city.trim().length >= 2,   "Enter the city."],
      ["state",  !!address.state,                   "Choose the state."],
      ["zip",    isValidZip(address.zip),           MESSAGES.zip],
    ]),
    validate([
      ["firstName", isValidName(info.firstName), "Enter your first name."],
      ["lastName",  isValidName(info.lastName),  "Enter your last name."],
      ["email",     isValidEmail(info.email),    MESSAGES.email],
      ["phone",     isValidUSPhone(info.phone),  MESSAGES.phone],
      ["referral",  !!info.referral,             "Tell us how you heard about us."],
      ["payment",   !!info.payment,              "Choose how you'd like to pay."],
      ["agreed",    info.agreed,                 "Please accept the Terms & Conditions to book."],
    ]),
  ]
  const stepValid = stepErrors.map(e => Object.keys(e).length === 0)
  const shown = field => (tried[step] || touched[field]) ? stepErrors[step][field] : undefined

  // Ids of the fields an error summary can jump to. Anything without its own
  // field (the calendar, the service step) jumps to the step heading instead.
  const FIELD_IDS = {
    street: "bk-street", city: "bk-city", state: "bk-state", zip: "bk-zip",
    firstName: "bk-first", lastName: "bk-last", email: "bk-email", phone: "bk-phone",
    referral: "bk-referral", payment: "bk-payment", agreed: "bk-agreed",
  }
  const ERROR_LABELS = {
    date: "Date", time: "Time", service: "Service",
    street: "Street", city: "City", state: "State", zip: "ZIP code",
    firstName: "First name", lastName: "Last name", email: "Email", phone: "Phone",
    referral: "How you heard about us", payment: "Payment", agreed: "Terms",
  }
  function jumpTo(key) {
    if (FIELD_IDS[key]) focusField(FIELD_IDS[key])
    else headingRef.current?.focus()
  }

  function goNext() {
    setTried(t => ({ ...t, [step]: true }))
    if (!stepValid[step]) return
    navigated.current = true
    setDirection(1)
    setStep(s => s + 1)
  }

  function goBack() {
    navigated.current = true
    setDirection(-1)
    setStep(s => s - 1)
  }

  function addTv()           { setTvs(prev => [...prev, emptyTv()]) }
  function removeTv(i)       { setTvs(prev => prev.filter((_, idx) => idx !== i)) }
  function updateTv(i, f, v) { setTvs(prev => prev.map((tv, idx) => idx === i ? { ...tv, [f]: v } : tv)) }

  function switchMode(mode) {
    setBookingMode(mode)
    if (mode !== "promo") setSelectedPromo("")
    // Cable concealment is a TV add-on; it makes no sense on a home install.
    if (mode === "homeinstall") setCableConcealment(0)
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
    setTried(t => ({ ...t, 3: true }))
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
          homeInstallService: bookingMode === "homeinstall" ? homeInstallService : "",
          homeInstallDetails: bookingMode === "homeinstall" ? homeInstallDetails : "",
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
        <ol aria-label="Booking progress" className="flex items-center mb-7">
          {STEPS.map((label, i) => {
            const passed = i < step
            const active = i === step
            return (
              <li key={i} aria-current={active ? "step" : undefined} className="flex-1 flex flex-col items-center relative">
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
                <span className={`mt-1 text-[11px] font-medium ${active ? "block text-black" : "hidden sm:block text-black/35"}`}>
                  {label}
                  <span className="sr-only">{passed ? " (done)" : active ? " (current step)" : ""}</span>
                </span>
              </li>
            )
          })}
        </ol>

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
            onAnimationComplete={def => {
              if (def === "center" && navigated.current) {
                navigated.current = false
                headingRef.current?.focus()
              }
            }}
            className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-lg"
          >

            {/* ── STEP 0 — Date & Time ── */}
            {step === 0 && (
              <div>
                <StepHeading ref={headingRef} as="h2" step={1} total={4} sub="Pick a day on the calendar, then a time window that suits you.">When do you need us?</StepHeading>

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
                <StepHeading ref={headingRef} as="h2" step={2} total={4} sub="Tell us what we are installing so we can bring the right hardware.">Service details</StepHeading>

                {/* 3+ TVs toggle */}
                <div className="mb-5 rounded-xl border border-black/10 bg-gray-50 p-3">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !moreTvs
                      setMoreTvs(next)
                      setCableConcealment(0)
                      // The mode tabs disappear while this is on, so reset to the
                      // TV flow rather than submitting a stale promo or home-install
                      // selection the customer can no longer see.
                      if (next) {
                        setBookingMode("standard")
                        setSelectedPromo("")
                        setHomeInstallService("")
                        setHomeInstallDetails("")
                      }
                    }}
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
                        <label htmlFor="bk-more-tvs" className="text-xs font-semibold text-black/60">
                          How many TVs & any details <span className="font-normal">(optional)</span>
                        </label>
                        <textarea
                          id="bk-more-tvs"
                          rows={3}
                          value={moreTvsComment}
                          onChange={e => setMoreTvsComment(e.target.value)}
                          placeholder="e.g. 4 TVs — 2 in living room, 1 bedroom, 1 office. All drywall."
                          className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 text-base focus:outline-none focus:ring-4 focus:ring-red-200 resize-none"
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-2xl border border-black/10 bg-gray-50 p-1.5 mb-5">
                      {[
                        { id: "standard",    label: "Standard"     },
                        { id: "promo",       label: "Promos"       },
                        { id: "bundle",      label: "Bundle"       },
                        { id: "homeinstall", label: "Home Install" },
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

                              {/* TV model */}
                              <div>
                                <label className="text-xs font-semibold text-black/60 uppercase tracking-wide">TV Model</label>
                                <div className="mt-1.5 grid grid-cols-2 gap-2">
                                  {TV_MODELS.map(m => (
                                    <button key={m.id} type="button" onClick={() => updateTv(i, "model", m.id)}
                                      className={`rounded-xl border py-2.5 px-2 transition ${
                                        tv.model === m.id
                                          ? "bg-[#E50914] text-white border-[#E50914]"
                                          : "border-black/15 bg-white hover:bg-black/5"
                                      }`}>
                                      <span className="block text-base leading-none mb-1">{m.icon}</span>
                                      <span className="block text-xs font-semibold">{m.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {tv.model === "frame" && (
                                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
                                  <strong>Frame TV installs are quoted individually.</strong> The slim-fit mount,
                                  One Connect Box placement and cable routing all affect the price, so we don&apos;t
                                  publish a flat rate. Give us the measurements and details below and a sales
                                  representative will confirm your exact price.
                                </p>
                              )}

                              <div>
                                <label className="text-xs font-semibold text-black/60 uppercase tracking-wide">
                                  TV Size {tv.model === "frame" && <span className="normal-case font-normal">(optional)</span>}
                                </label>
                                <div className="mt-1.5">
                                  <TvSizeSelect
                                    value={tv.size}
                                    onChange={v => updateTv(i, "size", v)}
                                    showPrice={tv.model !== "frame"}
                                  />
                                </div>
                              </div>

                              {tv.model === "frame" && (
                                <div>
                                  <label htmlFor={`bk-tv-${i}-measurements`} className="text-xs font-semibold text-black/60 uppercase tracking-wide">
                                    Measurements <span className="text-[#E50914]">*</span>
                                  </label>
                                  <input
                                    id={`bk-tv-${i}-measurements`}
                                    type="text"
                                    value={tv.measurements}
                                    onChange={e => updateTv(i, "measurements", e.target.value)}
                                    placeholder='e.g. 48" wide x 28" tall — Samsung Frame 55" (2024)'
                                    className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 text-base focus:outline-none focus:ring-4 focus:ring-red-200"
                                  />
                                  <p className="mt-1 text-[11px] text-black/40">
                                    Width and height of the TV, plus the model or year if you know it.
                                  </p>
                                </div>
                              )}

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
                                        {w.note}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                                <p className="mt-1.5 text-[11px] text-black/40">
                                  Surfaces other than drywall are quoted based on the material and difficulty.
                                </p>
                              </div>

                              <div>
                                <label htmlFor={`bk-tv-${i}-comments`} className="text-xs font-semibold text-black/60 uppercase tracking-wide">
                                  {tv.model === "frame" ? "Description" : "Comments"}{" "}
                                  <span className="normal-case font-normal">(optional)</span>
                                </label>
                                <textarea
                                  id={`bk-tv-${i}-comments`}
                                  rows={2}
                                  value={tv.comments}
                                  onChange={e => updateTv(i, "comments", e.target.value)}
                                  placeholder={tv.model === "frame"
                                    ? "Mount you have, One Connect Box location, Art Mode setup, wall finish…"
                                    : "Fireplace, high wall, specific location…"}
                                  className="mt-1.5 w-full rounded-xl border border-black/15 px-3.5 py-3 text-base focus:outline-none focus:ring-4 focus:ring-red-200 resize-none bg-white"
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
                          <label htmlFor="bk-bundle" className="block text-xs font-semibold text-black/50 uppercase tracking-wide mb-1">
                            Describe your installation
                          </label>
                          <p className="text-xs text-black/40 mb-3 leading-relaxed">
                            Tell us what you need — number of TVs, locations, wall types, any special requirements.
                            Our team will review and reach out to confirm everything before the appointment.
                          </p>
                          <textarea
                            id="bk-bundle"
                            rows={5}
                            value={bundleDetails}
                            onChange={e => setBundleDetails(e.target.value)}
                            placeholder="e.g. 2 TVs — living room on brick wall + master bedroom on drywall. Also need a soundbar mounted below the bedroom TV..."
                            className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 text-base focus:outline-none focus:ring-4 focus:ring-red-200 resize-none"
                          />
                          <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 font-medium">
                            We&apos;ll reach out to confirm availability and details — no payment required now.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ── Home Installations ── */}
                    {bookingMode === "homeinstall" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-black/60 uppercase tracking-wide">
                            What do you need installed? <span className="text-[#E50914]">*</span>
                          </label>
                          <div className="mt-2 space-y-2">
                            {HOME_INSTALL_SERVICES.map(s => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => setHomeInstallService(prev => prev === s.id ? "" : s.id)}
                                className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                                  homeInstallService === s.id
                                    ? "bg-[#E50914] text-white border-[#E50914]"
                                    : "border-black/15 bg-white hover:bg-black/5"
                                }`}
                              >
                                <span className="text-lg leading-none">{s.icon}</span>
                                <span className="text-sm font-semibold flex-1">{s.label}</span>
                                {homeInstallService === s.id && <span className="text-sm">✓</span>}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl border border-black/10 bg-gray-50 p-4">
                          <label htmlFor="bk-home-install" className="block text-xs font-semibold text-black/50 uppercase tracking-wide mb-1">
                            Describe what you need <span className="text-[#E50914]">*</span>
                          </label>
                          <p className="text-xs text-black/40 mb-3 leading-relaxed">
                            Item, quantity, brand or model, approximate size, and anything else that helps us
                            quote it accurately.
                          </p>
                          <textarea
                            id="bk-home-install"
                            rows={5}
                            value={homeInstallDetails}
                            onChange={e => setHomeInstallDetails(e.target.value)}
                            placeholder="e.g. IKEA PAX wardrobe, 2 units, already delivered. Also a 40 lb mirror to hang on a drywall hallway wall."
                            className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 text-base focus:outline-none focus:ring-4 focus:ring-red-200 resize-none"
                          />
                          <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 font-medium">
                            Home installations are priced by quote. We&apos;ll review your request and reach out
                            with pricing before the appointment — no payment required now.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ── Add-ons (Standard + Promos only) ── */}
                    {bookingMode !== "bundle" && bookingMode !== "homeinstall" && (
                      <div className="mt-5 rounded-2xl border-2 border-dashed border-black/15 bg-gray-50 p-4">
                        <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-3">Add-ons</p>
                        <CableToggle count={cableConcealment} onChange={setCableConcealment} />
                      </div>
                    )}

                    {/* ── Coupon ── */}
                    {bookingMode !== "bundle" && bookingMode !== "homeinstall" && (
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
                <StepHeading ref={headingRef} as="h2" step={3} total={4} sub="Where should our technician go?">Service address</StepHeading>
                <div className="space-y-5">
                  <TextField id="bk-street" label="Street address" required autoComplete="address-line1"
                    value={address.street} onChange={v => setAddress(a => ({ ...a, street: v }))}
                    onBlur={blur("street")} error={shown("street")} placeholder="123 Main St" enterKeyHint="next" />
                  <TextField id="bk-apt" label="Apt / Suite" optional autoComplete="address-line2"
                    value={address.apt} onChange={v => setAddress(a => ({ ...a, apt: v }))}
                    placeholder="Apt 4B" hint="Include a gate code if there is one." enterKeyHint="next" />
                  <TextField id="bk-city" label="City" required autoComplete="address-level2" autoCapitalize="words"
                    value={address.city} onChange={v => setAddress(a => ({ ...a, city: v }))}
                    onBlur={blur("city")} error={shown("city")} placeholder="Nashville" enterKeyHint="next" />
                  <div className="grid grid-cols-2 gap-3">
                    <SelectField id="bk-state" label="State" required placeholder=""
                      value={address.state} onChange={v => setAddress(a => ({ ...a, state: v }))}
                      onBlur={blur("state")} error={shown("state")} options={US_STATES} />
                    <ZipField id="bk-zip" label="ZIP code" required
                      value={address.zip} onChange={v => setAddress(a => ({ ...a, zip: v }))}
                      onBlur={blur("zip")} error={shown("zip")} hint="5 digits." enterKeyHint="next" />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3 — Personal Info ── */}
            {step === 3 && (
              <div>
                <StepHeading ref={headingRef} as="h2" step={4} total={4} sub={<>We use this to confirm your booking. Fields marked <span className="text-[#E50914]">*</span> are required.</>}>Your information</StepHeading>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 min-[420px]:grid-cols-2 min-[420px]:gap-3">
                    <TextField id="bk-first" label="First name" required autoComplete="given-name" autoCapitalize="words"
                      value={info.firstName} onChange={v => setInfo(i => ({ ...i, firstName: v }))}
                      onBlur={blur("firstName")} error={shown("firstName")} enterKeyHint="next" />
                    <TextField id="bk-last" label="Last name" required autoComplete="family-name" autoCapitalize="words"
                      value={info.lastName} onChange={v => setInfo(i => ({ ...i, lastName: v }))}
                      onBlur={blur("lastName")} error={shown("lastName")} enterKeyHint="next" />
                  </div>
                  <EmailField id="bk-email" label="Email" required
                    value={info.email} onChange={v => setInfo(i => ({ ...i, email: v }))}
                    onBlur={blur("email")} error={shown("email")} enterKeyHint="next"
                    hint="Your confirmation and calendar invite go here." />
                  <PhoneField id="bk-phone" label="Mobile phone" required
                    value={info.phone} onChange={v => setInfo(i => ({ ...i, phone: v }))}
                    onBlur={blur("phone")} error={shown("phone")} enterKeyHint="done"
                    hint="10-digit US number, for updates about your appointment." />

                  <ChoiceGroup id="bk-referral" legend="How did you hear about us?" required
                    columns={3} size="sm" options={REFERRAL_OPTIONS}
                    value={info.referral} onChange={v => setInfo(i => ({ ...i, referral: v }))}
                    error={shown("referral")} />

                  <ChoiceGroup id="bk-payment" legend="Preferred payment method" required
                    columns={3} size="sm" options={PAYMENT_OPTIONS}
                    value={info.payment} onChange={v => setInfo(i => ({ ...i, payment: v }))}
                    error={shown("payment")} hint="No payment is required now." />
                  <p className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-sm font-semibold text-amber-900">
                    <span aria-hidden="true">🚫</span> We do not accept credit/debit cards or checks.
                  </p>

                  {/* Wall liability notice */}
                  <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4">
                    <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wide mb-2">
                      ⚠️ Important — Please Read
                    </p>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      For all <strong>TV mounting</strong> and <strong>hidden cable concealment</strong> services, the customer is responsible for verifying that no electrical wires, water pipes, or other obstructions are inside the wall before installation.{" "}
                      <strong>PrimeTvNashville is not responsible</strong> for damage to any in-wall infrastructure (wiring, plumbing, gas lines, etc.) during the service.
                    </p>
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs font-bold text-amber-800 underline underline-offset-2 hover:text-amber-900"
                    >
                      Read full Terms &amp; Conditions →
                    </a>
                  </div>

                  <CheckboxField id="bk-agreed" required checked={info.agreed}
                    onChange={v => setInfo(i => ({ ...i, agreed: v }))} error={shown("agreed")}>
                    I have read and agree to the{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-black underline underline-offset-1">
                      Terms &amp; Conditions
                    </a>
                    {" "}including the wall liability notice, and authorize PrimeTvNashville to perform the requested services.
                  </CheckboxField>
                </div>

                {status === "error" && (
                  <p className="mt-4 text-sm font-medium text-[#E50914]">
                    Something went wrong. Please try again or call us at (615) 669-0251.
                  </p>
                )}
              </div>
            )}

            {/* what is still missing on this step */}
            {tried[step] && !stepValid[step] && (
              <div className="mt-6">
                <ErrorSummary errors={stepErrors[step]} labels={ERROR_LABELS} onJump={jumpTo} />
              </div>
            )}

            {/* nav buttons */}
            <div className="mt-6 flex justify-between gap-3">
              {step > 0 ? (
                <SecondaryButton onClick={goBack} className="flex-none">← Back</SecondaryButton>
              ) : <div />}

              {step < 3 ? (
                <PrimaryButton type="button" onClick={goNext} className="flex-1 sm:flex-none">
                  Continue →
                </PrimaryButton>
              ) : (
                <PrimaryButton type="button" onClick={submit} busy={status === "sending"} busyLabel="Booking…" className="flex-1 sm:flex-none">
                  Confirm booking
                </PrimaryButton>
              )}
            </div>

          </motion.div>
        </AnimatePresence>

        {/* pricing note */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-amber-900 text-center">
            <span className="font-bold">Prices start from the amounts shown.</span> Your final price
            depends on the difficulty of the installation, the wall type and the mount or bracket
            being installed. Pull-down mantel mounts (MantelMount and similar) and Samsung Frame TV
            installs are priced separately. One of our sales representatives confirms your exact
            price before any work begins.
          </p>
        </div>

        <p className="mt-3 text-xs text-black/40 text-center">
          Drywall standard · Concrete / Tile / Stone / Metal by quote · Fireplace by quote ·
          Frame TV &amp; home installations by quote
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
            In-wall routing or raceway — <strong className="text-black/70">from $60 per run</strong>
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
function TvSizeSelect({ value, onChange, tone = "red", showPrice = true }) {
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
        aria-label="TV size in inches"
        inputMode="numeric"
        autoComplete="off"
        value={open ? query : (value ? `${value}"` : "")}
        onFocus={() => { setOpen(true); setQuery("") }}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search TV size…"
        className={`w-full rounded-xl border ${border} bg-white px-3.5 py-3 text-base focus:outline-none focus:ring-2 ${ring}`}
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
              <span className="text-xs text-black/40">
                {showPrice ? priceHintForSize(s) : "By quote"}
              </span>
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
                    <label htmlFor="bk-coupon-qty" className="text-xs font-semibold text-emerald-800">Qty</label>
                    <input
                      id="bk-coupon-qty"
                      type="number" min="1" inputMode="numeric"
                      value={customTvQty}
                      onChange={e => onCustomTvQtyChange(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-emerald-200 bg-white px-3.5 py-3 text-base focus:outline-none focus:ring-4 focus:ring-emerald-200"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="bk-coupon-price" className="text-xs font-semibold text-emerald-800">Installation Price ($)</label>
                <input
                  id="bk-coupon-price"
                  type="number" step="0.01" min="0" inputMode="decimal"
                  value={customPrice}
                  onChange={e => onCustomPriceChange(e.target.value)}
                  placeholder="0.00"
                  className="mt-1 w-full rounded-xl border border-emerald-200 bg-white px-3.5 py-3 text-base focus:outline-none focus:ring-4 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label htmlFor="bk-coupon-comment" className="text-xs font-semibold text-emerald-800">
                  {customMode === "commentOnly" ? "Job Description" : "Additional comments"}
                  {customMode === "sized" && <span className="font-normal text-black/40"> (optional)</span>}
                </label>
                <textarea
                  id="bk-coupon-comment"
                  rows={3}
                  value={couponComment}
                  onChange={e => onCommentChange(e.target.value)}
                  placeholder={customMode === "commentOnly"
                    ? "Describe the job — what's being installed and where…"
                    : "Anything you'd like us to know about the installation…"}
                  className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white px-3.5 py-3 text-base focus:outline-none focus:ring-4 focus:ring-emerald-200 resize-none"
                />
              </div>
            </div>
          )}

          {appliedCoupon.skipTvDetails && !appliedCoupon.customQuote && (
            <div className="border-t border-emerald-200 px-3 pb-3 pt-2.5 bg-white/60">
              <label htmlFor="bk-coupon-comment-2" className="text-xs font-semibold text-emerald-800">
                Additional comments <span className="font-normal text-black/40">(optional)</span>
              </label>
              <textarea
                id="bk-coupon-comment-2"
                rows={3}
                value={couponComment}
                onChange={e => onCommentChange(e.target.value)}
                placeholder="Anything you'd like us to know about the installation…"
                className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white px-3.5 py-3 text-base focus:outline-none focus:ring-4 focus:ring-emerald-200 resize-none"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-1.5 flex gap-2">
          <input
            type="text"
            aria-label="Coupon code"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            value={couponCode}
            onChange={e => onCodeChange(e.target.value)}
            placeholder="Enter coupon code"
            className={`flex-1 rounded-xl border px-3.5 py-3 text-base focus:outline-none focus:ring-2 uppercase placeholder:normal-case placeholder:text-black/30 transition ${
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



