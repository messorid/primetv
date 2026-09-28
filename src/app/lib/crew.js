// ─────────────────────────────────────────────────────────────────────────────
// Crew: the installers on a job and how the worker pay divides between them.
//
// Two different splits exist and are easy to confuse:
//   • installers.commission_value — what the installers get as a group, versus
//     the company. Stored on the booking as profit_value (the company's share).
//   • installers.crew_share       — how that worker pool then divides between
//     the people who actually did the job.
//
// crew_share is a weight, not a percentage that must total 100. Nelson at 60
// and Carlitos at 40 split a shared job 60/40; Nelson working alone takes the
// whole pool, because the weights are normalised against whoever is on the job.
// ─────────────────────────────────────────────────────────────────────────────

export async function ensureCrewTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS booking_crew (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id      UUID NOT NULL,
      installer_id    UUID,
      installer_name  TEXT,
      installer_email TEXT,
      share_pct       NUMERIC(6,2) DEFAULT 100,
      amount          NUMERIC(10,2),
      created_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS booking_crew_booking_id_idx ON booking_crew (booking_id)`
}

// Turns each installer's weight into percentages that total exactly 100.
// Rounding is absorbed by the largest share so the parts never drift away from
// the whole — three equal members come out 33.34 / 33.33 / 33.33, not 99.99.
export function normaliseShares(members) {
  if (!members.length) return []

  const weights = members.map(m => {
    const w = Number(m.crewShare)
    return Number.isFinite(w) && w > 0 ? w : 50
  })
  const total = weights.reduce((s, w) => s + w, 0)

  const shares = members.map((m, i) => ({
    ...m,
    sharePct: Math.round((weights[i] / total) * 10000) / 100,
  }))

  const drift = 100 - shares.reduce((s, m) => s + m.sharePct, 0)
  if (Math.abs(drift) >= 0.005) {
    let biggest = 0
    for (let i = 1; i < shares.length; i++) {
      if (shares[i].sharePct > shares[biggest].sharePct) biggest = i
    }
    shares[biggest].sharePct = Math.round((shares[biggest].sharePct + drift) * 100) / 100
  }
  return shares
}

// Splits a pot by the given percentages. The last member takes the remainder so
// the parts always add back to the pot exactly, whatever the rounding.
export function splitAmount(pool, shares) {
  const total = Number(pool) || 0
  if (!shares.length) return []

  const out = shares.map(s => ({
    ...s,
    amount: Math.round(total * (Number(s.sharePct) || 0)) / 100,
  }))

  const assigned = out.reduce((s, m) => s + m.amount, 0)
  const diff = Math.round((total - assigned) * 100) / 100
  if (diff !== 0) out[out.length - 1].amount = Math.round((out[out.length - 1].amount + diff) * 100) / 100

  return out
}

export async function getCrewFor(sql, bookingIds) {
  if (!bookingIds.length) return new Map()
  const rows = await sql`
    SELECT booking_id, installer_id, installer_name, installer_email, share_pct, amount
    FROM booking_crew
    WHERE booking_id = ANY(${bookingIds}::uuid[])
    ORDER BY share_pct DESC, installer_name ASC
  `
  const byBooking = new Map()
  for (const r of rows) {
    if (!byBooking.has(r.booking_id)) byBooking.set(r.booking_id, [])
    byBooking.get(r.booking_id).push({
      installerId:    r.installer_id,
      installerName:  r.installer_name,
      installerEmail: r.installer_email,
      sharePct:       r.share_pct == null ? null : Number(r.share_pct),
      amount:         r.amount == null ? null : Number(r.amount),
    })
  }
  return byBooking
}

// Every booking predates this table, so a job with no crew rows is treated as
// the single assigned installer taking the whole pool. That keeps historical
// earnings correct without having to backfill.
export function crewOrLegacy(crew, booking) {
  if (crew && crew.length) return crew
  if (!booking.installer_name && !booking.installerName) return []
  return [{
    installerId:    booking.installer_id ?? booking.installerId ?? null,
    installerName:  booking.installer_name ?? booking.installerName,
    installerEmail: booking.installer_email ?? booking.installerEmail ?? null,
    sharePct:       100,
    amount:         Number(booking.amount_paid_workers ?? booking.amountPaidWorkers) || 0,
    legacy:         true,
  }]
}
