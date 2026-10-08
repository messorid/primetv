"use client"

// The three-step installation quote at /get-installation-quote: furniture,
// mirrors, shelves, ceiling fans, gazebos, playsets.
//
// The question ids (items, qty, brand…) are what the API stores and what the
// notification email prints, so they are unchanged. What changed is the
// experience of answering them: connected labels, 16px inputs, the right
// keyboard per field, focus moving to each new step, a real progress
// indicator, and a clear list of what is missing instead of a dead button.

import { useEffect, useId, useMemo, useRef, useState } from "react"
import {
  TextField, PhoneField, EmailField, ZipField, TextAreaField, SelectField,
  ChoiceGroup, ErrorSummary, FormAlert, StepHeading,
  PrimaryButton, SecondaryButton, focusField,
} from "./forms/FormKit"
import {
  digitsOnly, isValidUSPhone, isValidEmail, isValidName, isValidZip,
  localToday, validate, MESSAGES,
} from "../lib/formValidation"

const PHONE_DISPLAY = "(615) 669-0251"
const PHONE_HREF = "tel:+16156690251"
const SMS_HREF = "sms:+16156690251"

const SERVICES = [
  { value: "furniture",      label: "Furniture Assembly",          emoji: "🪑", desc: "Beds, dressers, desks, IKEA and office furniture" },
  { value: "mirror_picture", label: "Picture / Mirror Hanging",    emoji: "🪞", desc: "Mirrors, art, gallery walls" },
  { value: "shelves_wall",   label: "Shelves / Wall Installation", emoji: "📐", desc: "Floating shelves, curtain rods, blinds, cabinets" },
  { value: "ceiling_fan",    label: "Ceiling Fan Installation",    emoji: "🌀", desc: "Replace a fan or swap a light for one" },
  { value: "gazebo",         label: "Gazebo / Pergola Assembly",   emoji: "⛺", desc: "Hardtop and soft-top gazebos, pergolas" },
  { value: "playset",        label: "Playground / Playset",        emoji: "🛝", desc: "Swing sets and wooden playsets" },
  { value: "other",          label: "Other Installation",          emoji: "🔧", desc: "Tell us what it is" },
]

const WALLS = ["Drywall", "Plaster", "Brick / Masonry", "Tile", "Concrete", "Not sure"]

