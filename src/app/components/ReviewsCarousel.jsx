"use client"
// The review cards. On a phone they are a swipeable carousel that moves to the
// next review every few seconds; from tablet width up they are a plain grid.
//
// It moves on its own, so it can be stopped (WCAG 2.2.2): there is a pause
// button, it stops for good once the visitor swipes or uses the dots, it waits
// while a card has keyboard focus or the carousel is off screen, and it never
// starts for someone who has asked their device for reduced motion.
import { useCallback, useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"

const EVERY_MS = 5000

export default function ReviewsCarousel({ reviews }) {
  const list = useRef(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [isCarousel, setIsCarousel] = useState(false)
  const [inView, setInView] = useState(false)
  const auto = useRef(false) // true while a scroll is ours, not the visitor's

  // Only a carousel when the row actually scrolls (phone widths).
  useEffect(() => {
    const el = list.current
    if (!el) return
    const measure = () => setIsCarousel(el.scrollWidth > el.clientWidth + 4)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // It only moves while it is on screen, and the wait starts over each time it
  // comes into view, so nobody arrives to find it halfway through.
  useEffect(() => {
    const el = list.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (isCarousel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(true)
    if (!isCarousel) setPlaying(false)
  }, [isCarousel])

  const goTo = useCallback((i, byUser) => {
    const el = list.current
    const card = el?.children[i]
    if (!card) return
    if (byUser) setPlaying(false)
    auto.current = !byUser
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" })
    setTimeout(() => { auto.current = false }, 900)
  }, [])

  useEffect(() => {
    if (!playing || !inView) return
    const t = setInterval(() => {
      const el = list.current
      if (!el || el.contains(document.activeElement) || document.visibilityState !== "visible") return
      goTo((index + 1) % reviews.length, false)
    }, EVERY_MS)
    return () => clearInterval(t)
  }, [playing, inView, index, reviews.length, goTo])

  // Which card is showing, from the scroll position.
  function onScroll() {
    const el = list.current
    if (!el) return
    const mid = el.scrollLeft + el.clientWidth / 2
    let best = 0, dist = Infinity
    ;[...el.children].forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - el.offsetLeft + c.offsetWidth / 2 - mid)
      if (d < dist) { dist = d; best = i }
    })
    setIndex(best)
  }

  return (
    <div>
      <ul
        ref={list}
        onScroll={onScroll}
        onTouchStart={() => setPlaying(false)}
        onWheel={() => { if (!auto.current) setPlaying(false) }}
        aria-label="Customer reviews"
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
      >
        {reviews.map((r, i) => (
          <li key={r.name + r.text.slice(0, 20)}
            aria-label={isCarousel ? `Review ${i + 1} of ${reviews.length}` : undefined}
            className="flex w-[86%] flex-none snap-center flex-col rounded-2xl border border-zinc-200 bg-white p-5 md:w-auto">
            <p className="flex gap-0.5" role="img" aria-label={`${r.stars || 5} out of 5 stars`}>
              {Array.from({ length: r.stars || 5 }, (_, k) => (
                <Star key={k} aria-hidden="true" size={18} className="fill-amber-400 text-amber-400" />
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

      {isCarousel && (
        <div className="mt-3 flex items-center justify-between gap-4 md:hidden">
          <div className="flex items-center">
            {reviews.map((r, i) => (
              <button key={r.name} type="button" onClick={() => goTo(i, true)}
                aria-label={`Show review ${i + 1} of ${reviews.length}`} aria-current={i === index ? "true" : undefined}
                className="flex size-11 items-center justify-center">
                <span className={`block h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-brand" : "w-2.5 bg-zinc-400"}`} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setPlaying(p => !p)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-zinc-300 bg-white px-4 text-sm font-bold text-ink">
            <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
            {playing ? "Pause" : "Play"}<span className="sr-only"> reviews</span>
          </button>
        </div>
      )}
    </div>
  )
}
