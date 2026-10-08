// ─────────────────────────────────────────────────────────────────────────────
// EMAIL LAYOUT — the shell and building blocks every email from the site uses.
//
// Email HTML is not web HTML. Outlook renders with Word's engine, Gmail strips
// most of <head>, and several apps ignore flexbox and grid entirely — which is
// exactly how the old price boxes, built with display:flex, ended up with the
// amount wrapped under the label. So everything here is:
//
//   • tables for layout, never flex or grid
//   • inline styles, with a small <style> only for phone-width tweaks that
//     degrade gracefully where it is stripped
//   • text, not images, for the brand mark, so it survives "images off"
//   • 600px wide at most, fluid below that
//
// Each block returns a string so templates can be composed with plain template
// literals, the way the existing emails already were.
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND = {
  name:    "PrimeTvNashville",
  red:     "#E50914",
  ink:     "#111111",
  muted:   "#6b7280",
  line:    "#ececec",
  page:    "#f2f2f4",
  phone:   "(615) 669-0251",
  tel:     "tel:+16156690251",
  sms:     "sms:+16156690251",
  site:    "https://www.primetvnashville.com",
  email:   "info@primetvnashville.com",
}

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Escapes, then keeps the customer's own line breaks.
export const escLines = value => esc(value).replace(/\r?\n/g, "<br>")

// ── Formatting ──────────────────────────────────────────────────────────────

// "2026-10-01" → "Thursday, October 1, 2026". Parsed at local noon so the date
// cannot slide a day either way across a timezone boundary.
export function fmtDate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(String(iso))) return iso ? String(iso) : ""
  const d = new Date(`${iso}T12:00:00`)
  if (isNaN(d)) return String(iso)
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
}

export const telHref = phone => {
  let d = String(phone || "").replace(/\D/g, "")
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1)
  return d.length === 10 ? `tel:+1${d}` : ""
}
export const smsHref = phone => telHref(phone).replace(/^tel:/, "sms:")
export const mapsHref = address =>
  address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : ""

// ── Blocks ──────────────────────────────────────────────────────────────────

export function heading(text, { kicker, sub } = {}) {
  return `
    ${kicker ? `<p style="margin:0 0 6px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.red};">${kicker}</p>` : ""}
    <h1 style="margin:0;font-family:${FONT};font-size:26px;line-height:1.25;font-weight:800;color:${BRAND.ink};">${text}</h1>
    ${sub ? `<p style="margin:10px 0 0;font-family:${FONT};font-size:15px;line-height:1.55;color:#4b5563;">${sub}</p>` : ""}
  `
}

export function para(html, { muted = false, size = 15, top = 16 } = {}) {
  return `<p style="margin:${top}px 0 0;font-family:${FONT};font-size:${size}px;line-height:1.6;color:${muted ? BRAND.muted : "#374151"};">${html}</p>`
}

export function sectionTitle(text, { top = 28 } = {}) {
  return `<p style="margin:${top}px 0 10px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.muted};">${text}</p>`
}

// Label-over-value rows. Stacked rather than two columns: on a phone a label
// column eats half the width and wraps every value into a ribbon.
// Rows with an empty value are skipped, so templates can list optional fields
// without a forest of conditionals.
export function details(rows, { top = 0 } = {}) {
  const kept = rows.filter(r => r && r[1] !== undefined && r[1] !== null && String(r[1]).trim() !== "")
  if (!kept.length) return ""
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:${top}px;">
      ${kept.map(([label, value], i) => `
        <tr>
          <td style="padding:${i === 0 ? "0" : "12px"} 0 12px;border-bottom:${i === kept.length - 1 ? "0" : `1px solid ${BRAND.line}`};">
            <p style="margin:0 0 3px;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;color:${BRAND.muted};">${label}</p>
            <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.5;color:${BRAND.ink};">${value}</p>
          </td>
        </tr>`).join("")}
    </table>
  `
}

// Plain hex only. Eight-digit hex with an alpha channel is ignored by
// Outlook, which then draws no border at all.
const TONES = {
  brand:   { bg: "#fff5f5", edge: BRAND.red, rim: "#fecaca", title: "#b91c1c", text: "#7f1d1d" },
  info:    { bg: "#eff6ff", edge: "#3b82f6", rim: "#bfdbfe", title: "#1d4ed8", text: "#1e3a8a" },
  warn:    { bg: "#fffbeb", edge: "#f59e0b", rim: "#fde68a", title: "#92400e", text: "#78350f" },
  success: { bg: "#f0fdf4", edge: "#22c55e", rim: "#bbf7d0", title: "#15803d", text: "#14532d" },
  purple:  { bg: "#f5f3ff", edge: "#8b5cf6", rim: "#ddd6fe", title: "#5b21b6", text: "#4c1d95" },
  neutral: { bg: "#f9fafb", edge: "#d1d5db", rim: "#e5e7eb", title: "#374151", text: "#4b5563" },
  danger:  { bg: "#fef2f2", edge: "#dc2626", rim: "#fecaca", title: "#b91c1c", text: "#7f1d1d" },
}

// A tinted callout with a coloured left edge.
export function panel({ tone = "neutral", title, html, top = 16 }) {
  const t = TONES[tone] || TONES.neutral
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:${top}px;border-collapse:separate;">
      <tr>
        <td style="background:${t.bg};border:1px solid ${t.rim};border-left:4px solid ${t.edge};border-radius:10px;padding:14px 16px;">
          ${title ? `<p style="margin:0 0 6px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${t.title};">${title}</p>` : ""}
          <div style="font-family:${FONT};font-size:14px;line-height:1.6;color:${t.text};">${html}</div>
        </td>
      </tr>
    </table>
  `
}