// Step 2 questions per service. Ids are unchanged — they are stored and
// emailed as-is. Everything here is optional except the description for
// "Other", which is the only thing that tells us what the job is.
const SERVICE_QUESTIONS = {
  furniture: [
    { id: "items", label: "What furniture do you need assembled?", type: "textarea", placeholder: "e.g. IKEA KALLAX shelving unit, MALM bed frame, HEMNES dresser", hint: "List each piece. Model names help us estimate the time." },
    { id: "qty", label: "How many pieces?", type: "number", placeholder: "1" },
    { id: "brand", label: "Brand / Model", type: "text", placeholder: "e.g. IKEA, Wayfair, Amazon Basics" },
    { id: "product_link", label: "Product link", type: "url", placeholder: "https://…", hint: "Paste the store link if you have it." },
  ],
  mirror_picture: [
    { id: "items", label: "What do you need hung?", type: "textarea", placeholder: "e.g. Large bathroom mirror, 3 framed prints, gallery wall of 8 frames" },
    { id: "qty", label: "Number of items", type: "number", placeholder: "1" },
    { id: "dimensions", label: "Approximate dimensions", type: "text", placeholder: "e.g. 48\" x 36\" mirror" },
    { id: "weight", label: "Approximate weight", type: "text", placeholder: "e.g. 30 lbs", hint: "A guess is fine — it decides which anchors we bring." },
    { id: "wall_type", label: "Wall type", type: "select", options: WALLS },
  ],
  shelves_wall: [
    { id: "items", label: "What needs to be installed?", type: "textarea", placeholder: "e.g. 3 floating shelves, 2 curtain rods, 1 whiteboard" },
    { id: "qty", label: "Number of items", type: "number", placeholder: "1" },
    { id: "wall_type", label: "Wall type", type: "select", options: WALLS },
    { id: "product_link", label: "Product link", type: "url", placeholder: "https://…" },
  ],
  ceiling_fan: [
    { id: "fan_type", label: "What kind of fan?", type: "select", options: ["Standard", "With LED light", "Remote control", "Low profile / flush mount", "Outdoor / porch", "Smart WiFi", "For a high or vaulted ceiling", "Not sure"] },
    { id: "brand", label: "Brand / Model", type: "text", placeholder: "e.g. Hunter, Hampton Bay, Harbor Breeze" },
    { id: "product_link", label: "Product link", type: "url", placeholder: "https://…" },
    { id: "existing", label: "What is there now?", type: "select", options: ["An existing ceiling fan", "A light fixture", "Nothing — bare ceiling", "Not sure"], hint: "A bare ceiling with no wiring needs an electrician first — we'll tell you." },
    { id: "ceiling_height", label: "Approximate ceiling height", type: "text", placeholder: "e.g. 8 ft, 10 ft, vaulted" },
    { id: "qty", label: "How many fans?", type: "number", placeholder: "1" },
  ],
  gazebo: [
    { id: "brand", label: "Brand", type: "text", placeholder: "e.g. Yardistry, Backyard Discovery, Purple Leaf" },
    { id: "model", label: "Model / Name", type: "text", placeholder: "e.g. Yardistry 12x14 Cedar Gazebo" },
    { id: "dimensions", label: "Dimensions", type: "text", placeholder: "e.g. 12 ft x 14 ft" },
    { id: "product_link", label: "Product link", type: "url", placeholder: "https://…" },
    { id: "surface", label: "Installation surface", type: "select", options: ["Grass", "Gravel", "Concrete / Patio", "Pavers", "Wood Deck", "Other"] },
    { id: "delivered", label: "Is the gazebo already delivered?", type: "select", options: ["Yes, it's already here", "Not yet — I'll let you know when it arrives", "Not sure yet"] },
  ],
  playset: [
    { id: "brand", label: "Brand", type: "text", placeholder: "e.g. Backyard Discovery, Gorilla Playsets, KidKraft" },
    { id: "model", label: "Model", type: "text", placeholder: "e.g. Skyfort II, Canyon Creek, Outing III" },
    { id: "product_link", label: "Product link", type: "url", placeholder: "https://…" },
    { id: "surface", label: "Ground surface", type: "select", options: ["Grass", "Mulch", "Rubber mulch", "Pea gravel", "Level dirt", "Other"] },
    { id: "level", label: "Is the ground level?", type: "select", options: ["Yes, fairly level", "Slight slope", "Noticeable slope", "Not sure"] },
    { id: "delivered", label: "Is the playset already delivered?", type: "select", options: ["Yes, all boxes are here", "Not yet — I'll let you know when it arrives", "Not sure yet"] },
    { id: "anchors", label: "Did it come with a ground anchor kit?", type: "select", options: ["Yes", "No", "Not sure"] },
  ],
  other: [
    { id: "description", label: "Describe what you need installed", type: "textarea", required: true, placeholder: "What it is, roughly how big, and where it's going", hint: "The more detail, the more accurate the quote." },
  ],
}

const NO_QUESTIONS = []

const STEP_NAMES = ["Service", "Details", "Contact"]
const CONTACT_LABELS = { name: "Name", phone: "Phone", email: "Email", zip: "ZIP code" }

function DetailQuestion({ q, id, value, onChange, error }) {
  const common = { id, label: q.label, value, onChange, error, hint: q.hint, required: q.required, optional: !q.required }
  if (q.type === "textarea") return <TextAreaField {...common} placeholder={q.placeholder} rows={4} maxLength={1000} />
  if (q.type === "select")   return <SelectField {...common} options={q.options} />
  if (q.type === "number")
    return (
      <TextField {...common} inputMode="numeric" pattern="[0-9]*" maxLength={3} placeholder={q.placeholder}
        onChange={v => onChange(digitsOnly(v).slice(0, 3))} hint={q.hint || "A number, like 2."} />
    )
  if (q.type === "url")
    return <TextField {...common} type="url" inputMode="url" autoCapitalize="none" spellCheck={false} placeholder={q.placeholder} />
  return <TextField {...common} placeholder={q.placeholder} />
}

