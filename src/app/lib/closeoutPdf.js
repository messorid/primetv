// ─────────────────────────────────────────────────────────────────────────────
// JOB CLOSEOUT PDF — the signed record as one file: the job, the tip, the
// customer's confirmation and signature, and the photos of the finished work.
//
// Attached to the signed-off emails (so the record survives any mail app that
// hides images) and downloadable from the closeout page and the admin.
// ─────────────────────────────────────────────────────────────────────────────

import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { CONFIRM_TEXT } from "./closeoutRules.js"

const RED = rgb(0.898, 0.035, 0.078)
const INK = rgb(0.067, 0.067, 0.067)
const MUTED = rgb(0.42, 0.45, 0.5)
const LINE = rgb(0.9, 0.9, 0.9)
const PAGE = [612, 792] // US Letter
const M = 50            // margin

// The built-in PDF fonts only cover Windows-1252. Swap the few characters the
// app itself writes, and drop anything else (emoji, other scripts) rather than
// failing the whole document.
const WIN_ANSI_EXTRA = new Set("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ")
function pdfText(value) {
  return String(value ?? "")
    .replace(/[✓✔]/g, "-")
    .replace(/[\u2028\u2029]/g, " ")
    .split("")
    .filter(ch => ch === "\n" || (ch >= " " && ch <= "~") || (ch >= "\u00a0" && ch <= "\u00ff") || WIN_ANSI_EXTRA.has(ch))
    .join("")
}

function wrap(text, font, size, width) {
  const lines = []
  for (const para of pdfText(text).split("\n")) {
    let line = ""
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(next, size) <= width) { line = next; continue }
      if (line) lines.push(line)
      // A single word wider than the column is cut, not overflowed.
      let w = word
      while (font.widthOfTextAtSize(w, size) > width && w.length > 1) {
        let cut = w.length - 1
        while (cut > 1 && font.widthOfTextAtSize(w.slice(0, cut), size) > width) cut--
        lines.push(w.slice(0, cut)); w = w.slice(cut)
      }
      line = w
    }
    lines.push(line)
  }
  return lines
}

const fmtDate = iso => /^\d{4}-\d{2}-\d{2}$/.test(iso || "")
  ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  : (iso || "—")
const fmtSigned = iso => new Date(iso).toLocaleString("en-US", {
  timeZone: "America/Chicago", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
}) + " (Central)"
const fmtTip = (tip, method) => Number(tip) > 0 ? `$${Number(tip).toFixed(2)}${method ? ` - ${method}` : ""}` : "No tip"

