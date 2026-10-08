export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/job/<token>/signature — the customer's signature as a PNG.

import { neon } from "@neondatabase/serverless"
import { isToken, ensureCloseoutTables, decodeDataUrl } from "@/app/lib/closeout.js"

export async function GET(_request, { params }) {
  const { token } = await params
  if (!isToken(token)) return new Response("Not found", { status: 404 })
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureCloseoutTables(sql)
    const [row] = await sql`SELECT signature FROM job_closeouts WHERE token = ${token} AND signed_at IS NOT NULL`
    const img = row && decodeDataUrl(row.signature)
    if (!img) return new Response("Not found", { status: 404 })
    // Not cached: the office can reopen a closeout and the customer sign again.
    return new Response(img.buffer, {
      headers: { "Content-Type": img.mime, "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    })
  } catch (err) {
    console.error("closeout signature GET error", err)
    return new Response("Error", { status: 500 })
  }
}
