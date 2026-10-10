// ─────────────────────────────────────────────────────────────────────────────
// JOB CLOSEOUT RULES — limits and the sign-off check, shared by the closeout
// page (browser) and its API route (server). No imports, so the page can use
// it without pulling server code into the bundle.
// ─────────────────────────────────────────────────────────────────────────────

export const MAX_CLOSEOUT_PHOTOS = 12
// Photos are resized in the browser (1600px JPEG); this backstops anything
// that still arrives oversized. Same ceiling as the work-order photos.
export const MAX_PHOTO_CHARS = 3_000_000
// A finger-drawn signature as a PNG is typically 10–60 KB.
export const MAX_SIGNATURE_CHARS = 500_000
export const MAX_TIP = 1000
// No cards and no checks.
export const TIP_METHODS = ["Cash", "Zelle"]
export const TIP_PRESETS = [10, 20, 30, 50]
export const MAX_NOTES = 1000

export const CONFIRM_TEXT =
  "I confirm the work described above was completed and done well, with no problems."

// "12.5" → 12.5, "" → 0. Anything else (negative, too large, not a number,
// more than cents) is null so the caller can reject it.
export function parseTip(value) {
  if (value === "" || value == null) return 0
  const s = String(value).trim().replace(/^\$/, "")
  if (!/^\d{1,4}(\.\d{1,2})?$/.test(s)) return null
  const n = Number(s)
  return n > MAX_TIP ? null : n
}

// Checks a sign-off and returns { ok, errors, value }. `errors` is keyed by
// field so the page can point at each one.
export function validateSignoff(body) {
  const errors = {}
  const signerName = String(body?.signerName ?? "").replace(/\s+/g, " ").trim()
  if (signerName.length < 2) errors.signerName = "Type your full name."
  else if (signerName.length > 80) errors.signerName = "Keep the name under 80 characters."

  if (body?.confirmed !== true) errors.confirmed = "Tick the box to confirm the work was done well."

  const sig = body?.signature
  if (typeof sig !== "string" || !sig.startsWith("data:image/png;base64,") || sig.length < 200) {
    errors.signature = "Sign in the box with your finger."
  } else if (sig.length > MAX_SIGNATURE_CHARS) {
    errors.signature = "That signature is too large — clear it and sign again."
  }

  const tip = parseTip(body?.tip)
  if (tip === null) errors.tip = `Enter a tip between $0 and $${MAX_TIP}.`
  const tipMethod = tip > 0 ? String(body?.tipMethod ?? "") : null
  if (tip > 0 && !TIP_METHODS.includes(tipMethod)) errors.tipMethod = "Choose how you will pay the tip."

  const notes = String(body?.notes ?? "").trim()
  if (notes.length > MAX_NOTES) errors.notes = `Keep the notes under ${MAX_NOTES} characters.`

  const ok = Object.keys(errors).length === 0
  return {
    ok,
    errors,
    value: ok ? { signerName, signature: sig, tip, tipMethod, notes } : null,
  }
}