// `view` is publicView(); `signature` and `photos` are { buffer, mime } from
// decodeDataUrl(); `audit` is { ip, agent } from the stored row.
export async function buildCloseoutPdf({ view, signature, photos = [], audit = {}, closeoutId = "" }) {
  const doc = await PDFDocument.create()
  const s = view.signed
  doc.setTitle(pdfText(`Job completion - ${view.customerName} - ${view.date}`))
  doc.setAuthor("PrimeTvNashville")
  doc.setSubject("Signed job completion record")
  doc.setCreator("primetvnashville.com")

  const regular = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const width = PAGE[0] - M * 2

  let page, y
  const newPage = () => {
    page = doc.addPage(PAGE)
    y = PAGE[1] - M
    // Header on every page.
    page.drawText("Prime", { x: M, y: y - 16, size: 20, font: bold, color: RED })
    page.drawText("TvNashville", { x: M + bold.widthOfTextAtSize("Prime", 20), y: y - 16, size: 20, font: bold, color: INK })
    const tag = "JOB COMPLETION RECORD"
    page.drawText(tag, { x: PAGE[0] - M - bold.widthOfTextAtSize(tag, 9), y: y - 12, size: 9, font: bold, color: MUTED })
    y -= 30
    page.drawLine({ start: { x: M, y }, end: { x: PAGE[0] - M, y }, thickness: 2, color: RED })
    y -= 24
    // Footer.
    const foot = pdfText(`PrimeTvNashville · (615) 669-0251 · info@primetvnashville.com · primetvnashville.com${closeoutId ? ` · Ref ${closeoutId}` : ""}`)
    page.drawText(foot, { x: M, y: 30, size: 8, font: regular, color: MUTED })
  }
  const ensure = h => { if (y - h < 60) newPage() }
  const text = (str, { size = 11, font = regular, color = INK, gap = 4, x = M, w = width } = {}) => {
    for (const line of wrap(str, font, size, w)) {
      ensure(size + gap)
      page.drawText(line, { x, y: y - size, size, font, color })
      y -= size + gap
    }
  }
  const label = str => { y -= 6; text(str.toUpperCase(), { size: 8.5, font: bold, color: MUTED, gap: 6 }) }
  const row = (k, v) => {
    const lines = wrap(v, regular, 11, width - 110)
    ensure(lines.length * 15)
    page.drawText(pdfText(k), { x: M, y: y - 11, size: 10, font: bold, color: MUTED })
    lines.forEach((l, i) => page.drawText(l, { x: M + 110, y: y - 11 - i * 15, size: 11, font: regular, color: INK }))
    y -= lines.length * 15 + 5
  }

  newPage()
  text(view.customerName || "Customer", { size: 22, font: bold, gap: 10 })
  row("Job date", fmtDate(view.date) + (view.time ? ` · ${view.time}` : ""))
  if (view.installers.length) row("Installer", view.installers.join(", "))
  if (s) {
    row("Signed by", s.name)
    row("Signed", fmtSigned(s.at))
    row("Tip", fmtTip(s.tip, s.tipMethod))
  }

  label("Work completed")
  for (const item of view.workItems) text(`-  ${item}`, { size: 11.5, gap: 5 })

  if (s?.notes) { label("Notes"); text(s.notes) }

  if (s) {
    label("Customer confirmation")
    text(`"${CONFIRM_TEXT}"`, { size: 11, color: INK })
    y -= 8
    if (signature) {
      const img = signature.mime === "image/png" ? await doc.embedPng(signature.buffer) : await doc.embedJpg(signature.buffer)
      const scale = Math.min(260 / img.width, 100 / img.height)
      const w = img.width * scale, h = img.height * scale
      ensure(h + 40)
      page.drawRectangle({ x: M, y: y - h - 8, width: w + 16, height: h + 16, borderColor: LINE, borderWidth: 1 })
      page.drawImage(img, { x: M + 8, y: y - h, width: w, height: h })
      y -= h + 22
    }
    text(`${s.name} · ${fmtSigned(s.at)}`, { size: 10, font: bold })
    const how = [audit.ip && `IP ${audit.ip}`, audit.agent && shortAgent(audit.agent)].filter(Boolean).join(" · ")
    text(`Signed electronically on the installer's device${how ? ` (${how})` : ""}.`, { size: 8.5, color: MUTED })
  }

  // Photos: two per row, as large as the column allows, never stretched.
  const embedded = []
  for (const p of photos) {
    try {
      embedded.push(p.mime === "image/png" ? await doc.embedPng(p.buffer) : await doc.embedJpg(p.buffer))
    } catch { /* an unreadable photo is skipped, not fatal */ }
  }
  if (embedded.length) {
    y -= 10
    // Keep the heading with the first row of photos.
    ensure(260)
    label(`Photos of the finished work (${embedded.length})`)
    const colW = (width - 12) / 2
    for (let i = 0; i < embedded.length; i += 2) {
      const pair = embedded.slice(i, i + 2)
      const sizes = pair.map(img => { const sc = Math.min(colW / img.width, 300 / img.height); return { w: img.width * sc, h: img.height * sc } })
      const h = Math.max(...sizes.map(z => z.h))
      ensure(h + 12)
      pair.forEach((img, j) => {
        page.drawImage(img, { x: M + j * (colW + 12), y: y - sizes[j].h, width: sizes[j].w, height: sizes[j].h })
      })
      y -= h + 12
    }
  }

  return doc.save()
}

// "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) …" → "iPhone".
function shortAgent(ua) {
  const s = String(ua)
  if (/iPhone/.test(s)) return "iPhone"
  if (/iPad/.test(s)) return "iPad"
  if (/Android/.test(s)) return "Android"
  if (/Windows/.test(s)) return "Windows"
  if (/Mac OS X/.test(s)) return "Mac"
  return ""
}

export function closeoutPdfName(view) {
  const who = String(view.customerName || "customer").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  return `job-completion-${who || "customer"}-${view.date || "undated"}.pdf`
}
