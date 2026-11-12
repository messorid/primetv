// What customers say, right under the hero: real Google reviews from
// lib/reviews.js, word for word. Renders nothing while that list is empty.
import { Star } from "lucide-react"
import { Section, SectionHeader } from "./ui/Section"
import { REVIEWS, GOOGLE_PROFILE_URL } from "../lib/reviews"

export default function ReviewsSection() {
  const reviews = REVIEWS.filter(r => r?.name && r?.text)
  if (!reviews.length) return null
  return (
    <Section id="reviews" tone="soft" labelledBy="reviews-title" inner="py-12 md:py-16">
      <SectionHeader id="reviews-title" eyebrow="Google reviews" title="What Nashville customers say" />
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map(r => (
          <li key={r.name + r.text.slice(0, 20)} className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="flex gap-0.5" role="img" aria-label={`${r.stars || 5} out of 5 stars`}>
              {Array.from({ length: r.stars || 5 }, (_, i) => (
                <Star key={i} aria-hidden="true" size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </p>
            <blockquote className="mt-3 flex-1 text-base leading-relaxed text-body">“{r.text}”</blockquote>
            <p className="mt-4 text-base font-bold text-ink">
              {r.name}
              <span className="block text-sm font-normal text-muted">{r.when ? `${r.when} · ` : ""}Google review</span>
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-6">
        <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center text-base font-bold text-brand-dark underline decoration-2 underline-offset-4 hover:text-ink">
          Read all our reviews on Google<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </Section>
  )
}
