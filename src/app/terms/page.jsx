export const metadata = {
  title: "Terms and Conditions | PrimeTvNashville",
  description: "Read the official Terms and Conditions of PrimeTvNashville. Important liability notice for TV mounting and cable concealment services in Nashville, TN.",
  alternates: { canonical: "https://www.primetvnashville.com/terms" },
  openGraph: {
    title: "Terms and Conditions | PrimeTvNashville",
    description: "Official policies and service terms for PrimeTvNashville customers.",
    url: "https://www.primetvnashville.com/terms",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
}

export default function TermsPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-5">

        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-black/40 mb-10">
          Last updated: August 2026 · PrimeTvNashville · Nashville, TN
        </p>

        {/* ── WALL LIABILITY WARNING — FIRST AND PROMINENT ── */}
        <div className="rounded-2xl border-2 border-[#E50914] bg-red-50 p-6 mb-12">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl leading-none mt-0.5">⚠️</span>
            <h2 className="text-lg font-extrabold text-[#E50914] uppercase tracking-wide">
              Important Liability Notice — Please Read Before Booking
            </h2>
          </div>

          <p className="text-sm text-gray-800 leading-relaxed mb-3">
            <strong>This notice applies to all TV mounting services and all hidden cable concealment (in-wall cable routing) services.</strong>
          </p>

          <p className="text-sm text-gray-800 leading-relaxed mb-3">
            Before any work begins, <strong>the customer is solely responsible for verifying that there are no electrical wires, water pipes, gas lines, structural beams, or any other obstructions inside or behind the wall</strong> where the TV will be mounted or where cables will be routed.
          </p>

          <p className="text-sm text-gray-800 leading-relaxed mb-3">
            PrimeTvNashville technicians <strong>cannot see inside walls</strong> and therefore <strong>cannot guarantee the absence of hidden hazards</strong>. Our team proceeds with the work based on the customer&apos;s request and the customer&apos;s assurance that the wall area is safe.
          </p>

          <div className="rounded-xl bg-[#E50914]/10 border border-[#E50914]/30 px-4 py-3 my-4">
            <p className="text-sm font-bold text-[#E50914]">
              PrimeTvNashville is NOT responsible for any damage to:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-800">
              <li className="flex items-center gap-2"><span className="text-[#E50914] font-bold">•</span> Electrical wiring or conduits inside walls</li>
              <li className="flex items-center gap-2"><span className="text-[#E50914] font-bold">•</span> Water pipes, plumbing lines, or any fluid-carrying tubes</li>
              <li className="flex items-center gap-2"><span className="text-[#E50914] font-bold">•</span> Gas lines or ventilation ducts</li>
              <li className="flex items-center gap-2"><span className="text-[#E50914] font-bold">•</span> Structural elements such as beams or joists</li>
              <li className="flex items-center gap-2"><span className="text-[#E50914] font-bold">•</span> Any other material or infrastructure concealed within the wall</li>
            </ul>
          </div>

          <p className="text-sm text-gray-800 leading-relaxed">
            By booking our services, the customer acknowledges and accepts full responsibility for any damage that may occur to in-wall infrastructure during the TV mounting or cable concealment process.
            If you are unsure about what is inside your walls, we strongly recommend consulting a licensed contractor or using a stud/wire detector before scheduling the service.
          </p>
        </div>

        {/* ── TERMS BODY ── */}
        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

          <div>
            <h2 className="text-base font-bold text-black mb-2">1. Introduction</h2>
            <p>
              Welcome to PrimeTvNashville. These Terms and Conditions outline the rules and regulations for the use of our website at www.primetvnashville.com and the services provided by PrimeTvNashville.
            </p>
            <p className="mt-2">
              By accessing this website and/or booking our services, you accept these terms in full. Do not use PrimeTvNashville&apos;s services if you do not agree to all of the terms stated here.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-2">2. Scope of Services</h2>
            <p>
              PrimeTvNashville specializes in TV wall mounting, cable concealment, soundbar installation, and related home installation services. By booking, you agree to provide accurate information and ensure the installation area is accessible and ready for our technicians. Scope of work and pricing will be communicated before work begins.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-2">3. Wall Liability — TV Mounting &amp; Cable Concealment</h2>
            <p>
              As described in the notice above, the customer bears full responsibility for confirming the safety of the wall space prior to installation. This applies to:
            </p>
            <ul className="mt-2 space-y-1 pl-4">
              <li><strong>TV Mounting:</strong> Any drilling or anchoring into walls, studs, or surfaces.</li>
              <li><strong>Hidden Cable Concealment:</strong> Any in-wall routing of HDMI, power, or other cables through walls, ceilings, or floors.</li>
            </ul>
            <p className="mt-2">
              PrimeTvNashville technicians will take reasonable precautions, but cannot be held liable for damage to any existing infrastructure inside walls, including but not limited to: electrical wiring, plumbing, gas lines, or structural elements.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-2">4. Booking and Payment</h2>
            <p>
              All bookings must be made via our website, phone, or email. Payment is due upon service completion unless otherwise arranged. We accept cash, Zelle, card, PayPal, Venmo, and other agreed methods.
            </p>
            <p className="mt-2">
              Additional fees may apply for services beyond the initial scope, including additional materials, unforeseen installation complexities, or wall type surcharges (brick, tile, concrete, metal +$25).
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-2">5. Cancellation Policy</h2>
            <p>
              Cancellations made more than 24 hours before the scheduled appointment are accepted at no charge. Cancellations within 24 hours of the appointment may incur a fee of up to 20% of the total service cost.
            </p>
            <p className="mt-2">
              PrimeTvNashville reserves the right to reschedule appointments due to weather, technician availability, or equipment issues. We will notify you as soon as possible.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-2">6. Warranty</h2>
            <p>
              We offer a 30-day workmanship warranty on all installations. If an issue arises that is directly related to the quality of our work within 30 days of service, we will address it at no additional cost. This warranty does not cover damage caused by misuse, tampering, customer modifications, or pre-existing wall conditions.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-2">7. Privacy</h2>
            <p>
              Any personal information collected through our website or booking process is used solely to deliver our services. We do not share customer information with third parties without explicit consent, except where required by law.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-2">8. Changes to These Terms</h2>
            <p>
              PrimeTvNashville reserves the right to update these Terms and Conditions at any time. Changes will be posted on this page. Continued use of our services constitutes acceptance of the updated terms.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-200 text-xs text-gray-400">
            Questions? Contact us at{" "}
            <a href="tel:+16156690251" className="text-[#E50914] font-semibold">(615) 669-0251</a>
            {" "}or{" "}
            <a href="mailto:info@primetvnashville.com" className="text-[#E50914] font-semibold">info@primetvnashville.com</a>
          </div>

        </div>
      </div>
    </section>
  )
}
