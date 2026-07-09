export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import nodemailer from "nodemailer"

function db() { return neon(process.env.DATABASE_URL) }

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name       TEXT, last_name TEXT, email TEXT, phone TEXT,
      referral         TEXT, payment TEXT, date TEXT, time_pref TEXT,
      address          JSONB, promo TEXT, coupon_code TEXT,
      coupon_label     TEXT, coupon_comment TEXT, tvs JSONB,
      more_tvs         BOOLEAN DEFAULT FALSE, more_tvs_comment TEXT,
      status           TEXT DEFAULT 'pending', notes TEXT,
      installer_id     UUID, installer_name TEXT, installer_email TEXT,
      assigned_at      TIMESTAMPTZ,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `
  // Add installer columns to existing tables
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS installer_id UUID`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS installer_name TEXT`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS installer_email TEXT`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS more_tvs BOOLEAN DEFAULT FALSE`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS more_tvs_comment TEXT`
}

export async function GET() {
  try {
    const sql = db()
    await ensureTable(sql)
    const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`
    return Response.json({ ok: true, bookings: rows.map(toBooking) })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { id, status, notes, installerId, installerName, installerEmail } = body
    const sql = db()

    // ── Assign installer ───────────────────────────────────────────────────────
    if (installerId !== undefined) {
      await sql`
        UPDATE bookings
        SET installer_id=${installerId}, installer_name=${installerName},
            installer_email=${installerEmail}, assigned_at=NOW()
        WHERE id=${id}
      `

      // Fetch booking to include in installer email
      const [b] = await sql`SELECT * FROM bookings WHERE id=${id}`
      if (b && installerEmail) {
        await sendInstallerEmail(b, installerName, installerEmail)
      }

      return Response.json({ ok: true })
    }

    // ── Update status / notes ──────────────────────────────────────────────────
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

// ── Installer assignment email ─────────────────────────────────────────────────
async function sendInstallerEmail(b, installerName, installerEmail) {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  if (!user || !pass) return

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } })

  const fullAddress = [b.address?.street, b.address?.apt, b.address?.city, b.address?.state, b.address?.zip]
    .filter(Boolean).join(", ")

  const serviceDetail = b.promo
    ? `<strong>Package:</strong> ${safe(b.promo)}`
    : b.more_tvs
    ? `<strong>3+ TVs</strong> — custom quote${b.more_tvs_comment ? `<br><em>"${safe(b.more_tvs_comment)}"</em>` : ""}`
    : (b.tvs || []).map((tv, i) =>
        `TV #${i+1}: ${safe(tv.size)}${tv.exactSize ? ` (${tv.exactSize}")` : ""} · ${safe(tv.wallType)}${tv.comments ? ` · ${safe(tv.comments)}` : ""}`
      ).join("<br>")

  await transporter.sendMail({
    from:    `"PrimeTvNashville" <${user}>`,
    to:      installerEmail,
    subject: `New Job Assigned — ${b.date || "TBD"} | ${safe(b.first_name)} ${safe(b.last_name)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
        <h2 style="color:#e50914;border-bottom:3px solid #e50914;padding-bottom:12px;margin-bottom:0;">
          📺 New Job Assignment
        </h2>

        <p style="color:#444;margin-top:16px;font-size:15px;">
          Hi <strong>${safe(installerName)}</strong>, you have been assigned a new installation job.
        </p>

        <div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:20px;margin-top:20px;">
          <h4 style="margin:0 0 14px;font-size:15px;color:#222;">Job Details</h4>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            ${irow("📅 Date",     b.date || "TBD")}
            ${irow("🕐 Time",     b.time_pref || "Flexible")}
            ${irow("📍 Address",  fullAddress || "—")}
            ${irow("🔧 Service",  serviceDetail || "—")}
            ${b.notes ? irow("📝 Notes", safe(b.notes)) : ""}
          </table>
        </div>

        <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:20px;margin-top:16px;">
          <h4 style="margin:0 0 14px;font-size:15px;color:#222;">Customer</h4>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            ${irow("👤 Name", `${safe(b.first_name)} ${safe(b.last_name)}`)}
          </table>
        </div>

        <p style="margin-top:24px;color:#888;font-size:12px;">
          Questions? Contact the office at <strong>(615) 669-0251</strong> or reply to this email.
        </p>
      </div>
    `,
  })
}

function irow(label, value) {
  return `
    <tr>
      <td style="padding:6px 0;width:130px;font-weight:600;color:#555;font-size:13px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:13px;color:#333;">${value}</td>
    </tr>
  `
}

function safe(v) {
  return String(v ?? "-").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
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
    moreTvs:            row.more_tvs,
    moreTvsComment:     row.more_tvs_comment,
    tvs:                row.tvs || [],
    status:             row.status,
    notes:              row.notes,
    installerId:        row.installer_id,
    installerName:      row.installer_name,
    installerEmail:     row.installer_email,
    assignedAt:         row.assigned_at,
    createdAt:          row.created_at,
  }
}