// A price with its label, side by side in a two-cell table — the version that
// works in every client, unlike the flex box it replaces.
export function priceBox({ label, sub, amount, note, top = 20 }) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:${top}px;border-collapse:separate;">
      <tr>
        <td style="background:#fff5f5;border:2px solid ${BRAND.red};border-radius:12px;padding:16px 18px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle" style="font-family:${FONT};">
                <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${BRAND.red};">${label}</p>
                ${sub ? `<p style="margin:4px 0 0;font-size:14px;color:#4b5563;">${sub}</p>` : ""}
              </td>
              ${amount ? `<td valign="middle" align="right" style="font-family:${FONT};font-size:28px;font-weight:800;color:${BRAND.red};white-space:nowrap;padding-left:12px;">${amount}</td>` : ""}
            </tr>
          </table>
          ${note ? `<p style="margin:10px 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:#7f1d1d;">${note}</p>` : ""}
        </td>
      </tr>
    </table>
  `
}

// Up to two buttons per row; on a phone each takes the full width. Built from
// table cells with a background colour, which renders as a button everywhere —
// a styled <a> alone loses its padding in Outlook.
export function buttons(list, { top = 22 } = {}) {
  const items = list.filter(b => b && b.href)
  if (!items.length) return ""
  const rows = []
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2))
  const cell = b => {
    const primary = b.variant !== "secondary"
    return `
      <td class="btn-cell" width="50%" valign="top" style="padding:0 5px 10px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" bgcolor="${primary ? BRAND.red : "#ffffff"}"
                style="border-radius:999px;${primary ? "" : `border:2px solid ${BRAND.line};`}">
              <a href="${b.href}" target="_blank"
                 style="display:block;padding:13px 18px;font-family:${FONT};font-size:15px;font-weight:700;line-height:1.2;color:${primary ? "#ffffff" : BRAND.ink};text-decoration:none;border-radius:999px;">
                ${b.label}
              </a>
            </td>
          </tr>
        </table>
      </td>`
  }
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:${top}px;">
      ${rows.map(r => `<tr>${r.map(cell).join("")}${r.length === 1 ? `<td class="btn-cell" width="50%" style="padding:0 5px 10px;"></td>` : ""}</tr>`).join("")}
    </table>
  `
}

// Tap-to-call, tap-to-text, reply and directions for the customer in an
// internal notification — the four things anyone reading it on a phone wants
// to do next.
export function contactActions({ phone, email, address, subject = "Your request with PrimeTvNashville" }) {
  return buttons([
    telHref(phone) && { href: telHref(phone), label: "📞 Call customer" },
    smsHref(phone) && { href: smsHref(phone), label: "💬 Text customer", variant: "secondary" },
    email && { href: `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}`, label: "✉️ Email customer", variant: "secondary" },
    mapsHref(address) && { href: mapsHref(address), label: "📍 Open in Maps", variant: "secondary" },
  ].filter(Boolean))
}

