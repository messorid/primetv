export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"

function db() {
  return neon(process.env.DATABASE_URL)
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name  TEXT,
      last_name   TEXT,
      email       TEXT,
      phone       TEXT,
      referral    TEXT,
      payment     TEXT,
      date        TEXT,
      time_pref   TEXT,
      address     JSONB,
      promo       TEXT,
      coupon_code TEXT,
      coupon_label TEXT,
      coupon_comment TEXT,
      tvs         JSONB,
      status      TEXT DEFAULT 'pending',
      notes       TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export async function GET() {
  try {
    const sql = db()
    await ensureTable(sql)
    const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`
    const bookings = rows.map(toBooking)
    return Response.json({ ok: true, bookings })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { id, status, notes } = await request.json()
    const sql = db()
    if (status !== undefined && notes !== undefined) {
      await sql`UPDATE bookings SET status=${status}, notes=${notes} WHERE id=${id}`
    } else if (status !== undefined) {
      await sql`UPDATE bookings SET status=${status} WHERE id=${id}`
    } else if (notes !== undefined) {
      await sql`UPDATE bookings SET notes=${notes} WHERE id=${id}`
    }
    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const sql = db()
    await sql`DELETE FROM bookings WHERE id=${id}`
    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false }, { status: 500 })
  }
}

function toBooking(row) {
  return {
    _id:                row.id,
    firstName:          row.first_name,
    lastName:           row.last_name,
    email:              row.email,
    phone:              row.phone,
    referral:           row.referral,
    payment:            row.payment,
    date:               row.date,
    timePreference:     row.time_pref,
    address:            row.address,
    selectedPromo:      row.promo,
    couponCode:         row.coupon_code,
    appliedCouponLabel: row.coupon_label,
    couponComment:      row.coupon_comment,
    tvs:                row.tvs || [],
    status:             row.status,
    notes:              row.notes,
    createdAt:          row.created_at,
  }
}
