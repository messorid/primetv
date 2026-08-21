"use client"
import { useState } from "react"

const SERVICES = [
  { value: "furniture", label: "Furniture Assembly", emoji: "🪑" },
  { value: "mirror_picture", label: "Picture / Mirror Hanging", emoji: "🪞" },
  { value: "shelves_wall", label: "Shelves / Wall Installation", emoji: "📐" },
  { value: "gazebo", label: "Gazebo / Pergola Assembly", emoji: "⛺" },
  { value: "other", label: "Other Installation", emoji: "🔧" },
]

const SERVICE_QUESTIONS = {
  furniture: [
    { id: "items", label: "What furniture do you need assembled?", type: "textarea", placeholder: "e.g. IKEA KALLAX shelving unit, MALM bed frame, HEMNES dresser..." },
    { id: "qty", label: "How many pieces?", type: "number", placeholder: "1" },
    { id: "brand", label: "Brand / Model (if known)", type: "text", placeholder: "e.g. IKEA, Wayfair, Amazon Basics..." },
    { id: "product_link", label: "Product link (optional)", type: "url", placeholder: "https://..." },
  ],
  mirror_picture: [
    { id: "items", label: "What do you need hung?", type: "textarea", placeholder: "e.g. Large bathroom mirror, 3 framed art prints, gallery wall of 8 frames..." },
    { id: "qty", label: "Number of items", type: "number", placeholder: "1" },
    { id: "dimensions", label: "Approximate dimensions", type: "text", placeholder: "e.g. 48\" x 36\" mirror" },
    { id: "weight", label: "Approximate weight (if known)", type: "text", placeholder: "e.g. 30 lbs" },
    { id: "wall_type", label: "Wall type", type: "select", options: ["Drywall", "Plaster", "Brick / Masonry", "Tile", "Concrete", "Not sure"] },
  ],
  shelves_wall: [
    { id: "items", label: "What needs to be installed?", type: "textarea", placeholder: "e.g. 3 floating shelves, 2 curtain rods, 1 whiteboard..." },
    { id: "qty", label: "Number of items", type: "number", placeholder: "1" },
    { id: "wall_type", label: "Wall type", type: "select", options: ["Drywall", "Plaster", "Brick / Masonry", "Tile", "Concrete", "Not sure"] },
    { id: "product_link", label: "Product link (optional)", type: "url", placeholder: "https://..." },
  ],
  gazebo: [
    { id: "brand", label: "Brand", type: "text", placeholder: "e.g. Yardistry, Backyard Discovery, Purple Leaf..." },
    { id: "model", label: "Model / Name", type: "text", placeholder: "e.g. Yardistry 12x14 Cedar Gazebo" },
    { id: "dimensions", label: "Dimensions", type: "text", placeholder: "e.g. 12 ft x 14 ft" },
    { id: "product_link", label: "Product link (optional)", type: "url", placeholder: "https://..." },
    { id: "surface", label: "Installation surface", type: "select", options: ["Grass", "Gravel", "Concrete / Patio", "Pavers", "Wood Deck", "Other"] },
    { id: "delivered", label: "Is the gazebo already delivered?", type: "select", options: ["Yes, it's already here", "Not yet — I'll let you know when it arrives", "Not sure yet"] },
  ],
  other: [
    { id: "description", label: "Describe what you need installed", type: "textarea", placeholder: "Please describe the installation project in as much detail as possible..." },
  ],
}

const INPUT_CLASS = "w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914]/30 focus:border-[#E50914] transition"
const LABEL_CLASS = "block text-sm font-semibold text-black/80 mb-1.5"

