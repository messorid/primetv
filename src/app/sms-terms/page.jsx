import Link from "next/link"
import { SMS_BRAND, SMS_PHONE_DISPLAY, SMS_CONSENT_TEXT } from "../lib/smsConfig"

export const metadata = {
  title: "SMS Terms | PrimeTvNashville",
  description: "How PrimeTV text messages work: what we send, how often, and how to stop them at any time.",
  alternates: { canonical: "https://www.primetvnashville.com/sms-terms" },
}

export default function SmsTermsPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">SMS Terms</h1>
        <p className="mt-2 text-sm text-muted">Last updated: November 3, 2026</p>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-body">
          <h2 className="pt-2 text-xl font-bold text-ink">What we send</h2>
          <p>
            {SMS_BRAND} (PrimeTvNashville) texts customers about their own appointments:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>a reminder the day before your installation, with the time we&apos;ll arrive;</li>
            <li>after your job is done, a request to review our work; and</li>
            <li>replies when you text us with a question.</li>
          </ul>
          <p>Every text is sent by a member of our team. We don&apos;t send advertising or promotions by text.</p>

          <h2 className="pt-2 text-xl font-bold text-ink">How you sign up</h2>
          <p>
            You can tick the optional box when you book on our website, which reads: &ldquo;{SMS_CONSENT_TEXT}&rdquo;
            You can also agree by replying YES when we ask you by text. Agreeing is never required to book.
          </p>

          <h2 className="pt-2 text-xl font-bold text-ink">How often</h2>
          <p>Message frequency varies — usually one or two texts per appointment. Msg &amp; data rates may apply.</p>

          <h2 className="pt-2 text-xl font-bold text-ink">How to stop</h2>
          <p>
            Reply <strong className="text-ink">STOP</strong> at any time and we&apos;ll stop texting you; you&apos;ll get one text
            confirming it. Reply <strong className="text-ink">START</strong> to receive texts again. Reply <strong className="text-ink">HELP</strong>{" "}
            for help, or call {SMS_PHONE_DISPLAY} or email{" "}
            <a href="mailto:info@primetvnashville.com" className="font-bold text-ink underline decoration-brand decoration-2 underline-offset-4">info@primetvnashville.com</a>.
          </p>

          <h2 className="pt-2 text-xl font-bold text-ink">Your number and privacy</h2>
          <p>
            We use your mobile number only to text you about your own service. We don&apos;t sell, rent or share your number
            or your consent with anyone for marketing. Read our full{" "}
            <Link href="/privacy-policy" className="font-bold text-ink underline decoration-brand decoration-2 underline-offset-4">Privacy Policy</Link>.
          </p>

          <p className="text-base">
            Carriers are not liable for delayed or undelivered messages.
          </p>
        </div>
      </div>
    </section>
  )
}
