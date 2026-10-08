// The job closeout page — /job/<token>. The installer opens it on their phone
// at the end of a job, adds photos, and hands it to the customer to tip and
// sign. Private: no navigation, no analytics, not indexed, no referrer.

import { notFound } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import { loadCloseout, publicView, crewFor } from "@/app/lib/closeout.js"
import CloseoutClient from "./CloseoutClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Job completion | PrimeTvNashville",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
}

export default async function JobCloseoutPage({ params }) {
  const { token } = await params
  const sql = neon(process.env.DATABASE_URL)
  const data = await loadCloseout(sql, token)
  if (!data) notFound()
  const crew = await crewFor(sql, data.booking)
  const view = publicView(data, crew.map(m => m.installerName).filter(Boolean))
  return <CloseoutClient initial={view} />
}
