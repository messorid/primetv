import Link from "next/link"
import BookingFormSection from "@/app/components/BookingFormSection"
import { SMS_CONSENT_TEXT } from "@/app/lib/smsConfig"

export const metadata = {
  title: "Book TV Mounting in Nashville | PrimeTvNashville",
  description: "Book your TV mounting or installation appointment in Nashville TN online. Same-day availability, upfront pricing. Homes, apartments and businesses welcome.",
  keywords: ["book TV mounting Nashville", "schedule TV installation Nashville", "TV mount appointment Nashville"],
  openGraph: {
    title: "Book TV Mounting in Nashville | PrimeTvNashville",
    description: "Schedule your professional TV mounting or installation appointment in Nashville TN. Fast, easy online booking.",
    url: "https://www.primetvnashville.com/book",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.primetvnashville.com/book",
  },
}

export default function Page() {
  return (
    <div className="bg-white text-black min-h-screen">
      <BookingFormSection />

      {/* The opt-in box is on the last step of the form. Its exact words are
          also here, in the page itself, so they can be read without filling
          the form in. Keep this the same as the box. */}
      <section aria-labelledby="sms-optin-title" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-soft p-5 sm:p-6">
          <h2 id="sms-optin-title" className="text-lg font-extrabold text-ink">Optional text messages</h2>
          <p className="mt-2 text-base leading-relaxed text-body">
            On the last step of this form you can choose to get text messages from PrimeTvNashville
            (&quot;PrimeTV&quot;). The box starts unchecked and you can book without it. It reads:
          </p>
          <p className="mt-3 rounded-xl border border-zinc-300 bg-white p-4 text-base leading-relaxed text-ink">
            <span aria-hidden="true">&#9744; </span><strong>Optional:</strong> {SMS_CONSENT_TEXT}{" "}
            <Link href="/sms-terms" className="font-semibold underline underline-offset-2">SMS Terms</Link>
            {" "}&amp;{" "}
            <Link href="/privacy-policy" className="font-semibold underline underline-offset-2">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
