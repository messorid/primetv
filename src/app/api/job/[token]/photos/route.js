export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Photos of the finished work, added by the installer from the closeout page.
//   POST   /api/job/<token>/photos        { dataUrl }  — one photo per request,
//          so a dozen phone photos never hit the request size limit together
//   DELETE /api/job/<token>/photos?id=…
// Both stop working once the customer has signed.

import { neon } from "@neondatabase/serverless"
import { loadCloseout, MAX_CLOSEOUT_PHOTOS, MAX_PHOTO_CHARS } from "@/app/lib/closeout.js"

const json = (data, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } })

const isUuid = v => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v || ""))

async function openCloseout(sql, token) {
  const data = await loadCloseout(sql, token)
  if (!data) return { error: json({ ok: false, error: "This closeout link is not valid." }, 404) }
  if (data.booking.status === "cancelled") return { error: json({ ok: false, error: "This job was cancelled." }, 409) }
  if (data.closeout.signed_at) return { error: json({ ok: false, error: "This job is already signed, so photos can no longer change." }, 409) }
  return { data }
}

export async function POST(request, { params }) {
  const { token } = await params
  try {
    const sql = neon(process.env.DATABASE_URL)
    const { data, error } = await openCloseout(sql, token)
    if (error) return error

    let body
    try { body = await request.json() } catch { return json({ ok: false, error: "Bad request" }, 400) }
    const dataUrl = body?.dataUrl
    if (typeof dataUrl !== "string" || !/^data:image\/(jpeg|png|webp);base64,/.test(dataUrl)) {
      return json({ ok: false, error: "That file is not a photo." }, 400)
    }
    if (dataUrl.length > MAX_PHOTO_CHARS) return json({ ok: false, error: "That photo is too large." }, 400)
    if (data.photoIds.length >= MAX_CLOSEOUT_PHOTOS) {
      return json({ ok: false, error: `Up to ${MAX_CLOSEOUT_PHOTOS} photos per job.` }, 400)
    }

    const [row] = await sql`
      INSERT INTO closeout_photos (booking_id, data_url)
      VALUES (${data.closeout.booking_id}, ${dataUrl})
      RETURNING id
    `
    return json({ ok: true, photo: { id: row.id, url: `/api/job/${token}/photos/${row.id}` } })
  } catch (err) {
    console.error("closeout photo upload error", err)
    return json({ ok: false, error: "Could not save the photo. Please try again." }, 500)
  }
}

export async function DELETE(request, { params }) {
  const { token } = await params
  try {
    const id = new URL(request.url).searchParams.get("id")
    if (!isUuid(id)) return json({ ok: false, error: "Bad request" }, 400)
    const sql = neon(process.env.DATABASE_URL)
    const { data, error } = await openCloseout(sql, token)
    if (error) return error
    await sql`DELETE FROM closeout_photos WHERE id = ${id} AND booking_id = ${data.closeout.booking_id}`
    return json({ ok: true })
  } catch (err) {
    console.error("closeout photo delete error", err)
    return json({ ok: false, error: "Could not remove the photo." }, 500)
  }
}
