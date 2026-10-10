"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  TextField, TextAreaField, ChoiceGroup, CheckboxField, ErrorSummary, FormAlert, PrimaryButton, focusField,
} from "@/app/components/forms/FormKit"
import {
  validateSignoff, parseTip, CONFIRM_TEXT, TIP_PRESETS, TIP_METHODS, MAX_CLOSEOUT_PHOTOS, MAX_NOTES,
} from "@/app/lib/closeoutRules.js"
import { compressImage } from "@/app/lib/compressImage.js"

const LABELS = {
  tip: "Tip amount", tipMethod: "Tip payment", notes: "Notes",
  confirmed: "Confirmation", signerName: "Name", signature: "Signature",
}

function fmtDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return iso || ""
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  })
}
const fmtSigned = iso => new Date(iso).toLocaleString("en-US", {
  timeZone: "America/Chicago", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
})
const money = n => `$${Number(n).toFixed(Number(n) % 1 ? 2 : 0)}`

export default function CloseoutClient({ initial }) {
  const [view, setView] = useState(initial)
  const signed = view.signed

  return (
    <div className="min-h-screen bg-[#f4f5f7] pb-16">
      <header className="bg-[#111] px-4 py-3.5">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <p className="text-lg font-extrabold tracking-tight text-white">
            <span className="text-[#E50914]">Prime</span>TvNashville
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Job completion</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 pt-5">
        <Summary view={view} />

        {view.cancelled ? (
          <FormAlert tone="error">This job was cancelled, so there is nothing to sign.</FormAlert>
        ) : signed ? (
          <SignedRecord view={view} />
        ) : (
          <SignoffForm view={view} onSigned={setView} />
        )}

        <p className="pt-2 text-center text-sm text-black/50">
          Questions? Call <a href="tel:+16156690251" className="font-semibold text-[#E50914]">(615) 669-0251</a>
        </p>
      </main>
    </div>
  )
}

function Card({ title, sub, children }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
      {title && <h2 className="text-lg font-extrabold text-black">{title}</h2>}
      {sub && <p className="mt-0.5 text-sm text-black/55">{sub}</p>}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  )
}