export default function InstallationQuoteForm() {
  const uid = useId()
  const fid = name => `${uid}-${name}`

  const [step, setStep] = useState(1)
  const [service, setService] = useState("")
  const [answers, setAnswers] = useState({})
  const [contact, setContact] = useState({ name: "", phone: "", email: "", address: "", zip: "", date: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sendError, setSendError] = useState(false)

  const [touched, setTouched] = useState({})
  const [tried, setTried] = useState({}) // per step: has Continue/Submit been pressed

  const headingRef = useRef(null)
  const firstRender = useRef(true)

  // Move focus to the new step's heading — but not on first load, which would
  // yank the page down to the form before anyone has touched it.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    headingRef.current?.focus()
  }, [step, submitted])

  // A module-level empty list, not a fresh [] — a new array every render would
  // make the validation below recompute on every keystroke for nothing.
  const questions = (service && SERVICE_QUESTIONS[service]) || NO_QUESTIONS

  const errors = useMemo(() => {
    if (step === 1) return validate([["service", !!service, MESSAGES.choose("the service you need")]])
    if (step === 2) return validate(questions.filter(q => q.required).map(q => [
      `q-${q.id}`, String(answers[q.id] || "").trim().length >= 5, "Please describe the job in a few words.",
    ]))
    return validate([
      ["name",  isValidName(contact.name),       MESSAGES.name],
      ["phone", isValidUSPhone(contact.phone),   MESSAGES.phone],
      ["email", isValidEmail(contact.email),     MESSAGES.email],
      ["zip",   !contact.zip || isValidZip(contact.zip), MESSAGES.zip],
    ])
  }, [step, service, questions, answers, contact])

  const shown = field => (tried[step] || touched[field]) ? errors[field] : undefined
  const blur = field => () => setTouched(t => ({ ...t, [field]: true }))
  const setAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }))
  const setContactField = (field, val) => setContact(prev => ({ ...prev, [field]: val }))

  function next() {
    setTried(t => ({ ...t, [step]: true }))
    if (Object.keys(errors).length) return
    setStep(s => s + 1)
  }
  function back() { setStep(s => s - 1) }

  async function handleSubmit(e) {
    e.preventDefault()
    setTried(t => ({ ...t, 3: true }))
    if (Object.keys(errors).length) return
    setSendError(false)
    setSubmitting(true)
    try {
      const res = await fetch("/api/installation-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          answers,
          contact: { ...contact, name: contact.name.trim(), email: contact.email.trim() },
        }),
      })
      if (res.ok) setSubmitted(true)
      else setSendError(true)
    } catch {
      setSendError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    const label = SERVICES.find(s => s.value === service)?.label
    return (
      <div role="status" className="mx-auto max-w-lg px-4 py-14 text-center">
        <div aria-hidden="true" className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✓</div>
        <h2 ref={headingRef} tabIndex={-1} className="mb-2 text-2xl font-extrabold text-black focus:outline-none">
          Quote request received!
        </h2>
        <p className="mb-6 text-[15px] leading-relaxed text-black/65">
          We&rsquo;ll review your {label ? label.toLowerCase() : "request"} and reply with pricing and
          availability.
        </p>
        <div className="rounded-2xl border border-black/10 bg-gray-50 p-5 text-left">
          <p className="text-sm font-bold text-black">Speed it up</p>
          <p className="mt-1 text-sm leading-relaxed text-black/65">
            Text us a photo of the area or the box — it helps us quote accurately.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <a href={SMS_HREF} className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-[#E50914] px-5 text-sm font-bold text-white hover:bg-red-700">
              Text a photo
            </a>
            <a href={PHONE_HREF} className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border-2 border-black/12 px-5 text-sm font-semibold hover:bg-black/5">
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress — readable at every width, announced as a list */}
      <ol aria-label="Progress" className="mb-8 flex items-center gap-2">
        {STEP_NAMES.map((name, i) => {
          const n = i + 1
          const done = step > n
          const current = step === n
          return (
            <li key={name} aria-current={current ? "step" : undefined} className="flex flex-1 items-center gap-2">
              <span className={`flex size-8 flex-none items-center justify-center rounded-full text-xs font-bold transition-colors ${
                done || current ? "bg-[#E50914] text-white" : "bg-black/[0.06] text-black/45"
              } ${current ? "ring-4 ring-red-100" : ""}`}>
                {done ? <span aria-hidden="true">✓</span> : n}
              </span>
              <span className={`text-xs font-semibold ${current ? "text-black" : "text-black/45"}`}>
                {name}<span className="sr-only">{done ? " (done)" : current ? " (current step)" : ""}</span>
              </span>
              {n < STEP_NAMES.length && (
                <span aria-hidden="true" className={`h-0.5 flex-1 ${step > n ? "bg-[#E50914]" : "bg-black/10"}`} />
              )}
            </li>
          )
        })}
      </ol>

      {/* Step 1 — Service */}
      {step === 1 && (
        <div>
          <StepHeading ref={headingRef} step={1} total={3} sub="Choose the one that best describes your project.">
            What do you need installed?
          </StepHeading>
          <ChoiceGroup
            id={fid("service")} legend="Service" required options={SERVICES}
            value={service} onChange={setService} error={shown("service")}
          />
          {tried[1] && (
            <div className="mt-5"><ErrorSummary errors={errors} labels={{ service: "Service" }} onJump={k => focusField(fid(k))} /></div>
          )}
          <PrimaryButton type="button" onClick={next} className="mt-7 w-full">Continue →</PrimaryButton>
        </div>
      )}

      {/* Step 2 — Details */}
      {step === 2 && (
        <div>
          <StepHeading ref={headingRef} step={2} total={3}
            sub="All optional — answer what you know. It helps us give an accurate price.">
            Tell us about your project
          </StepHeading>
          <div className="space-y-5">
            {questions.map(q => (
              <DetailQuestion
                key={q.id} q={q} id={fid(`q-${q.id}`)}
                value={answers[q.id] || ""} onChange={v => setAnswer(q.id, v)}
                error={shown(`q-${q.id}`)}
              />
            ))}
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
              <strong>Photos help.</strong> After submitting, you can text photos of the area or the
              box to <a href={SMS_HREF} className="font-semibold underline underline-offset-2">{PHONE_DISPLAY}</a>.
            </div>
          </div>
          {tried[2] && Object.keys(errors).length > 0 && (
            <div className="mt-5"><ErrorSummary errors={errors} labels={{}} onJump={k => focusField(fid(k))} /></div>
          )}
          <div className="mt-7 flex gap-3">
            <SecondaryButton onClick={back} className="flex-none">← Back</SecondaryButton>
            <PrimaryButton type="button" onClick={next} className="flex-1">Continue →</PrimaryButton>
          </div>
        </div>
      )}

      {/* Step 3 — Contact */}
      {step === 3 && (
        <form onSubmit={handleSubmit} noValidate>
          <StepHeading ref={headingRef} step={3} total={3}
            sub={<>We&rsquo;ll reply with your quote and availability. Fields marked <span className="text-[#E50914]">*</span> are required.</>}>
            Your contact information
          </StepHeading>
          <div className="space-y-5">
            <TextField
              id={fid("name")} label="Full name" required autoComplete="name" autoCapitalize="words"
              value={contact.name} onChange={v => setContactField("name", v)} onBlur={blur("name")}
              error={shown("name")} placeholder="Jane Smith" enterKeyHint="next"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <PhoneField
                id={fid("phone")} label="Mobile phone" required
                value={contact.phone} onChange={v => setContactField("phone", v)} onBlur={blur("phone")}
                error={shown("phone")} enterKeyHint="next"
              />
              <EmailField
                id={fid("email")} label="Email" required
                value={contact.email} onChange={v => setContactField("email", v)} onBlur={blur("email")}
                error={shown("email")} enterKeyHint="next"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-[1fr_10rem]">
              <TextField
                id={fid("address")} label="Street address" optional autoComplete="street-address"
                value={contact.address} onChange={v => setContactField("address", v)}
                placeholder="123 Main St, Nashville" hint="Helps us plan the visit."
              />
              <ZipField
                id={fid("zip")} label="ZIP code" optional
                value={contact.zip} onChange={v => setContactField("zip", v)} onBlur={blur("zip")}
                error={shown("zip")} hint="5 digits."
              />
            </div>
            <TextField
              id={fid("date")} label="Preferred date" optional type="date" min={localToday()}
              value={contact.date} onChange={v => setContactField("date", v)}
              hint="We'll confirm the exact time with you."
            />
          </div>

          {tried[3] && (
            <div className="mt-5"><ErrorSummary errors={errors} labels={CONTACT_LABELS} onJump={k => focusField(fid(k))} /></div>
          )}
          {sendError && (
            <div className="mt-5">
              <FormAlert tone="error">
                We couldn&rsquo;t send that just now — your answers are still here, so try again in a
                moment. Or call or text us at{" "}
                <a href={PHONE_HREF} className="font-semibold underline underline-offset-2">{PHONE_DISPLAY}</a>.
              </FormAlert>
            </div>
          )}

          <div className="mt-7 flex gap-3">
            <SecondaryButton onClick={back} className="flex-none">← Back</SecondaryButton>
            <PrimaryButton type="submit" busy={submitting} className="flex-1">Send request</PrimaryButton>
          </div>
        </form>
      )}
    </div>
  )
}
