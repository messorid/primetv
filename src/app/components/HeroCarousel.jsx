"use client"

// The hero photo, rotating through real installs.
//
// Three things this deliberately does not do:
//   • It does not mount all nine images. They all sit inside the viewport, so
//     next/image would load every one on first paint — around half a megabyte
//     on a phone for eight pictures nobody has seen yet. Only the current and
//     the next slide are in the DOM, which is enough to crossfade cleanly.
//   • It does not animate for people who asked the OS not to animate things.
//     prefers-reduced-motion stops the auto-advance; the dots still work.
//   • It does not keep cycling in a background tab, or while someone is
//     hovering or tabbing through it.

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"

const INTERVAL = 5000

export default function HeroCarousel({ slides, className = "" }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  // Slides whose image has actually loaded. The carousel refuses to fade to a
  // photo that has not arrived yet, which is what produced a blank frame on a
  // slow first visit; it holds the current one and tries again next tick.
  //
  // A ref, not state, on purpose. As state this belongs in the interval's
  // dependency array, and then every image that finishes loading tears down and
  // recreates the timer — with nine slides the dwell never completes and the
  // carousel stalls. Nothing renders from this, so a ref is the honest type.
  const ready = useRef(new Set([0]))
  const count = slides.length

  const markReady = useCallback(i => { ready.current.add(i) }, [])

  // Respect the OS setting, and follow it if the user changes it live.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // A hidden tab should not be burning timers or decoding images.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  useEffect(() => {
    if (paused || reduced || count < 2) return
    const id = setInterval(() => {
      setIndex(i => {
        const candidate = (i + 1) % count
        // Hold rather than fade to an image that has not loaded.
        return ready.current.has(candidate) ? candidate : i
      })
    }, INTERVAL)
    return () => clearInterval(id)
    // `index` is a dependency so the timer restarts on every change, including
    // a manual one. Without it, tapping a dot could leave only a sliver of the
    // current interval before the slide moved on again.
  }, [paused, reduced, count, index])

  const next = (index + 1) % count

  return (
    <div
      // A neutral base so any moment without a painted image reads as a dim
      // frame rather than a white hole punched in the hero.
      className={`relative overflow-hidden bg-neutral-200 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Recent TV installations in Nashville"
    >
      {slides.map((s, i) => {
        // Current and next only — see the note at the top of the file.
        if (i !== index && i !== next) return null
        const active = i === index
        return (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!active}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 580px"
              // No `quality` prop: Next only honours values declared in
              // images.qualities, so the old quality={82} here was silently
              // falling back to the default 75 and just misled the reader.
              // Slide 1 is the LCP image. Slide 2 is fetched eagerly but at low
              // priority so the first crossfade always has something to show
              // without competing with the LCP.
              priority={i === 0}
              loading={i <= 1 ? "eager" : undefined}
              fetchPriority={i === 1 ? "low" : undefined}
              onLoad={() => markReady(i)}
              style={{ objectPosition: s.pos || "50% 50%" }}
              className="object-cover"
            />
          </div>
        )
      })}

      {/* Gradient so the badges stay readable over a bright photo */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Badges, unchanged from the static hero */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2">
        <span className="text-[11px] sm:text-xs font-bold text-white bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5">
          Nashville, TN
        </span>

        {/* Dots sit between the badges so they never cover the install */}
        {count > 1 && (
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show installation photo ${i + 1} of ${count}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        <span className="text-[11px] sm:text-xs font-bold text-white bg-[#E50914]/90 backdrop-blur-sm rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5">
          Same-Day ⚡
        </span>
      </div>
    </div>
  )
}
