"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CheckboxField, FormAlert, PhoneField, PrimaryButton } from "../components/forms/FormKit"
import { BOOKING_EMAIL_CONSENT_TEXT, BOOKING_EMAIL_CONSENT_VERSION } from "../lib/smsConfig"

export default function SmsOptInForm() {
  const [phone, setPhone] = useState("")
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)
  const resultHeading = useRef(null)

  useEffect(() => { if (result) resultHeading.current?.focus() }, [result])

  async function submit(event) {
    event.preventDefault()
    setError("")
    setBusy(true)
    try {
      const response = await fetch("/api/sms/booking-opt-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, consent, version: BOOKING_EMAIL_CONSENT_VERSION }),
      })
      const data = await response.json()
      if (response.ok && data.ok) setResult(data)
      else setError(data.error || "We could not save your choice. Please try again.")
    } catch {
      setError("Check your connection and try again.")
    } finally {
      setBusy(false)
    }
  }

  if (result) return (
    <div className="rounded-xl border border-gray-300 p-4">
      <h2 ref={resultHeading} tabIndex={-1} className="text-lg font-bold">Your choice was saved</h2>
      <p className="mt-2 text-body">{result.optedOut
        ? "You previously stopped texts from PrimeTV. Reply START to our texting number to resume reminders."
        : "PrimeTV can now text you appointment reminders. Reply STOP at any time to opt out."}</p>
    </div>
  )

  return (
    <form onSubmit={submit} aria-busy={busy}>
      <fieldset disabled={busy} className="min-w-0 space-y-4">
        <legend className="sr-only">Text message preferences</legend>
        <PhoneField id="booking-sms-phone" label="Mobile phone" value={phone} onChange={setPhone}
          hint="Enter the 10-digit US mobile number you gave us when booking." required />
        <CheckboxField id="booking-sms-choice" checked={consent} onChange={setConsent} required>
          {BOOKING_EMAIL_CONSENT_TEXT}
        </CheckboxField>
        <p className="text-sm text-body">
          <Link href="/sms-terms" className="font-semibold underline">SMS Terms</Link>
          {" and "}
          <Link href="/privacy-policy" className="font-semibold underline">Privacy Policy</Link>
        </p>
        {error && <FormAlert tone="error">{error}</FormAlert>}
        <PrimaryButton type="submit" busy={busy} busyLabel="Saving…">Sign up for text reminders</PrimaryButton>
        <p className="text-sm text-muted">You can close this page if you prefer to skip text reminders.</p>
      </fieldset>
    </form>
  )
}