function Field({ q, value, onChange }) {
  if (q.type === "textarea") {
    return (
      <div>
        <label className={LABEL_CLASS}>{q.label}</label>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={q.placeholder}
          rows={3}
          className={INPUT_CLASS + " resize-none"}
        />
      </div>
    )
  }
  if (q.type === "select") {
    return (
      <div>
        <label className={LABEL_CLASS}>{q.label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} className={INPUT_CLASS + " bg-white"}>
          <option value="">Select...</option>
          {q.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }
  return (
    <div>
      <label className={LABEL_CLASS}>{q.label}</label>
      <input
        type={q.type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={q.placeholder}
        className={INPUT_CLASS}
      />
    </div>
  )
}

export default function InstallationQuoteForm() {
  const [step, setStep] = useState(1)
  const [service, setService] = useState("")
  const [answers, setAnswers] = useState({})
  const [contact, setContact] = useState({ name: "", phone: "", email: "", address: "", zip: "", date: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const serviceQuestions = service ? SERVICE_QUESTIONS[service] : []

  function setAnswer(id, val) {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  function setContactField(field, val) {
    setContact(prev => ({ ...prev, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!contact.name || !contact.phone || !contact.email) {
      setError("Please fill in your name, phone and email.")
      return
    }
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/installation-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, answers, contact }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError("Something went wrong. Please call us at (615) 669-0251.")
      }
    } catch {
      setError("Something went wrong. Please call us at (615) 669-0251.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16 px-6">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-extrabold text-black mb-2">Quote Request Received!</h2>
        <p className="text-black/60 mb-6 max-w-md mx-auto">
          We'll review your request and get back to you shortly with pricing and availability.
        </p>
        <p className="text-sm text-black/50">
          Questions? Call us at{" "}
          <a href="tel:+16156690251" className="font-semibold text-[#E50914]">(615) 669-0251</a>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(n => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= n ? "bg-[#E50914] text-white" : "bg-black/5 text-black/40"
            }`}>{n}</div>
            <div className={`flex-1 h-0.5 ${n < 3 ? (step > n ? "bg-[#E50914]" : "bg-black/10") : "hidden"}`} />
          </div>
        ))}
        <span className="text-xs text-black/40 font-medium ml-2">
          {step === 1 ? "Service" : step === 2 ? "Details" : "Contact"}
        </span>
      </div>

      {/* Step 1 — Service */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-extrabold text-black mb-2">What do you need installed?</h2>
          <p className="text-sm text-black/55 mb-6">Select the service that best describes your project.</p>
          <div className="grid gap-3 mb-8">
            {SERVICES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setService(s.value)}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                  service === s.value
                    ? "border-[#E50914] bg-red-50/60 shadow-sm"
                    : "border-black/10 hover:border-black/25"
                }`}
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="font-semibold text-black">{s.label}</span>
                {service === s.value && (
                  <span className="ml-auto text-[#E50914] font-bold text-lg">✓</span>
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!service}
            onClick={() => setStep(2)}
            className="w-full rounded-full bg-[#E50914] py-3.5 text-sm font-bold text-white disabled:opacity-40 hover:bg-red-700 transition"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2 — Service-specific questions */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-extrabold text-black mb-2">Tell us about your project</h2>
          <p className="text-sm text-black/55 mb-6">This helps us give you an accurate quote.</p>
          <div className="space-y-4 mb-8">
            {serviceQuestions.map((q) => (
              <Field
                key={q.id}
                q={q}
                value={answers[q.id] || ""}
                onChange={val => setAnswer(q.id, val)}
              />
            ))}
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
              <strong>Photos:</strong> After submitting, you can text us photos of the project area to (615) 669-0251 to help us quote accurately.
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="flex-none rounded-full border border-black/15 px-6 py-3.5 text-sm font-semibold text-black hover:bg-black/5 transition">
              ← Back
            </button>
            <button type="button" onClick={() => setStep(3)}
              className="flex-1 rounded-full bg-[#E50914] py-3.5 text-sm font-bold text-white hover:bg-red-700 transition">
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Contact info */}
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-extrabold text-black mb-2">Your contact information</h2>
          <p className="text-sm text-black/55 mb-6">We'll reach out with your quote and availability.</p>
          <div className="space-y-4 mb-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Full Name *</label>
                <input type="text" value={contact.name} onChange={e => setContactField("name", e.target.value)}
                  placeholder="John Smith" className={INPUT_CLASS} required />
              </div>
              <div>
                <label className={LABEL_CLASS}>Phone *</label>
                <input type="tel" value={contact.phone} onChange={e => setContactField("phone", e.target.value)}
                  placeholder="(615) 000-0000" className={INPUT_CLASS} required />
              </div>
            </div>
            <div>
              <label className={LABEL_CLASS}>Email *</label>
              <input type="email" value={contact.email} onChange={e => setContactField("email", e.target.value)}
                placeholder="you@email.com" className={INPUT_CLASS} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Address</label>
                <input type="text" value={contact.address} onChange={e => setContactField("address", e.target.value)}
                  placeholder="123 Main St, Nashville" className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>ZIP Code</label>
                <input type="text" value={contact.zip} onChange={e => setContactField("zip", e.target.value)}
                  placeholder="37201" className={INPUT_CLASS} />
              </div>
            </div>
            <div>
              <label className={LABEL_CLASS}>Preferred date (optional)</label>
              <input type="date" value={contact.date} onChange={e => setContactField("date", e.target.value)}
                className={INPUT_CLASS} />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-medium mb-4">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)}
              className="flex-none rounded-full border border-black/15 px-6 py-3.5 text-sm font-semibold text-black hover:bg-black/5 transition">
              ← Back
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 rounded-full bg-[#E50914] py-3.5 text-sm font-bold text-white disabled:opacity-50 hover:bg-red-700 transition">
              {submitting ? "Sending..." : "Submit Quote Request"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
