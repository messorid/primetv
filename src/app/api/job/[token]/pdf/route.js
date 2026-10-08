export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/job/<token>/pdf — the signed job record as a PDF download.

import { neon } from "@neondatabase/serverless"
import { isToken, closeoutRecord } from "@/app/lib/closeout.js"
import { buildCloseoutPdf, closeoutPdfName } from "@/app/lib/closeoutPdf.js"

export async function GET(_request, { params }) {
  const { token } = await params
  if (!isToken(token)) return new Response("Not found", { status: 404 })
  try {
    const record = await closeoutRecord(neon(process.env.DATABASE_URL), token)
    if (!record) return new Response("This job has not been signed yet.", { status: 404 })
    const pdf = await buildCloseoutPdf(record)
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${closeoutPdfName(record.view)}"`,
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    })
  } catch (err) {
    console.error("closeout PDF error", err)
    return new Response("Could not build the PDF.", { status: 500 })
  }
}
