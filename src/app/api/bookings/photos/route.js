export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { ensurePhotoTable, MAX_PHOTOS_PER_BOOKING, MAX_DATA_URL_CHARS } from "./shared"

function db() { return neon(process.env.DATABASE_URL) }

function isAdmin(request) {
  return Boolean(request.cookies.get("admin-auth")?.value)
}

// GET /api/bookings/photos?bookingId=<uuid>
export async function GET(request) {
  if (!isAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  try {
    const bookingId = new URL(request.url).searchParams.get("bookingId")
    if (!bookingId) {
      return Response.json({ ok: false, error: "bookingId required" }, { status: 400 })
    }
    const sql = db()
    await ensurePhotoTable(sql)
    const rows = await sql`
      SELECT id, filename, mime, data_url, created_at
      FROM booking_photos
      WHERE booking_id = ${bookingId}
      ORDER BY created_at ASC
    `
    return Response.json({
      ok: true,
      photos: rows.map(r => ({
        id: r.id, filename: r.filename, mime: r.mime,
        dataUrl: r.data_url, createdAt: r.created_at,
      })),
    })
  } catch (err) {
    console.error("photos GET error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

// POST { bookingId, photos: [{ filename, mime, dataUrl }] }
export async function POST(request) {
  if (!isAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { bookingId, photos } = await request.json()
    if (!bookingId || !Array.isArray(photos) || photos.length === 0) {
      return Response.json({ ok: false, error: "bookingId and photos required" }, { status: 400 })
    }

    const sql = db()
    await ensurePhotoTable(sql)

    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count FROM booking_photos WHERE booking_id = ${bookingId}
    `
    if (count + photos.length > MAX_PHOTOS_PER_BOOKING) {
      return Response.json(
        { ok: false, error: `Max ${MAX_PHOTOS_PER_BOOKING} photos per job (${count} already uploaded)` },
        { status: 400 }
      )
    }

    const saved = []
    for (const p of photos) {
      const dataUrl = p?.dataUrl
      if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) continue
      if (dataUrl.length > MAX_DATA_URL_CHARS) {
        return Response.json(
          { ok: false, error: `"${p.filename || "image"}" is too large even after compression` },
          { status: 400 }
        )
      }
      const [row] = await sql`
        INSERT INTO booking_photos (booking_id, filename, mime, data_url)
        VALUES (${bookingId}, ${p.filename || "photo.jpg"}, ${p.mime || "image/jpeg"}, ${dataUrl})
        RETURNING id, filename, mime, data_url, created_at
      `
      saved.push({
        id: row.id, filename: row.filename, mime: row.mime,
        dataUrl: row.data_url, createdAt: row.created_at,
      })
    }

    if (saved.length === 0) {
      return Response.json({ ok: false, error: "No valid images in request" }, { status: 400 })
    }
    return Response.json({ ok: true, photos: saved })
  } catch (err) {
    console.error("photos POST error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

// DELETE /api/bookings/photos?id=<uuid>
export async function DELETE(request) {
  if (!isAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  try {
    const id = new URL(request.url).searchParams.get("id")
    if (!id) return Response.json({ ok: false, error: "id required" }, { status: 400 })
    const sql = db()
    await ensurePhotoTable(sql)
    await sql`DELETE FROM booking_photos WHERE id = ${id}`
    return Response.json({ ok: true })
  } catch (err) {
    console.error("photos DELETE error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
