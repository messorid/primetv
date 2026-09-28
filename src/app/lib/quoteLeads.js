// ─────────────────────────────────────────────────────────────────────────────
// Quote leads: every quote request the website takes, kept so the Leads section
// shows real people instead of only an inbox.
//
// Until now the quote forms only sent an email. If that email was missed,
// filtered or deleted, the lead was gone — there was no record anywhere. The
// same failure mode that lost two bookings, so the rule from that fix applies
// here too: write the lead down FIRST, then send the email, and never let a
// database problem stop the email (or the other way around).
// ─────────────────────────────────────────────────────────────────────────────

import { neon } from "@neondatabase/serverless"

export const SOURCE_LABELS = {
  quick_quote:        "Quick Quote",
  installation_quote: "Home Installation",
  contact_form:       "Contact Form",
}

export async function ensureQuoteLeadsTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS quote_leads (
      id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      source         TEXT NOT NULL DEFAULT 'quick_quote',
      service        TEXT,
      name           TEXT,
      phone          TEXT,
      email          TEXT,
      zip            TEXT,
      address        TEXT,
      tv_size        TEXT,
      mount_type     TEXT,
      preferred_date TEXT,
      preferred_time TEXT,
      notes          TEXT,
      details        JSONB,
      status         TEXT NOT NULL DEFAULT 'new',
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS quote_leads_created_at_idx ON quote_leads (created_at DESC)`
}

const clip = (v, max = 400) => {
  const s = String(v ?? "").trim()
  return s ? s.slice(0, max) : null
}

export async function insertQuoteLead(sql, lead) {
  const details = lead.details && Object.keys(lead.details).length ? lead.details : null

  const [row] = await sql`
    INSERT INTO quote_leads (
      source, service, name, phone, email, zip, address,
      tv_size, mount_type, preferred_date, preferred_time, notes, details
    ) VALUES (
      ${clip(lead.source, 40) || "quick_quote"},
      ${clip(lead.service, 120)},
      ${clip(lead.name, 120)},
      ${clip(lead.phone, 40)},
      ${clip(lead.email, 160)},
      ${clip(lead.zip, 20)},
      ${clip(lead.address, 300)},
      ${clip(lead.tvSize, 80)},
      ${clip(lead.mountType, 80)},
      ${clip(lead.preferredDate, 40)},
      ${clip(lead.preferredTime, 40)},
      ${clip(lead.notes, 2000)},
      ${details ? JSON.stringify(details) : null}::jsonb
    )
    RETURNING *
  `
  return row
}

// The forms call this. It owns its own connection and swallows its own errors,
// because a lead that cannot be filed must still reach the inbox — a form that
// returns 500 makes the customer think we never heard from them at all.
export async function captureQuoteLead(lead) {
  if (!process.env.DATABASE_URL) {
    console.error("quote lead not saved: DATABASE_URL missing")
    return false
  }

  const sql = neon(process.env.DATABASE_URL)

  // Neon over HTTP occasionally drops a cold request; one retry covers it.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await ensureQuoteLeadsTable(sql)
      await insertQuoteLead(sql, lead)
      return true
    } catch (err) {
      console.error(`quote lead save attempt ${attempt} failed`, err)
      if (attempt === 2) return false
    }
  }
  return false
}

export function mapQuoteLead(r) {
  return {
    id:            r.id,
    source:        r.source,
    sourceLabel:   SOURCE_LABELS[r.source] || r.source,
    service:       r.service,
    name:          r.name,
    phone:         r.phone,
    email:         r.email,
    zip:           r.zip,
    address:       r.address,
    tvSize:        r.tv_size,
    mountType:     r.mount_type,
    preferredDate: r.preferred_date,
    preferredTime: r.preferred_time,
    notes:         r.notes,
    details:       r.details || null,
    status:        r.status || "new",
    createdAt:     r.created_at,
  }
}
