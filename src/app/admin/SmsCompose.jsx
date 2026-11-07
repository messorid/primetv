"use client"
// The dialog every outgoing text goes through: read it, edit it if needed,
// confirm. Used by the reminders screen and the review request. The server
// re-checks every rule shown here.
import { useEffect, useMemo, useState } from "react"
import { finalizeBody, segments, displayPhone, MAX_SMS_CHARS } from "@/app/lib/smsRules"
import { SMS_PREFIX, SMS_SUFFIX } from "@/app/lib/smsConfig"

export const SENDER_KEY = "primetv-sms-sender"

export const fmtWhen = iso => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })

export const SMS_MODES = {
  "dry-run": { cls: "border-amber-300 bg-amber-50 text-amber-900", text: "Test mode — texts are recorded here but NOT sent to customers." },
  test:      { cls: "border-blue-300 bg-blue-50 text-blue-900",   text: "Twilio test mode — the request goes to Twilio's test API; nothing is delivered." },
  live:      { cls: "border-emerald-300 bg-emerald-50 text-emerald-900", text: "Live — texts are delivered to customers." },
}

export function Dialog({ title, onClose, children }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 p-0 sm:items-center sm:p-4" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-gray-500 hover:text-gray-900">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// `noun` names the text in the resend warning ("A reminder already went out").
// `mustInclude` is text an edit can't remove, like the review link. `blocked`
// is a reason it can't be sent right now.
export function ComposeFields({ bookingId, kind, noun, phone, draft, sender, last, mustInclude, blocked, children, onClose, onSent }) {
  const [text, setText] = useState(draft)
  const [again, setAgain] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const final = useMemo(() => finalizeBody(text), [text])
  const seg = segments(final)
  const tooLong = final.length > MAX_SMS_CHARS
  const missing = !!mustInclude && !final.includes(mustInclude)

  async function send() {
    setBusy(true); setErr("")
    try {
      const res = await fetch("/api/sms/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, kind, body: final, sentBy: sender, resend: again }),
      })
      const json = await res.json()
      if (json.ok) onSent(json)
      else setErr(json.error || "Not sent.")
    } catch { setErr("No connection. Nothing was sent.") } finally { setBusy(false) }
  }

  return (
    <>
      <label htmlFor="sms-text" className="block text-sm font-semibold text-gray-800">Message (you can edit it)</label>
      <textarea id="sms-text" value={text} onChange={e => setText(e.target.value)} rows={6}
        className="mt-1.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-300" />
      <p className="mt-1 text-xs text-gray-600">
        Always starts with “{SMS_PREFIX}” and ends with “{SMS_SUFFIX}” — added back if removed.
        {" "}{seg.chars} characters · {seg.parts} text{seg.parts !== 1 ? "s" : ""}{seg.encoding === "Unicode" ? " (an emoji or special character makes texts shorter)" : ""}.
      </p>
      {final !== text.trim() && (
        <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-800">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-600">Will be sent as</p>
          {final}
        </div>
      )}
      {children}
      <p className="mt-3 text-sm text-gray-700">To <strong>{displayPhone(phone)}</strong>{sender ? <> · as <strong>{sender}</strong></> : null}</p>
      {last && (
        <label className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <input type="checkbox" checked={again} onChange={e => setAgain(e.target.checked)} className="mt-0.5 size-4" />
          <span>
            {last.mode === "dry-run" ? `A test of this ${noun} was logged` : `A ${noun} already went out`} {fmtWhen(last.at)} by {last.by || "—"}. Yes, send it again.
          </span>
        </label>
      )}
      {tooLong && <p className="mt-2 text-sm font-semibold text-red-700">Too long — keep it under {MAX_SMS_CHARS} characters.</p>}
      {missing && <p className="mt-2 text-sm font-semibold text-red-700">The message must include this link: {mustInclude}</p>}
      {blocked && <p className="mt-2 text-sm font-semibold text-red-700">{blocked}</p>}
      {err && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
      <div className="mt-5 flex gap-2">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700">Cancel</button>
        <button type="button" onClick={send} disabled={busy || !sender || !!blocked || (last && !again) || tooLong || missing}
          className="flex-1 rounded-xl bg-[#E50914] py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-40">
          {busy ? "Sending…" : "Confirm & send"}
        </button>
      </div>
    </>
  )
}

// Who is sending, kept on this device and written into the log of every text.
export function useSmsSender() {
  const [sender, setSender] = useState("")
  useEffect(() => { try { setSender(localStorage.getItem(SENDER_KEY) || "") } catch {} }, [])
  const save = v => {
    const name = String(v || "").trim().slice(0, 60)
    setSender(name)
    try { name ? localStorage.setItem(SENDER_KEY, name) : localStorage.removeItem(SENDER_KEY) } catch {}
  }
  return [sender, save]
}

export function SenderPrompt({ onSave }) {
  const [draft, setDraft] = useState("")
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(draft) }} className="flex flex-wrap items-end gap-2">
      <label className="flex-1 min-w-[12rem]">
        <span className="block text-sm font-semibold text-gray-800">Your name</span>
        <span className="block text-xs text-gray-600">Saved on this device and shown in the log of every text you send.</span>
        <input value={draft} onChange={e => setDraft(e.target.value)} maxLength={60} autoComplete="name"
          className="mt-1.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-300" />
      </label>
      <button type="submit" disabled={!draft.trim()} className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">Save</button>
    </form>
  )
}
