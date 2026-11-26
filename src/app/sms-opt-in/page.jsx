import Link from "next/link"
import SmsOptInForm from "./SmsOptInForm"

export const metadata = {
  title: "Appointment text reminders | PrimeTV Nashville",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
}

export default async function SmsOptInPage({ searchParams }) {
  const { expired } = await searchParams
  return (
    <section className="mx-auto max-w-xl px-5 pb-12 pt-32 sm:pt-36">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Appointment text reminders</h1>
      {expired ? (
        <p className="mt-4 text-body">This link has expired. <Link href="/contact" className="font-semibold underline">Contact PrimeTV</Link> to request a new booking confirmation.</p>
      ) : (
        <>
          <p className="mb-6 mt-3 text-body">Choose whether to get appointment reminders from PrimeTV by text. Your appointment is already booked.</p>
          <SmsOptInForm />
        </>
      )}
    </section>
  )
}