// The appointment as a dark strip: the one thing everyone comes back to an
// email to check, so it is the most prominent thing in it. `address` is HTML
// (callers pass an already-escaped string).
export function appointmentBlock({ label = "Your appointment", date, time, address, top = 20 }) {
  if (!date) return ""
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:${top}px;border-collapse:separate;">
      <tr>
        <td style="background:#0a0a0a;border-radius:12px;padding:16px 18px;font-family:${FONT};">
          <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.red};">${esc(label)}</p>
          <p style="margin:6px 0 0;font-size:20px;font-weight:800;line-height:1.3;color:#ffffff;">${esc(fmtDate(date))}</p>
          ${time ? `<p style="margin:3px 0 0;font-size:15px;color:#d1d5db;">${esc(time)}</p>` : ""}
          ${address ? `<p style="margin:8px 0 0;font-size:14px;color:#9ca3af;">${address}</p>` : ""}
        </td>
      </tr>
    </table>`
}

// A customer card for internal emails: name large, contact lines tappable.
export function customerCard({ name, phone, email, address }) {
  const tel = telHref(phone)
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;border-collapse:separate;">
      <tr>
        <td style="background:#f9fafb;border:1px solid ${BRAND.line};border-radius:12px;padding:16px 18px;font-family:${FONT};">
          <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${BRAND.muted};">Customer</p>
          <p style="margin:6px 0 0;font-size:20px;font-weight:800;color:${BRAND.ink};">${esc(name) || "—"}</p>
          ${phone ? `<p style="margin:8px 0 0;font-size:15px;"><a href="${tel || "#"}" style="color:${BRAND.red};font-weight:700;text-decoration:none;">${esc(phone)}</a></p>` : ""}
          ${email ? `<p style="margin:4px 0 0;font-size:15px;"><a href="mailto:${esc(email)}" style="color:${BRAND.ink};text-decoration:underline;">${esc(email)}</a></p>` : ""}
          ${address ? `<p style="margin:4px 0 0;font-size:15px;color:#4b5563;">${esc(address)}</p>` : ""}
        </td>
      </tr>
    </table>
  `
}

// ── The document ────────────────────────────────────────────────────────────

// `preheader` is the grey preview line inbox lists show after the subject; left
// out, clients fill it with the first text they find, which was usually
// "Hi Ada," or an emoji.
export function emailDocument({ title, preheader = "", body, footerNote = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(title)}</title>
<style>
  @media (max-width:620px) {
    .px { padding-left:20px !important; padding-right:20px !important; }
    .btn-cell { display:block !important; width:100% !important; }
    h1 { font-size:22px !important; }
  }
  a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; }
</style>
</head>
<body style="margin:0;padding:0;background:${BRAND.page};-webkit-text-size-adjust:100%;">
<div data-preheader style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${BRAND.page};">${esc(preheader)}${"&#8199;&#65279;&#847;".repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.page};">
  <tr>
    <td align="center" style="padding:24px 12px 32px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
        <tr>
          <td class="px" style="background:#0a0a0a;border-radius:16px 16px 0 0;padding:18px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="34" height="34" align="center" valign="middle" bgcolor="${BRAND.red}"
                    style="border-radius:9px;font-family:${FONT};font-size:15px;font-weight:800;color:#ffffff;">TV</td>
                <td style="padding-left:10px;font-family:${FONT};font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-.01em;">
                  PrimeTv<span style="color:${BRAND.red};">Nashville</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="background:${BRAND.red};height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>
        <tr>
          <td class="px" style="background:#ffffff;padding:30px 28px 28px;font-family:${FONT};color:${BRAND.ink};">
            ${body}
          </td>
        </tr>
        <tr>
          <td class="px" style="background:#ffffff;border-top:1px solid ${BRAND.line};border-radius:0 0 16px 16px;padding:18px 28px 22px;font-family:${FONT};">
            <p style="margin:0;font-size:14px;font-weight:700;color:${BRAND.ink};">${BRAND.name}</p>
            <p style="margin:4px 0 0;font-size:13px;line-height:1.6;color:${BRAND.muted};">
              TV mounting &amp; home installation · Nashville, Tennessee<br>
              <a href="${BRAND.tel}" style="color:${BRAND.muted};text-decoration:none;">${BRAND.phone}</a> ·
              <a href="mailto:${BRAND.email}" style="color:${BRAND.muted};text-decoration:none;">${BRAND.email}</a> ·
              <a href="${BRAND.site}" style="color:${BRAND.muted};text-decoration:none;">primetvnashville.com</a>
            </p>
          </td>
        </tr>
      </table>
      ${footerNote ? `<p style="margin:14px 0 0;max-width:560px;font-family:${FONT};font-size:12px;line-height:1.5;color:#9ca3af;">${footerNote}</p>` : ""}
    </td>
  </tr>
</table>
</body>
</html>`
}

// ── Plain-text alternative ──────────────────────────────────────────────────
//
// Mail sent as HTML only scores worse with spam filters than mail that carries
// a text part too, and some people read in text-only clients. The mailer adds
// this automatically to anything that has html and no text.
// Named entities the templates use, plus any numeric one. "&amp;" is decoded
// last-in-line by being in the same single pass, so "&amp;lt;" stays "&lt;".
const NAMED = {
  nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
  mdash: "—", ndash: "–", hellip: "…", middot: "·", times: "×",
}
function decodeEntity(match, body) {
  if (body[0] === "#") {
    const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10)
    return Number.isFinite(code) ? String.fromCodePoint(code) : match
  }
  return NAMED[body.toLowerCase()] ?? match
}

export function htmlToText(html) {
  return String(html || "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<div data-preheader[\s\S]*?<\/div>/gi, "")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
      const text = label.replace(/<[^>]+>/g, "").trim()
      if (!text) return ""
      if (href.startsWith("mailto:") || href === text) return text
      if (href.startsWith("tel:") || href.startsWith("sms:")) return text
      return `${text} (${href})`
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h[1-6]|tr|li|table)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#8199;|&#65279;|&#847;/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, decodeEntity)
    .split("\n").map(l => l.replace(/\s+/g, " ").trim()).join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
