"use client"

// The hero photo, rotating through real installs.
//
// It does not mount all nine images. They all sit inside the viewport, so
// next/image would load every one on first paint — around half a megabyte on a
// phone for eight pictures nobody has seen yet. Only the current and the next
// slide are in the DOM, which is enough to crossfade cleanly.
//
// It also does not pause on hover, and that is a correction rather than an
// oversight. The first version did, and on a desktop this hero is large and
// centred, so a cursor left resting anywhere near the middle of the page froze
// it indefinitely — which is exactly how it was reported. Auto-advance is
// stopped only by a hidden tab or by keyboard focus, the latter so that someone
// tabbing to the dots can actually use them.

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"

const INTERVAL = 5000
// After this many held ticks we move on regardless. A slow image is a worse
// reason to freeze the hero than to show a brief empty frame.
const MAX_HOLDS = 2

export default function HeroCarousel({ slides, className = "" }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef(null)
  const holds = useRef(0)
  const count = slides.length

  // Whether a slide's photo has actually arrived, asked of the DOM rather than
  // tracked from an onLoad event.
  //
  // This used to listen for onLoad and remember the answer. That is unreliable
  // in exactly the case most visitors are in: when the image is already in the
  // browser cache it completes BEFORE React attaches the handler during
  // hydration, so onLoad never fires, the next slide is never considered ready,
  // and the carousel freezes on slide one forever. A cold-cache test passes and
  // every returning visitor sees a still photo.
  //
  // `complete && naturalWidth > 0` is the state itself, not a notification
  // about it, so there is no event to miss.
  const isReady = useCallback(i => {
    const img = rootRef.current?.querySelector(`[data-slide="${i}"] img`)
    return Boolean(img?.complete && img.naturalWidth > 0)
  }, [])

  // There is deliberately no prefers-reduced-motion branch here. The first
  // version stopped the carousel dead for anyone with that setting on, and on
  // Windows plenty of people have animation effects switched off without ever
  // meaning "hide the photographs from me" — they simply never saw the hero
  // change. A crossfade is an opacity change with nothing moving across the
  // screen, which is the standard reduced-motion-safe alternative to a slide,
  // so everyone gets the same behaviour.

  // A hidden tab should not be burning timers or decoding images.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  useEffect(() => {
    if (paused || count < 2) return
    const id = setInterval(() => {
      setIndex(i => {
        const candidate = (i + 1) % count
        if (isReady(candidate) || holds.current >= MAX_HOLDS) {
          holds.current = 0
          return candidate
        }
        holds.current += 1
        return i
      })
    }, INTERVAL)
    return () => clearInterval(id)
    // `index` is a dependency so the timer restarts on every change, including
    // a manual one. Without it, tapping a dot could leave only a sliver of the
    // current interval before the slide moved on again.
  }, [paused, count, index, isReady])

  const next = (index + 1) % count

  return (
    <div
      ref={rootRef}
      // A neutral base so any moment without a painted image reads as a dim
      // frame rather than a white hole punched in the hero.
      className={`relative overflow-hidden bg-neutral-200 ${className}`}
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
            data-slide={i}
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
              //
              // Slide 1 is the LCP image. Slide 2 is fetched eagerly but at low
              // priority so the first crossfade always has something to show
              // without competing with the LCP.
              priority={i === 0}
              loading={i <= 1 ? "eager" : undefined}
              fetchPriority={i === 1 ? "low" : undefined}
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
