"use client"
// TEAM — who besides the owner can sign in to the admin, and who else hears
// about new bookings and quotes (by email and WhatsApp). Owner only: the
// middleware keeps sellers out of this page and /api/staff refuses them.
//
// A seller sees bookings, leads, customers and messages and assigns crews,
// but no money or pay, can't complete a job and can't delete anything.
import { useEffect, useState } from "react"

const BLANK = { name: "", email: "", password: "", whatsapp: "", notifyBookings: true, notifyQuotes: true }
const fmt = iso => (iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "never")

export default function TeamPage() {
  const [staff, setStaff] = useState(null)
  const [error, setError] = useState("")
  const [form, setForm] = useState(BLANK)
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formErr, setFormErr] = useState("")

  async function load() {
    try {
      const j = await fetch("/api/staff").then(r => r.json())
      if (j.ok) { setStaff(j.staff); setError("") } else setError(j.error || "Could not load the team.")
    } catch { setError("Could not reach the server.") }
  }
  useEffect(() => { load() }, [])

  async function save(method, body) {
    const j = await fetch("/api/staff", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(r => r.json()).catch(() => ({ ok: false, error: "No connection." }))
    if (j.ok) await load()
    return j
  }

  async function add(e) {
    e.preventDefault()
    setBusy(true); setFormErr("")
    const j = await save("POST", form)
    setBusy(false)
    if (j.ok) { setForm(BLANK); setAdding(false) } else setFormErr(j.error || "Not saved.")
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Team</h1>
          <p className="mt-0.5 text-sm text-gray-600">
            Sellers sign in with their own email and password. They see bookings, leads, customers and messages, and assign
            crews — but no money or pay, they can&apos;t mark jobs completed and they can&apos;t delete anything.
          </p>
        </div>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className="rounded-xl bg-[#E50914] px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700">
            + Add seller
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={add} className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-gray-900">New seller</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} autoComplete="off" />
            <Field label="Email (to sign in and get alerts)" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} autoComplete="off" />
            <Field label="Password (8+ characters)" type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} autoComplete="new-password" />
            <Field label="WhatsApp, with country code (optional)" value={form.whatsapp} onChange={v => setForm(f => ({ ...f, whatsapp: v }))} placeholder="+1 615 555 0100" />
          </div>
          <Toggles value={form} onChange={v => setForm(f => ({ ...f, ...v }))} />
          {formErr && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{formErr}</p>}
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => { setAdding(false); setForm(BLANK); setFormErr("") }} className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700">Cancel</button>
            <button type="submit" disabled={busy} className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">{busy ? "Saving…" : "Add seller"}</button>
          </div>
        </form>
      )}

      {error && <p role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {!staff && !error && <p className="py-12 text-center text-gray-500">Loading…</p>}
      {staff?.length === 0 && <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center text-gray-600">No sellers yet.</p>}

      <ul className="space-y-3">
        {staff?.map(m => <Member key={m.id} m={m} save={save} />)}
      </ul>
    </div>
  )
}

function Member({ m, save }) {
  const [pw, setPw] = useState("")
  const [msg, setMsg] = useState("")
  const [wa, setWa] = useState(m.whatsapp)

  async function patch(body, ok) {
    setMsg("")
    const j = await save("PATCH", { id: m.id, ...body })
    setMsg(j.ok ? ok : j.error || "Not saved.")
  }

  return (
    <li className={`rounded-2xl border bg-white p-5 shadow-sm ${m.active ? "border-gray-200" : "border-dashed border-gray-300 opacity-70"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-bold text-gray-900">{m.name} <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">Seller</span></p>
          <p className="text-sm text-gray-700">{m.email}</p>
          <p className="text-xs text-gray-500">Last sign-in: {fmt(m.lastLoginAt)}</p>
        </div>
        <button type="button" onClick={() => patch({ active: !m.active }, m.active ? "Access removed." : "Access restored.")}
          className={`rounded-xl border px-3 py-2 text-xs font-bold ${m.active ? "border-red-200 text-red-700 hover:bg-red-50" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"}`}>
          {m.active ? "Remove access" : "Restore access"}
        </button>
      </div>

      <Toggles value={m} onChange={v => patch(v, "Saved.")} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <form onSubmit={e => { e.preventDefault(); patch({ whatsapp: wa }, "WhatsApp saved.") }} className="flex items-end gap-2">
          <Field label="WhatsApp" value={wa} onChange={setWa} placeholder="+58 424 000 0000" />
          <button type="submit" className="rounded-xl border border-gray-300 px-3 py-2.5 text-xs font-bold text-gray-800">Save</button>
        </form>
        <form onSubmit={e => { e.preventDefault(); patch({ password: pw }, "Password changed.").then(() => setPw("")) }} className="flex items-end gap-2">
          <Field label="New password" type="password" value={pw} onChange={setPw} autoComplete="new-password" />
          <button type="submit" disabled={!pw} className="rounded-xl border border-gray-300 px-3 py-2.5 text-xs font-bold text-gray-800 disabled:opacity-40">Change</button>
        </form>
      </div>
      {msg && <p role="status" className="mt-3 text-sm font-semibold text-gray-700">{msg}</p>}
    </li>
  )
}

function Toggles({ value, onChange }) {
  return (
    <fieldset className="mt-4">
      <legend className="text-sm font-semibold text-gray-800">Send them an email and WhatsApp for every new…</legend>
      <div className="mt-2 flex flex-wrap gap-4">
        {[["notifyBookings", "Booking"], ["notifyQuotes", "Quote request"]].map(([k, label]) => (
          <label key={k} className="flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={!!value[k]} onChange={e => onChange({ [k]: e.target.checked })} className="size-4" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Field({ label, value, onChange, type = "text", ...rest }) {
  return (
    <label className="block flex-1">
      <span className="block text-sm font-semibold text-gray-800">{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} {...rest}
        className="mt-1.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-300" />
    </label>
  )
}
