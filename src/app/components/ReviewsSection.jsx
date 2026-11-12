// What customers say, right under the hero: real Google reviews from
// lib/reviews.js, word for word — a carousel on phones, a grid on wider
// screens (ReviewsCarousel). Renders nothing while that list is empty.
import ReviewsCarousel from "./ReviewsCarousel"
import { Section, SectionHeader } from "./ui/Section"
import { REVIEWS, GOOGLE_PROFILE_URL } from "../lib/reviews"

export default function ReviewsSection() {
  const reviews = REVIEWS.filter(r => r?.name && r?.text)
  if (!reviews.length) return null
  return (
    <Section id="reviews" tone="soft" labelledBy="reviews-title" inner="py-12 md:py-16">
      <SectionHeader id="reviews-title" eyebrow="Google reviews" title="What Nashville customers say" />
      <div className="mt-8"><ReviewsCarousel reviews={reviews} /></div>
      <p className="mt-6">
        <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center text-base font-bold text-brand-dark underline decoration-2 underline-offset-4 hover:text-ink">
          Read all our reviews on Google<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </Section>
  )
}
