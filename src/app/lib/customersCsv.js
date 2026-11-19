// The customer list as a CSV of name, phone and email, for the Download button
// on Admin → Customers. Opens in Excel and Google Sheets.

// Quotes every cell, doubling any quote inside it. A cell starting with = + - @
// would run as a formula when the file is opened, so it is prefixed with an
// apostrophe and shown as typed instead, except a plain phone like "+58 412…".
function cell(value) {
  let s = String(value ?? "").trim()
  if (/^[=+\-@]/.test(s) && !/^\+[\d\s().-]+$/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

export function customersCsv(customers = []) {
  const rows = [
    ["Name", "Phone", "Email"],
    ...customers.map(c => [
      c.name || `${c.firstName || ""} ${c.lastName || ""}`.trim(),
      c.phone,
      c.email,
    ]),
  ]
  // A byte-order mark so Excel reads accents and ñ as UTF-8.
  return "﻿" + rows.map(r => r.map(cell).join(",")).join("\r\n") + "\r\n"
}