function Summary({ view }) {
  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-widest text-[#E50914]">Job summary</p>
      <h1 className="mt-1 text-2xl font-extrabold leading-tight text-black">{view.customerName || "Customer"}</h1>
      <dl className="mt-3 space-y-1.5 text-[15px]">
        <div className="flex gap-2">
          <dt className="w-20 flex-none text-black/50">Date</dt>
          <dd className="font-semibold text-black">{fmtDate(view.date) || "—"}</dd>
        </div>
        {view.installers.length > 0 && (
          <div className="flex gap-2">
            <dt className="w-20 flex-none text-black/50">Installer</dt>
            <dd className="font-semibold text-black">{view.installers.join(", ")}</dd>
          </div>
        )}
      </dl>
      <h2 className="mt-5 text-sm font-bold uppercase tracking-wide text-black/50">Work completed</h2>
      <ul className="mt-2 space-y-2">
        {view.workItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[15px] leading-snug text-black">
            <span aria-hidden="true" className="mt-0.5 flex size-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// ── After signing ───────────────────────────────────────────────────────────

function SignedRecord({ view }) {
  const s = view.signed
  return (
    <>
      <div role="status" className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 sm:p-5">
        <p className="text-lg font-extrabold text-emerald-800">✓ Job signed off</p>
        <p className="mt-1 text-sm text-emerald-900/80">
          Signed by <strong>{s.name}</strong> on <span suppressHydrationWarning>{fmtSigned(s.at)}</span>. Thank you for choosing PrimeTvNashville!
        </p>
      </div>

      <Card title="Details">
        <dl className="space-y-1.5 text-[15px]">
          <div className="flex gap-2">
            <dt className="w-20 flex-none text-black/50">Tip</dt>
            <dd className="font-semibold text-black">{s.tip > 0 ? `${money(s.tip)}${s.tipMethod ? ` · ${s.tipMethod}` : ""}` : "No tip"}</dd>
          </div>
          {s.notes && (
            <div className="flex gap-2">
              <dt className="w-20 flex-none text-black/50">Notes</dt>
              <dd className="whitespace-pre-line text-black">{s.notes}</dd>
            </div>
          )}
        </dl>
        <p className="mt-4 text-sm text-black/60">&ldquo;{CONFIRM_TEXT}&rdquo;</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.signatureUrl} alt={`Signature of ${s.name}`}
          className="mt-3 w-full max-w-sm rounded-xl border border-black/10 bg-white" />
      </Card>

      {view.photos.length > 0 && (
        <Card title={`Photos (${view.photos.length})`}>
          <PhotoGrid photos={view.photos} />
        </Card>
      )}

      <a href={`/api/job/${view.token}/pdf`}
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 border-black/12 bg-white px-6 text-base font-semibold text-black transition hover:bg-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/15">
        <span aria-hidden="true">📄</span> Download PDF
      </a>
    </>
  )
}

function PhotoGrid({ photos, onRemove, busyId }) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {photos.map((p, i) => (
        <li key={p.id} className="relative aspect-square overflow-hidden rounded-xl border border-black/10 bg-gray-100">
          <a href={p.url} target="_blank" rel="noreferrer" className="block size-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={`Photo ${i + 1} of the finished work`} className="size-full object-cover" loading="lazy" />
          </a>
          {onRemove && (
            <button type="button" onClick={() => onRemove(p.id)} disabled={busyId === p.id}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute right-1 top-1 flex size-8 items-center justify-center rounded-full bg-black/70 text-lg leading-none text-white disabled:opacity-50">
              ×
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

// ── The form ────────────────────────────────────────────────────────────────

function SignoffForm({ view, onSigned }) {
  const token = view.token
  const [photos, setPhotos] = useState(view.photos)
  const [uploadMsg, setUploadMsg] = useState("")
  const [photoErr, setPhotoErr] = useState("")
  const [removing, setRemoving] = useState(null)

  const [notes, setNotes] = useState("")
  const [tipChoice, setTipChoice] = useState("0")
  const [tipOther, setTipOther] = useState("")
  const [tipMethod, setTipMethod] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [signerName, setSignerName] = useState(view.customerName || "")
  const [signature, setSignature] = useState(null)

  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [failMsg, setFailMsg] = useState("")

  // A field's error goes as soon as it is changed, not on the next submit.
  const clear = key => setErrors(e => {
    if (!(key in e)) return e
    const rest = { ...e }
    delete rest[key]
    return rest
  })
  const field = (key, set) => v => { set(v); clear(key) }

  const tipValue = tipChoice === "other" ? tipOther : tipChoice
  const tipNum = parseTip(tipValue)
  const left = MAX_CLOSEOUT_PHOTOS - photos.length

  async function addPhotos(fileList) {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))
    setPhotoErr("")
    if (!files.length) return
    const batch = files.slice(0, left)
    if (files.length > left) setPhotoErr(`Only ${MAX_CLOSEOUT_PHOTOS} photos per job — the first ${left} were added.`)
    for (let i = 0; i < batch.length; i++) {
      setUploadMsg(batch.length > 1 ? `Uploading ${i + 1} of ${batch.length}…` : "Uploading…")
      try {
        const dataUrl = await compressImage(batch[i])
        const res = await fetch(`/api/job/${token}/photos`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dataUrl }),
        })
        const data = await res.json()
        if (!data.ok) { setPhotoErr(data.error || "Could not upload that photo."); break }
        setPhotos(prev => [...prev, data.photo])
      } catch {
        setPhotoErr("Could not read that photo. Try another one.")
      }
    }
    setUploadMsg("")
  }

  async function removePhoto(id) {
    if (!window.confirm("Remove this photo?")) return
    setRemoving(id)
    const res = await fetch(`/api/job/${token}/photos?id=${id}`, { method: "DELETE" }).catch(() => null)
    if (res?.ok) setPhotos(prev => prev.filter(p => p.id !== id))
    else setPhotoErr("Could not remove the photo.")
    setRemoving(null)
  }

  async function submit(e) {
    e.preventDefault()
    setFailMsg("")
    const body = { signerName, confirmed, signature, tip: tipValue, tipMethod, notes }
    const check = validateSignoff(body)
    if (!check.ok) { setErrors(check.errors); return }
    setErrors({})
    setSending(true)
    try {
      const res = await fetch(`/api/job/${token}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.ok) {
        onSigned(data.view)
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }
      if (data.errors) setErrors(data.errors)
      else setFailMsg(data.error || "Could not save. Please try again.")
    } catch {
      setFailMsg("No connection. Check the signal and try again — nothing was lost.")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Card title="Photos of the finished work"
        sub={photos.length ? `${photos.length} of ${MAX_CLOSEOUT_PHOTOS} added.` : "Installer: add a few photos before handing the phone to the customer."}>
        {photos.length > 0 && <PhotoGrid photos={photos} onRemove={removePhoto} busyId={removing} />}
        {left > 0 && (
          <label className={`flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-black/20 px-5 text-base font-semibold text-black transition hover:border-[#E50914]/50 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#E50914]/20 ${photos.length ? "mt-3" : ""} ${uploadMsg ? "pointer-events-none opacity-60" : ""}`}>
            <span aria-hidden="true">📷</span> {uploadMsg || (photos.length ? "Add more photos" : "Add photos")}
            <input type="file" accept="image/*" multiple className="sr-only" disabled={!!uploadMsg}
              onChange={e => { addPhotos(e.target.files); e.target.value = "" }} />
          </label>
        )}
        {photoErr && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{photoErr}</p>}
      </Card>

      <form onSubmit={submit} noValidate className="space-y-4">
        <Card title="Customer sign-off" sub="Please check the work above, then sign below.">
          <div className="space-y-5">
            <ErrorSummary errors={errors} labels={LABELS} onJump={focusField} />

            <ChoiceGroup id="tipChoice" legend="Add a tip for your installer? (optional)" size="sm" columns={3}
              value={tipChoice} onChange={v => { setTipChoice(v); clear("tip"); if (v === "0") { setTipMethod(""); clear("tipMethod") } }}
              options={[
                { value: "0", label: "No tip" },
                ...TIP_PRESETS.map(n => ({ value: String(n), label: `$${n}` })),
                { value: "other", label: "Other" },
              ]} />
            {tipChoice === "other" && (
              <TextField id="tip" label="Tip amount ($)" value={tipOther} onChange={v => { setTipOther(v.replace(/[^\d.]/g, "").slice(0, 7)); clear("tip") }}
                inputMode="decimal" placeholder="25" autoComplete="off" error={errors.tip} />
            )}
            {tipNum > 0 && (
              <>
                <ChoiceGroup id="tipMethod" legend="How will you pay the tip?" size="sm" columns={2}
                  value={tipMethod} onChange={field("tipMethod", setTipMethod)} options={TIP_METHODS} error={errors.tipMethod} required />
                <p className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-sm font-semibold text-amber-900">
                  <span aria-hidden="true">🚫</span> We do not accept credit/debit cards or checks.
                </p>
              </>
            )}

            <TextAreaField id="notes" label="Notes" optional value={notes} onChange={field("notes", setNotes)} rows={2}
              maxLength={MAX_NOTES} placeholder="Anything to add about the job" error={errors.notes} />

            <CheckboxField id="confirmed" checked={confirmed} onChange={field("confirmed", setConfirmed)} error={errors.confirmed} required>
              {CONFIRM_TEXT}
            </CheckboxField>

            <TextField id="signerName" label="Your full name" required value={signerName} onChange={field("signerName", setSignerName)}
              autoComplete="name" autoCapitalize="words" maxLength={80} error={errors.signerName} />

            <SignaturePad onChange={v => { setSignature(v); if (v) clear("signature") }} error={errors.signature} />
          </div>
        </Card>

        {failMsg && <FormAlert tone="error">{failMsg}</FormAlert>}
        <PrimaryButton type="submit" busy={sending} busyLabel="Saving…" className="w-full">
          ✍️ Sign &amp; finish job
        </PrimaryButton>
      </form>
    </>
  )
}

// ── Signature ───────────────────────────────────────────────────────────────

// A finger-drawn signature. Strokes are kept as points so a rotation or resize
// redraws them instead of wiping the canvas.
function SignaturePad({ onChange, error }) {
  const canvasRef = useRef(null)
  const strokes = useRef([])
  const drawing = useRef(false)
  const [empty, setEmpty] = useState(true)

  const setup = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const { width, height } = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(width * dpr), h = Math.round(height * dpr)
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
    const ctx = canvas.getContext("2d")
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#111111"
    ctx.fillStyle = "#111111"
    return { ctx, width, height }
  }, [])

  const redraw = useCallback(() => {
    const s = setup()
    if (!s) return
    const { ctx, width, height } = s
    ctx.save(); ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, width, height); ctx.restore()
    for (const pts of strokes.current) {
      if (pts.length === 1) { ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, 1.4, 0, Math.PI * 2); ctx.fill(); continue }
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y)
      for (const p of pts.slice(1)) ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
  }, [setup])

  useEffect(() => {
    redraw()
    const ro = new ResizeObserver(() => redraw())
    ro.observe(canvasRef.current)
    return () => ro.disconnect()
  }, [redraw])

  const pos = e => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  function down(e) {
    e.preventDefault()
    canvasRef.current.setPointerCapture?.(e.pointerId)
    drawing.current = true
    const p = pos(e)
    strokes.current.push([p])
    const s = setup()
    s.ctx.beginPath(); s.ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); s.ctx.fill()
  }

  function move(e) {
    if (!drawing.current) return
    e.preventDefault()
    const pts = strokes.current[strokes.current.length - 1]
    const { ctx } = setup()
    const events = e.nativeEvent.getCoalescedEvents?.() || [e.nativeEvent]
    for (const ev of events) {
      const p = pos(ev)
      const last = pts[pts.length - 1]
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke()
      pts.push(p)
    }
  }

  function up() {
    if (!drawing.current) return
    drawing.current = false
    // A stray tap is not a signature.
    const points = strokes.current.reduce((n, s) => n + s.length, 0)
    const hasInk = points >= 8
    setEmpty(!hasInk)
    onChange(hasInk ? canvasRef.current.toDataURL("image/png") : null)
  }

  function clear() {
    strokes.current = []
    redraw()
    setEmpty(true)
    onChange(null)
  }

  return (
    <div id="signature" tabIndex={-1} className="focus:outline-none">
      <div className="mb-1.5 flex items-end justify-between">
        <p className="text-sm font-semibold text-black/85">
          Your signature<span aria-hidden="true" className="text-[#E50914]"> *</span><span className="sr-only"> (required)</span>
        </p>
        <button type="button" onClick={clear} className="min-h-[36px] rounded-full px-3 text-sm font-semibold text-[#E50914] hover:bg-red-50">
          Clear
        </button>
      </div>
      <div className={`relative overflow-hidden rounded-xl border-2 bg-white ${error ? "border-red-300" : "border-black/15"}`}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Signature area. Draw your signature with a finger, stylus or mouse."
          className="block h-44 w-full cursor-crosshair touch-none select-none"
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}
        />
        {empty && (
          <p aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center text-base text-black/30">
            Sign here with your finger
          </p>
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 bottom-9 border-b border-dashed border-black/20" />
      </div>
      {error && <p id="signature-error" className="mt-1.5 text-[13px] font-medium text-red-600">{error}</p>}
    </div>
  )
}
