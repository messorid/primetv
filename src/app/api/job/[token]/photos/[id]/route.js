export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/job/<token>/photos/<id> — one closeout photo as an image, so pages
// load photos as ordinary <img> tags instead of megabytes of inline base64.

import { neon } from "@neondatabase/serverless"
import { isToken, ensureCloseoutTables, decodeDataUrl } from "@/app/lib/closeout.js"

const isUuid = v => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v || ""))

export async function GET(_request, { params }) {
  const { token, id } = await params
  if (!isToken(token) || !isUuid(id)) return new Response("Not found", { status: 404 })
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureCloseoutTables(sql)
    const [row] = await sql`
      SELECT p.data_url FROM closeout_photos p
      JOIN job_closeouts c ON c.booking_id = p.booking_id
      WHERE c.token = ${token} AND p.id = ${id}
    `
    const img = row && decodeDataUrl(row.data_url)
    if (!img) return new Response("Not found", { status: 404 })
    // A photo never changes under its id, so the browser can keep it.
    return new Response(img.buffer, {
      headers: {
        "Content-Type": img.mime,
        "Cache-Control": "private, max-age=31536000, immutable",
        "X-Robots-Tag": "noindex",
      },
    })
  } catch (err) {
    console.error("closeout photo GET error", err)
    return new Response("Error", { status: 500 })
  }
}
