// An installer's own page — /crew/<token>. Their jobs for today, the coming
// weeks and the past week, each with directions, the customer's phone, the
// work and the job closeout. Private: no navigation, analytics, indexing or
// referrer.

import { notFound } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import { loadCrewPage, shiftDay, AHEAD_DAYS, PAST_DAYS } from "@/app/lib/crewPortal.js"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "My jobs | PrimeTvNashville",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
}

const fmtDay = (iso, opts = { weekday: "long", month: "short", day: "numeric" }) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { ...opts, timeZone: "UTC" })
const tel = p => { const d = String(p || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, ""); return d.length === 10 ? `+1${d}` : "" }
const maps = a => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a)}`

export default async function CrewPage({ params }) {
  const { token } = await params
  const page = await loadCrewPage(neon(process.env.DATABASE_URL), token)
  if (!page) notFound()
  const tomorrow = shiftDay(page.today, 1)

  return (
    <div className="min-h-screen bg-[#f4f5f7] pb-16">
      <header className="bg-[#111] px-4 py-3.5">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <p className="text-lg font-extrabold tracking-tight text-white">
            <span className="text-[#E50914]">Prime</span>TvNashville
          </p>
          <p className="truncate text-xs font-semibold uppercase tracking-widest text-white/50">Crew · {page.name}</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 pt-5">
        <div>
          <h1 className="text-2xl font-extrabold text-black">Hi {page.name.split(" ")[0]}</h1>
          <p className="mt-0.5 text-sm text-black/55">{fmtDay(page.today, { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>

        <Section title={`Today (${page.todayJobs.length})`} accent>
          {page.todayJobs.length ? page.todayJobs.map(j => <Job key={j.id} j={j} />) : <Empty>No jobs today.</Empty>}
        </Section>

        <Section title={`Coming up (${page.upcoming.length})`} hint={`Next ${AHEAD_DAYS} days`}>
          {page.upcoming.length
            ? page.upcoming.map(j => <Job key={j.id} j={j} dayLabel={j.date === tomorrow ? "Tomorrow" : fmtDay(j.date)} />)
            : <Empty>Nothing booked yet.</Empty>}
        </Section>

        {page.recent.length > 0 && (
          <Section title={`Last ${PAST_DAYS} days (${page.recent.length})`} hint="Open a closeout that still needs the customer's signature.">
            {page.recent.map(j => <Job key={j.id} j={j} dayLabel={fmtDay(j.date)} past />)}
          </Section>
        )}

        <p className="pt-2 text-center text-sm text-black/50">
          Questions? Call the office at <a href="tel:+16156690251" className="font-semibold text-[#E50914]">(615) 669-0251</a>
        </p>
      </main>
    </div>
  )
}

function Section({ title, hint, accent, children }) {
  return (
    <section>
      <h2 className={`text-sm font-extrabold uppercase tracking-widest ${accent ? "text-[#E50914]" : "text-black/50"}`}>{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-black/40">{hint}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

function Empty({ children }) {
  return <p className="rounded-2xl border border-dashed border-black/15 bg-white px-4 py-6 text-center text-sm text-black/40">{children}</p>
}

function Job({ j, dayLabel, past }) {
  const phone = tel(j.phone)
  return (
    <article className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {dayLabel && <p className="text-xs font-bold uppercase tracking-wide text-black/45">{dayLabel}</p>}
          <p className="text-lg font-extrabold leading-tight text-black">{j.time || "Flexible"}</p>
          <p className="mt-0.5 text-base font-semibold text-black">{j.customer || "Customer"}</p>
        </div>
        {j.signed
          ? <span className="flex-none rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">✍️ Signed</span>
          : past && <span className="flex-none rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">Not signed</span>}
      </div>

      {j.address && <p className="mt-2 text-[15px] text-black/70">{j.address}</p>}

      <ul className="mt-3 space-y-1">
        {j.work.map((w, i) => (
          <li key={i} className="flex gap-2 text-[15px] text-black"><span aria-hidden="true" className="text-emerald-600">•</span>{w}</li>
        ))}
      </ul>
      {j.customerNotes && <p className="mt-2 whitespace-pre-line rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">📋 {j.customerNotes}</p>}
      {j.notes && <p className="mt-2 whitespace-pre-line rounded-xl bg-purple-50 px-3 py-2 text-sm text-purple-900">🗒️ {j.notes}</p>}
      {j.partners.length > 0 && <p className="mt-2 text-sm text-black/60">👷 With {j.partners.join(", ")}</p>}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {j.address && <a href={maps(j.address)} target="_blank" rel="noreferrer" className={btn}>📍 Directions</a>}
        {phone && <a href={`tel:${phone}`} className={btn}>📞 Call</a>}
        {phone && <a href={`sms:${phone}`} className={btn}>💬 Text</a>}
        <a href={j.closeoutPath} className={j.signed ? btn : btnPrimary}>
          ✍️ {j.signed ? "View closeout" : "Closeout"}
        </a>
      </div>
    </article>
  )
}

const btnBase = "flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border-2 px-3 text-sm font-bold"
const btn = `${btnBase} border-black/10 text-black`
const btnPrimary = `${btnBase} border-[#E50914] bg-[#E50914] text-white`
