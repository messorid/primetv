export const metadata = {
  title: "Accessibility | PrimeTvNashville",
  description: "PrimeTvNashville's commitment to an accessible website, the standard we work to, and how to tell us about a barrier.",
  alternates: { canonical: "https://www.primetvnashville.com/accessibility" },
}

export default function AccessibilityPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">Accessibility</h1>
        <p className="mt-2 text-sm text-muted">Last reviewed: October 2026</p>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-body">
          <p>
            We want everyone to be able to find our prices, book an installation and reach us, whatever device or
            assistive technology they use.
          </p>

          <h2 className="pt-2 text-xl font-bold text-ink">The standard we work to</h2>
          <p>
            We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. In practice that means
            readable text contrast, pages that can be zoomed, every button and form usable with a keyboard, labels
            on every form field, descriptions on our photos, and no content that moves without a way to pause it.
          </p>

          <h2 className="pt-2 text-xl font-bold text-ink">What we know isn&apos;t perfect yet</h2>
          <p>
            The service-area map on our pages is provided by Google Maps and we can&apos;t change how it works. Everything
            it shows is also listed in text next to it, along with a ZIP code check.
          </p>

          <h2 className="pt-2 text-xl font-bold text-ink">Tell us about a barrier</h2>
          <p>
            If any part of this site is hard to use, please let us know — and we&apos;ll help you book or get a quote
            another way in the meantime.
          </p>
          <ul className="space-y-2">
            <li>
              Phone or text:{" "}
              <a href="tel:+16156690251" className="font-bold text-ink underline decoration-brand decoration-2 underline-offset-4">(615) 669-0251</a>
            </li>
            <li>
              Email:{" "}
              <a href="mailto:info@primetvnashville.com" className="font-bold text-ink underline decoration-brand decoration-2 underline-offset-4">info@primetvnashville.com</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
