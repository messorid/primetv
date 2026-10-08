// ─────────────────────────────────────────────────────────────────────────────
// LEAD EMAILS — what the office receives for quote requests.
//
// Same shape as the booking notification: customer card first, one-tap
// buttons to call, text, email or open the address, then the request itself.
//
// Everything the customer typed is escaped here. The installation quote used
// to drop answers and contact details into the HTML raw, so anyone filling the
// form could put markup — links, images, fake buttons — into the office inbox.
// ─────────────────────────────────────────────────────────────────────────────

import {
  esc, escLines, fmtDate, emailDocument, heading, sectionTitle, details, panel,
  customerCard, contactActions,
} from "./emailLayout.js"

function leadEmail({ kicker, title, preheader, customer, rows, notesTitle = "What they wrote", notes, extra = "" }) {
  return emailDocument({
    title,
    preheader,
    body: `
      ${heading(title, { kicker })}
      ${customerCard(customer)}
      ${contactActions({ phone: customer.phone, email: customer.email, address: customer.mapsQuery || customer.address,
                         subject: "Your quote from PrimeTvNashville" })}
      ${sectionTitle("The request", { top: 18 })}
      ${details(rows)}
      ${notes ? panel({ tone: "neutral", title: notesTitle, html: escLines(notes) }) : ""}
      ${extra}
    `,
    footerNote: "Submitted from primetvnashville.com. Replying to this email writes straight to the customer.",
  })
}

// Only http(s) links become clickable; anything else is shown as text.
function safeLink(url) {
  const u = String(url || "").trim()
  if (!/^https?:\/\//i.test(u)) return esc(u)
  return `<a href="${esc(u)}" style="color:#E50914;word-break:break-all;">${esc(u)}</a>`
}

// ── Quick quote ─────────────────────────────────────────────────────────────

export function quickQuoteEmail(body) {
  const name = body.name || body.fullName || ""
  const where = body.address || (body.zip ? `ZIP ${body.zip}` : "")
  return leadEmail({
    kicker: body.leadSource === "contact_form" ? "Contact form" : "Quick quote",
    title: "New TV quote request",
    preheader: `${name} · ${body.service || "TV mounting"}${where ? ` · ${where}` : ""}`,
    customer: { name, phone: body.phone, email: body.email, address: where,
                mapsQuery: body.address || (body.zip ? `${body.zip} TN` : "") },
    rows: [
      ["Service", esc(body.service)],
      ["TV size", esc(body.tvSize)],
      ["Mount type", esc(body.mountType)],
      ["ZIP", esc(body.zip)],
      ["Address", esc(body.address)],
      ["Preferred date", esc(fmtDate(body.preferredDate))],
      ["Preferred time", esc(body.preferredTime)],
    ],
    notesTitle: "Notes",
    notes: body.notes,
  })
}

// The older multi-TV wizard payload, still accepted by the quote endpoint.
export function wizardQuoteEmail(body) {
  const tvs = Array.isArray(body.tvDetails) ? body.tvDetails : []
  const total = typeof body.totalCost === "number" ? `$${body.totalCost.toFixed(2)}` : esc(body.totalCost)
  const cards = tvs.map((tv, i) => panel({
    tone: "neutral", top: i === 0 ? 0 : 10, title: `TV ${i + 1}`,
    html: details([
      ["Brand / type", esc(tv.tvType)],
      ["Size", esc(tv.tvSize)],
      ["Wall", esc(tv.wallType)],
      ["Hide cables", esc(tv.hideCables)],
      ["Comments", escLines(tv.comments)],
    ]) || "<em>No details given</em>",
  })).join("")
  return leadEmail({
    kicker: "Quote wizard",
    title: "New TV installation request",
    preheader: `${body.fullName || ""} · ${tvs.length} TV${tvs.length === 1 ? "" : "s"}`,
    customer: { name: body.fullName, phone: body.phone, email: body.email },
    rows: [
      ["Preferred date", esc(fmtDate(body.preferredDate))],
      ["TVs", String(tvs.length)],
      ["Estimated total", total],
    ],
    extra: tvs.length ? `${sectionTitle("TVs", { top: 22 })}${cards}` : "",
  })
}

// ── Installation quote ──────────────────────────────────────────────────────

const ANSWER_LABELS = {
  items: "What it is", qty: "Quantity", brand: "Brand / model", model: "Model",
  product_link: "Product link", dimensions: "Dimensions", weight: "Weight",
  wall_type: "Wall type", fan_type: "Fan type", existing: "There now",
  ceiling_height: "Ceiling height", surface: "Surface", delivered: "Delivered?",
  level: "Ground level", anchors: "Anchor kit", description: "Description",
}

const labelFor = key =>
  ANSWER_LABELS[key] || String(key).replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase())

export function installationQuoteEmail({ serviceLabel, answers = {}, contact = {} }) {
  const answerRows = Object.entries(answers)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => [labelFor(k), k === "product_link" ? safeLink(v) : escLines(v)])
  const address = [contact.address, contact.zip].filter(Boolean).join(", ")
  return leadEmail({
    kicker: "Installation quote",
    title: serviceLabel,
    preheader: `${contact.name || ""} · ${serviceLabel}${contact.zip ? ` · ${contact.zip}` : ""}`,
    customer: { name: contact.name, phone: contact.phone, email: contact.email, address,
                mapsQuery: address ? `${address} TN` : "" },
    rows: [
      ["Service", `<strong>${esc(serviceLabel)}</strong>`],
      ["Preferred date", esc(fmtDate(contact.date))],
      ...answerRows,
    ],
    extra: panel({ tone: "info", title: "Photos",
      html: "Customers are told they can text photos of the area or the box to (615) 669-0251." }),
  })
}
