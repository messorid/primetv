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

      {/* The phone field and the opt-in box are on the last step of the form,
          which only appears once the earlier steps are filled in. This disabled
          copy puts them in the page itself, so they can be seen without filling
          the form in. It submits nothing; consent is only recorded from the real
          form. Keep this the same as step 4. */}
      <section aria-labelledby="sms-optin-title" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-soft p-5 sm:p-6">
          <h2 id="sms-optin-title" className="text-lg font-extrabold text-ink">Optional text messages</h2>
          <p className="mt-2 text-base leading-relaxed text-body">
            On the last step of this form you enter your mobile number and can choose to get text messages
            from PrimeTvNashville (&quot;PrimeTV&quot;) at that number. The box starts unchecked and you can
            book without it.
          </p>
          <form aria-labelledby="sms-example-title" className="mt-3 rounded-xl border border-zinc-300 bg-white p-4">
            <fieldset disabled className="space-y-4">
              <legend id="sms-example-title" className="text-sm font-bold text-ink">
                Example of the last step of the form
              </legend>
              <div>
                <label htmlFor="sms-example-phone" className="block text-base font-semibold text-ink">Mobile phone</label>
                <input id="sms-example-phone" type="tel" name="example-phone" placeholder="(615) 555-0142"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-base text-ink placeholder:text-body" />
              </div>
              <div className="flex items-start gap-3">
                <input id="sms-example-consent" type="checkbox" name="example-sms-consent"
                  className="mt-1 h-5 w-5 flex-none" />
                <label htmlFor="sms-example-consent" className="text-base leading-relaxed text-ink">
                  <strong>Optional:</strong> {SMS_CONSENT_TEXT}{" "}
                  <Link href="/sms-terms" className="font-semibold underline underline-offset-2">SMS Terms</Link>
                  {" "}&amp;{" "}
                  <Link href="/privacy-policy" className="font-semibold underline underline-offset-2">Privacy Policy</Link>.
                </label>
              </div>
            </fieldset>
          </form>
        </div>
      </section>
    </div>
  )
}
