"use client"
// Ask for a Google review by text, for one finished job, when someone presses
// the button. Nothing here sends on its own, and it asks every customer the
// same way: no choosing by how happy they were, and nothing offered in return.
import { useEffect, useState } from "react"
import { Dialog, ComposeFields, SENDER_KEY, SMS_MODES, fmtWhen } from "./SmsCompose"

export default function ReviewSmsDialog({ bookingId, name, onClose, onSent }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [sender, setSender] = useState("")
  const [senderDraft, setSenderDraft] = useState("")
  const [done, setDone] = useState(null)

  useEffect(() => {
    try { const s = localStorage.getItem(SENDER_KEY) || ""; setSender(s); setSenderDraft(s) } catch {}
    let live = true
    fetch(`/api/sms/review?bookingId=${encodeURIComponent(bookingId)}`)
      .then(r => r.json())
      .then(json => { if (!live) return; if (json.ok) setData(json); else setError(json.error || "Could not load this booking.") })
      .catch(() => { if (live) setError("Could not reach the server.") })
    return () => { live = false }
  }, [bookingId])

  function saveSender() {
    const v = senderDraft.trim().slice(0, 60)
    setSender(v)
    try { localStorage.setItem(SENDER_KEY, v) } catch {}
  }

  const title = `Review request to ${name || "customer"}`
  const mode = data ? SMS_MODES[data.mode] : null
  const closeBtn = (
    <button type="button" onClick={onClose} className="mt-5 w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700">Close</button>
  )

  if (done) {
    return (
      <Dialog title={title} onClose={onClose}>
        <p role="status" className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
          done.message?.mode === "dry-run" ? SMS_MODES["dry-run"].cls : SMS_MODES.live.cls}`}>
          {done.message?.mode === "dry-run"
            ? "Test logged. Nothing was sent to the customer."
            : "✓ Sent to Twilio. The delivery status appears here the next time you open this."}
        </p>
        {closeBtn}
      </Dialog>
    )
  }

  return (
    <Dialog title={title} onClose={onClose}>
      {error && <><p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>{closeBtn}</>}
      {!data && !error && <p className="py-8 text-center text-gray-500">Loading…</p>}
      {data && (
        <>
          {mode && <p role="status" className={`mb-3 rounded-xl border px-4 py-3 text-sm font-semibold ${mode.cls}`}>{mode.text}</p>}

          {data.blockers.length > 0 ? (
            <>
              <ul className="space-y-2">
                {data.blockers.map(b => <li key={b} className="text-sm text-gray-800">⚠️ {b}</li>)}
              </ul>
              {closeBtn}
            </>
          ) : (
            <>
              {!sender && (
                <form onSubmit={e => { e.preventDefault(); saveSender() }} className="mb-4 flex flex-wrap items-end gap-2">
                  <label className="flex-1 min-w-[12rem]">
                    <span className="block text-sm font-semibold text-gray-800">Your name</span>
                    <span className="block text-xs text-gray-600">Saved on this device and shown in the log of every text you send.</span>
                    <input value={senderDraft} onChange={e => setSenderDraft(e.target.value)} maxLength={60} autoComplete="name"
                      className="mt-1.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-300" />
                  </label>
                  <button type="submit" disabled={!senderDraft.trim()} className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">Save</button>
                </form>
              )}
              {data.last?.status && (
                <p className="mb-3 text-sm text-gray-700">
                  Last text: {fmtWhen(data.last.at)} · {data.last.status}{data.last.errorMessage ? ` (${data.last.errorMessage})` : ""}
                </p>
              )}
              <ComposeFields
                bookingId={bookingId} kind="review" noun="review request" phone={data.phone} draft={data.draft}
                sender={sender} last={data.last} mustInclude={data.reviewUrl}
                blocked={data.hours.ok ? null : data.hours.reason}
                onClose={onClose}
                onSent={json => { setDone(json); onSent?.(json) }}
              >
                <p className="mt-3 text-xs text-gray-600">
                  Ask every customer the same way. Google and the FTC don&apos;t allow offering anything in return for a review.
                </p>
                {data.reviewRequestedAt && (
                  <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                    This customer was already asked for a review on {fmtWhen(data.reviewRequestedAt)}.
                  </p>
                )}
              </ComposeFields>
            </>
          )}
        </>
      )}
    </Dialog>
  )
}
