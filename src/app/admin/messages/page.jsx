"use client"
// MESSAGES — every text to and from customers, one conversation per number:
// what we sent (reminders, review requests, replies), what they wrote back,
// and whether it was delivered. Replies are typed and sent by hand, one at a
// time; the server re-checks consent, hours and the required wording.
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { finalizeBody, segments, displayPhone, MAX_SMS_CHARS } from "@/app/lib/smsRules"
import { SMS_MODES, fmtWhen, useSmsSender, SenderPrompt } from "../SmsCompose"

const POLL_MS = 20000
const KIND_LABEL = { reminder: "Reminder", review: "Review request", reply: "Reply", inbound: "" }

export default function MessagesPage() {
  return <Suspense fallback={<p className="py-16 text-center text-gray-500">Loading…</p>}><Messages /></Suspense>
}

// Runs `fn` now and every POLL_MS while the tab is visible.
function usePoll(fn, deps) {
  useEffect(() => {
    fn()
    const t = setInterval(() => { if (document.visibilityState === "visible") fn() }, POLL_MS)
    return () => clearInterval(t)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

function Messages() {
  const router = useRouter()
  const params = useSearchParams()
  const phone = params.get("phone") || ""
  const [tests, setTests] = useState(false)
  const [list, setList] = useState(null)
  const [error, setError] = useState("")

  const loadList = useCallback(async () => {
    try {
      const json = await fetch(`/api/sms/conversations${tests ? "?tests=1" : ""}`).then(r => r.json())
      if (json.ok) { setList(json); setError("") } else setError(json.error || "Could not load the messages.")
    } catch { setError("Could not reach the server.") }
  }, [tests])
  usePoll(loadList, [loadList])

  const open = p => router.replace(p ? `/admin/messages?phone=${encodeURIComponent(p)}` : "/admin/messages", { scroll: false })
  const mode = list ? SMS_MODES[list.mode] : null
  // After a conversation is marked read: clear its badge now, then reload so a
  // list request that was already on its way can't bring the old count back.
  const markedRead = useCallback(p => {
    setList(l => l && ({ ...l, conversations: l.conversations.map(c => c.phone === p ? { ...c, unread: 0 } : c) }))
    loadList()
  }, [loadList])

  return (
    <div className="max-w-6xl">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Messages</h1>
          <p className="mt-0.5 text-sm text-gray-600">Texts to and from customers on the PrimeTV number. Every reply is sent by hand.</p>
        </div>
        <div className="flex items-center gap-3">
          {list?.mode === "live" && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={tests} onChange={e => setTests(e.target.checked)} className="size-4" />
              Show test texts
            </label>
          )}
          <button type="button" onClick={loadList} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">↻ Refresh</button>
        </div>
      </div>

      {mode && <p role="status" className={`mb-3 rounded-xl border px-4 py-3 text-sm font-semibold ${mode.cls}`}>{mode.text}</p>}
      {error && <p role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-[20rem_minmax(0,1fr)]">
        <nav aria-label="Conversations" className={phone ? "hidden md:block" : ""}>
          {!list && !error && <p className="py-10 text-center text-gray-500">Loading…</p>}
          {list && list.conversations.length === 0 && (
            <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center text-sm text-gray-600">
              No texts yet.{list.mode === "live" && !tests && " Tick “Show test texts” to see the ones logged in test mode."}
            </p>
          )}
          <ul className="space-y-1.5">
            {list?.conversations.map(c => {
              const on = c.phone === phone
              return (
                <li key={c.phone}>
                  <button type="button" onClick={() => open(c.phone)} aria-current={on ? "true" : undefined}
                    className={`w-full rounded-xl border px-3.5 py-3 text-left transition ${on ? "border-[#E50914] bg-red-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
                    <span className="flex items-center justify-between gap-2">
                      <span className={`truncate text-sm ${c.unread ? "font-extrabold text-gray-900" : "font-semibold text-gray-800"}`}>
                        {c.name || displayPhone(c.phone)}
                      </span>
                      <span className="flex-none text-xs text-gray-500">{fmtWhen(c.last.at)}</span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-gray-600">
                        {c.last.direction === "in" ? "" : "You: "}{c.last.body || (c.last.media?.length ? "📎 Attachment" : "")}
                      </span>
                      {c.unread > 0 && (
                        <span className="flex-none rounded-full bg-[#E50914] px-2 py-0.5 text-xs font-bold text-white">
                          {c.unread}<span className="sr-only"> unread</span>
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <section aria-label="Conversation" className={phone ? "" : "hidden md:block"}>
          {phone
            ? <Thread key={`${phone}|${tests}`} phone={phone} tests={tests} onBack={() => open("")} onRead={markedRead} onSent={loadList} />
            : <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-16 text-center text-sm text-gray-600">Pick a conversation.</p>}
        </section>
      </div>
    </div>
  )
}

function Thread({ phone, tests, onBack, onRead, onSent }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const box = useRef(null)
  const seen = useRef(0)

  const load = useCallback(async () => {
    try {
      const json = await fetch(`/api/sms/conversations?phone=${encodeURIComponent(phone)}${tests ? "&tests=1" : ""}`).then(r => r.json())
      if (!json.ok) { setError(json.error || "Could not load this conversation."); return }
      setData(json); setError("")
      if (json.messages.some(m => m.direction === "in" && !m.readAt)) {
        await fetch("/api/sms/conversations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) }).catch(() => {})
        onRead(phone)
      }
    } catch { setError("Could not reach the server.") }
  }, [phone, tests, onRead])
  usePoll(load, [load])

  // Scroll the conversation (not the page) to the newest text when one
  // arrives, not on every refresh.
  useEffect(() => {
    const n = data?.messages.length || 0
    if (n !== seen.current && box.current) { seen.current = n; box.current.scrollTop = box.current.scrollHeight }
  }, [data])

  const b = data?.booking
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-gray-100 px-4 py-3">
        <button type="button" onClick={onBack} className="text-sm font-semibold text-gray-600 hover:text-black md:hidden">← All</button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-extrabold text-gray-900">{b?.name || displayPhone(phone)}</h2>
          <p className="text-sm text-gray-600">
            {b?.name ? `${displayPhone(phone)} · ` : ""}
            {b ? <Link href={`/admin/bookings?open=${b.id}`} className="font-semibold underline">Open booking</Link> : "No booking with this number"}
          </p>
        </div>
        {data && (
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${data.consent.allowed ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-gray-300 bg-gray-50 text-gray-700"}`}>
            {data.consent.allowed ? "✓ Can text" : "Can't text"}
          </span>
        )}
      </header>

      <ol ref={box} className="flex max-h-[60vh] min-h-[16rem] flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite">
        {!data && !error && <li className="py-10 text-center text-gray-500">Loading…</li>}
        {error && <li role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</li>}
        {data?.messages.length === 0 && <li className="py-10 text-center text-sm text-gray-600">No texts with this number yet.</li>}
        {data?.messages.map(m => <Bubble key={m.id} m={m} />)}
      </ol>

      {data && <Composer data={data} phone={phone} onSent={() => { load(); onSent() }} />}
    </div>
  )
}

function Bubble({ m }) {
  const mine = m.direction !== "in"
  const test = m.mode === "dry-run"
  const failed = m.status === "failed" || m.status === "undelivered"
  return (
    <li className={`max-w-[85%] ${mine ? "self-end text-right" : "self-start"}`}>
      <div className={`whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-left text-[15px] leading-relaxed ${
        !mine ? "bg-gray-100 text-gray-900"
          : test ? "border border-dashed border-amber-400 bg-amber-50 text-amber-950"
          : failed ? "border border-red-300 bg-red-50 text-red-900"
          : "bg-gray-900 text-white"}`}>
        {m.body}
        {m.media.map((x, i) => (
          <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="mt-1 block font-semibold underline">
            📎 Attachment {m.media.length > 1 ? i + 1 : ""}{x.type ? ` (${x.type.split("/")[0]})` : ""}
          </a>
        ))}
      </div>
      <p className="mt-1 px-1 text-xs text-gray-500">
        {[fmtWhen(m.at), mine && KIND_LABEL[m.kind], mine && m.by && `by ${m.by}`,
          mine && (test ? "test, not sent" : m.status), m.errorMessage].filter(Boolean).join(" · ")}
      </p>
    </li>
  )
}

function Composer({ data, phone, onSent }) {
  const [sender, saveSender] = useSmsSender()
  const [text, setText] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const final = useMemo(() => finalizeBody(text), [text])
  const seg = segments(final)
  const tooLong = final.length > MAX_SMS_CHARS
  const blocked = !data.consent.allowed ? data.consent.reason : !data.hours.ok ? data.hours.reason : null

  async function send() {
    setBusy(true); setErr("")
    try {
      const json = await fetch("/api/sms/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "reply", phone, bookingId: data.booking?.id || null, body: final, sentBy: sender }),
      }).then(r => r.json())
      if (json.ok) { setText(""); onSent() } else setErr(json.error || "Not sent.")
    } catch { setErr("No connection. Nothing was sent.") } finally { setBusy(false) }
  }

  if (!data.consent.allowed) {
    return (
      <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-700">
        ⚠️ {data.consent.reason} You can call them at {displayPhone(phone)}.
      </div>
    )
  }
  return (
    <div className="border-t border-gray-100 px-4 py-3">
      {!sender ? <SenderPrompt onSave={saveSender} /> : (
        <>
          <label htmlFor="reply-text" className="block text-sm font-semibold text-gray-800">
            Reply <span className="font-normal text-gray-600">as {sender} · <button type="button" onClick={() => saveSender("")} className="underline">change</button></span>
          </label>
          <textarea id="reply-text" value={text} onChange={e => setText(e.target.value)} rows={3}
            className="mt-1.5 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-300" />
          {text.trim() && (
            <div className="mt-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-800">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-600">Will be sent as · {seg.chars} characters · {seg.parts} text{seg.parts !== 1 ? "s" : ""}</p>
              {final}
            </div>
          )}
          {tooLong && <p className="mt-2 text-sm font-semibold text-red-700">Too long — keep it under {MAX_SMS_CHARS} characters.</p>}
          {blocked && <p className="mt-2 text-sm font-semibold text-red-700">{blocked}</p>}
          {err && <p role="alert" className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
          <div className="mt-3 flex justify-end">
            <button type="button" onClick={send} disabled={busy || !text.trim() || tooLong || !!blocked}
              className="rounded-xl bg-[#E50914] px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-40">
              {busy ? "Sending…" : "Send reply"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
