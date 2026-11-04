"use client"
// TOMORROW'S REMINDERS — the day-before text, sent by hand, one customer at a
// time: pick the customer, read (and edit) the text, confirm. Nothing here
// sends on its own. The server re-checks every rule shown on this screen.
import { useEffect, useState } from "react"
import Link from "next/link"
import { displayPhone } from "@/app/lib/smsRules"
import { Dialog, ComposeFields, SENDER_KEY, SMS_MODES, fmtWhen } from "../SmsCompose"

const fmtDay = iso => new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" })

export default function RemindersPage() {
  const [sender, setSender] = useState("")
  const [senderDraft, setSenderDraft] = useState("")
  const [data, setData] = useState(null)
  const [date, setDate] = useState("")
  const [error, setError] = useState("")
  const [compose, setCompose] = useState(null)   // appointment being texted

  useEffect(() => {
    try { const s = localStorage.getItem(SENDER_KEY) || ""; setSender(s); setSenderDraft(s) } catch {}
  }, [])
  function saveSender() {
    const v = senderDraft.trim().slice(0, 60)
    setSender(v)
    try { localStorage.setItem(SENDER_KEY, v) } catch {}
  }

  async function load(d = date) {
    setError("")
    try {
      const res = await fetch(`/api/sms/reminders${d ? `?date=${d}` : ""}`)
      const json = await res.json()
      if (!json.ok) { setError(json.error || "Could not load the appointments."); return }
      setData(json)
      if (!d) setDate(json.date)
    } catch { setError("Could not reach the server.") }
  }
  useEffect(() => { load("") }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const mode = data ? SMS_MODES[data.mode] : null

  // For a STOP given some other way (by phone, in person). A STOP texted to
  // our number is handled by Twilio and recorded when a send is refused.
  async function markStop(a) {
    if (!confirm(`Mark ${a.name || "this customer"} as opted out? No texts will go to ${displayPhone(a.phone)} until they agree again.`)) return
    const res = await fetch("/api/sms/consent", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: a.id, action: "optout", recordedBy: sender, note: "Marked in the admin" }),
    }).then(r => r.json()).catch(() => ({ ok: false, error: "No connection." }))
    if (!res.ok) alert(res.error || "Not saved.")
    load(date)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tomorrow&apos;s reminders</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Text each customer a reminder the day before. One at a time — you read the text and confirm before it goes.
          </p>
        </div>
        <Link href="/admin/today" className="text-sm font-semibold text-gray-600 hover:text-black">← Today</Link>
      </div>

      {/* Who is sending: kept on this device, written into the log. */}
      <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4">
        {sender ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-700">Sending as <strong className="text-gray-900">{sender}</strong></p>
            <button onClick={() => setSender("")} className="text-xs font-semibold text-gray-600 underline">Change</button>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); saveSender() }} className="flex flex-wrap items-end gap-2">
            <label className="flex-1 min-w-[12rem]">
              <span className="block text-sm font-semibold text-gray-800">Your name</span>
              <span className="block text-xs text-gray-600">Saved on this device and shown in the log of every text you send.</span>
              <input value={senderDraft} onChange={e => setSenderDraft(e.target.value)} maxLength={60} autoComplete="name"
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-300" />
            </label>
            <button type="submit" disabled={!senderDraft.trim()} className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">Save</button>
          </form>
        )}
      </div>

      {mode && <p role="status" className={`mb-3 rounded-xl border px-4 py-3 text-sm font-semibold ${mode.cls}`}>{mode.text}</p>}
      {data && !data.hours.ok && (
        <p role="alert" className="mb-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          🌙 {data.hours.reason}
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          Appointments on
          <input type="date" value={date} onChange={e => { setDate(e.target.value); load(e.target.value) }}
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm" />
        </label>
        <button onClick={() => load(date)} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">↻ Refresh</button>
        {data && <span className="text-sm text-gray-600">{fmtDay(data.date)} · {data.appointments.length} appointment{data.appointments.length !== 1 ? "s" : ""}</span>}
      </div>

      {error && <p role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {!data && !error && <p className="py-16 text-center text-gray-500">Loading…</p>}
      {data && data.appointments.length === 0 && (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center text-gray-600">No pending or confirmed appointments that day.</p>
      )}

      <ul className="space-y-3">
        {data?.appointments.map(a => {
          const last = a.sent[0]
          const canSend = !!sender && data.hours.ok && a.blockers.length === 0
          const why = !sender ? "Enter your name above first." : !data.hours.ok ? data.hours.reason : a.blockers[0]
          return (
            <li key={a.id} className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-gray-900">{a.name || "Customer"}</p>
                  <p className="text-sm text-gray-700">
                    {a.window ? <>Arriving <strong>{a.window}</strong></> : <span className="font-semibold text-amber-800">No time set ({a.time || "none"})</span>}
                    {a.city ? ` · ${a.city}` : ""}{a.crew.length ? ` · 👷 ${a.crew.join(", ")}` : ""}
                  </p>
                  <p className="text-sm text-gray-700">{a.phone ? displayPhone(a.phone) : <span className="text-red-700">No valid mobile ({a.rawPhone || "none"})</span>}</p>
                </div>
                <Link href={`/admin/bookings?open=${a.id}`} className="text-sm font-semibold text-gray-600 underline">Open booking</Link>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {a.consent && !a.optedOut ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800">
                    ✓ SMS consent · {a.consent.method === "booking_form" ? "booking form" : a.consent.method} · {fmtWhen(a.consent.givenAt)}
                  </span>
                ) : a.optedOut ? (
                  <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 font-semibold text-red-800">⛔ Opted out (STOP)</span>
                ) : (
                  <span className="rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1 font-semibold text-gray-700">No SMS consent</span>
                )}
                {last && (
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-semibold text-blue-800">
                    {last.mode === "dry-run" ? "Test-logged" : "Sent"} {fmtWhen(last.at)} by {last.by || "—"} · {last.status}{last.errorMessage ? ` (${last.errorMessage})` : ""}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" disabled={!canSend} onClick={() => setCompose(a)}
                  className="rounded-xl bg-[#E50914] px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-700">
                  📱 {last ? "Send reminder again" : "Send reminder"}
                </button>
                {a.consent && !a.optedOut && (
                  <button type="button" disabled={!sender} onClick={() => markStop(a)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-40">
                    Customer said STOP
                  </button>
                )}
                {!canSend && why && <p className="w-full text-sm text-gray-700">⚠️ {why}</p>}
              </div>
            </li>
          )
        })}
      </ul>

      {compose && <ComposeDialog a={compose} sender={sender} onClose={() => setCompose(null)} onSent={() => { setCompose(null); load(date) }} />}
    </div>
  )
}

function ComposeDialog({ a, sender, onClose, onSent }) {
  return (
    <Dialog title={`Reminder to ${a.name || "customer"}`} onClose={onClose}>
      <ComposeFields bookingId={a.id} kind="reminder" noun="reminder" phone={a.phone} draft={a.draft}
        sender={sender} last={a.sent[0]} onClose={onClose} onSent={onSent} />
    </Dialog>
  )
}
