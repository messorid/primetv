export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"

function db() { return neon(process.env.DATABASE_URL) }

// Customers are derived from the bookings table rather than stored separately.
// Every field a customer record would hold already lives on their bookings, so
// a second table would only add a way for the two to disagree — correcting an
// email on a booking would silently leave the customer row stale. Deriving on
// read means the list is always current.
function keyFor(row) {
  const email = (row.email || "").trim().toLowerCase()
  if (email) return `e:${email}`
  const phone = (row.phone || "").replace(/\D/g, "")
  if (phone) return `p:${phone}`
  return null // anonymous rows are not customers
}

function titleCity(v) {
  const s = (v || "").trim()
  if (!s) return ""
  return s.replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}

export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()

  try {
    const sql = db()
    const rows = await sql`
      SELECT id, first_name, last_name, email, phone, address, date, status,
             amount_charged, referral, payment, created_at
      FROM bookings
      ORDER BY created_at ASC
    `

    const byKey = new Map()

    for (const r of rows) {
      const key = keyFor(r)
      if (!key) continue

      let c = byKey.get(key)
      if (!c) {
        c = {
          key,
          firstName: "", lastName: "", email: "", phone: "",
          address: null, city: "",
          referral: "", payment: "",
          jobCount: 0, completedCount: 0, cancelledCount: 0,
          totalSpent: 0,
          firstBookingAt: r.created_at,
          lastBookingAt: r.created_at,
          lastJobDate: "",
          bookings: [],
        }
        byKey.set(key, c)
      }

      c.jobCount += 1
      if (r.status === "completed") {
        c.completedCount += 1
        c.totalSpent += Number(r.amount_charged) || 0
      }
      if (r.status === "cancelled") c.cancelledCount += 1

      // Rows arrive oldest-first, so the last write wins and the customer ends
      // up holding their most recent details.
      if (r.first_name) c.firstName = r.first_name.trim()
      if (r.last_name)  c.lastName  = r.last_name.trim()
      if (r.email)      c.email     = r.email.trim()
      if (r.phone)      c.phone     = r.phone.trim()
      if (r.address && (r.address.street || r.address.city)) {
        c.address = r.address
        c.city = titleCity(r.address.city)
      }
      if (r.referral) c.referral = r.referral
      if (r.payment)  c.payment  = r.payment

      c.lastBookingAt = r.created_at
      if (r.date && r.date > c.lastJobDate) c.lastJobDate = r.date

      c.bookings.push({
        id: r.id,
        date: r.date,
        status: r.status,
        amountCharged: r.amount_charged == null ? null : Number(r.amount_charged),
      })
    }

    const customers = [...byKey.values()]
      .map(c => ({ ...c, name: `${c.firstName} ${c.lastName}`.trim() }))
      .sort((a, b) => new Date(b.lastBookingAt) - new Date(a.lastBookingAt))

    return Response.json({
      ok: true,
      customers,
      totals: {
        customers: customers.length,
        repeat: customers.filter(c => c.jobCount > 1).length,
        bookings: rows.length,
      },
    })
  } catch (err) {
    console.error("customers GET error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

// Editing a customer rewrites their details on every booking they own, because
// the customer record *is* those bookings — there is no separate row to update.
// The key is resolved here rather than trusting a list of ids from the client.
export async function PATCH(request) {
  if (!(await isAdminRequest(request))) return unauthorized()

  try {
    const { key, firstName, lastName, email, phone } = await request.json()

    if (typeof key !== "string" || (!key.startsWith("e:") && !key.startsWith("p:"))) {
      return Response.json({ ok: false, error: "Unknown customer" }, { status: 400 })
    }

    const first = (firstName ?? "").trim()
    const last  = (lastName  ?? "").trim()
    const mail  = (email     ?? "").trim()
    const tel   = (phone     ?? "").trim()

    if (!first && !last) {
      return Response.json({ ok: false, error: "Name is required" }, { status: 400 })
    }
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      return Response.json({ ok: false, error: "That email address is not valid" }, { status: 400 })
    }
    if (!mail && !tel) {
      return Response.json(
        { ok: false, error: "Keep either an email or a phone — both cannot be blank" },
        { status: 400 }
      )
    }

    const sql = db()
    const target = key.slice(2)

    // Match the same way keyFor() groups them, so the edit reaches exactly the
    // bookings that make up this customer.
    const rows = key.startsWith("e:")
      ? await sql`
          UPDATE bookings
          SET first_name = ${first}, last_name = ${last},
              email = ${mail}, phone = ${tel}
          WHERE LOWER(TRIM(COALESCE(email, ''))) = ${target}
          RETURNING id
        `
      : await sql`
          UPDATE bookings
          SET first_name = ${first}, last_name = ${last},
              email = ${mail}, phone = ${tel}
          WHERE COALESCE(email, '') = ''
            AND REGEXP_REPLACE(COALESCE(phone, ''), '[^0-9]', '', 'g') = ${target}
          RETURNING id
        `

    if (rows.length === 0) {
      return Response.json({ ok: false, error: "No bookings matched this customer" }, { status: 404 })
    }

    return Response.json({ ok: true, updated: rows.length })
  } catch (err) {
    console.error("customers PATCH error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
