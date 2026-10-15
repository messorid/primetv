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
  // The visitor's own pause, from the button. Kept apart from `paused`, which
  // is about focus and hidden tabs and clears itself.
  const [stopped, setStopped] = useState(false)
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
    if (paused || stopped || count < 2) return
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
  }, [paused, stopped, count, index, isReady])

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

      {/* Gradient so the controls stay readable over a bright photo */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

      {/* Controls: a pause button (moving content must be stoppable, WCAG
          2.2.2) and one dot per photo. Each dot is a 24px target with the
          visible mark drawn inside it. */}
      {count > 1 && (
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 sm:bottom-3 sm:left-3 sm:right-3">
          <button
            type="button"
            onClick={() => setStopped(v => !v)}
            aria-pressed={stopped}
            aria-label={stopped ? "Play photo slideshow" : "Pause photo slideshow"}
            className="flex size-11 flex-none items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/75"
          >
            {stopped ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current"><path d="M8 5v14l11-7z" /></svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
            )}
          </button>
          <div className="flex flex-1 flex-wrap items-center justify-center">
            {slides.map((sl, i) => (
              <button
                key={sl.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show installation photo ${i + 1} of ${count}`}
                aria-current={i === index}
                className="group flex size-6 items-center justify-center"
              >
                <span aria-hidden="true" className={`block h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-white" : "w-2 bg-white/60 group-hover:bg-white/90"
                }`} />
              </button>
            ))}
          </div>
          <span aria-hidden="true" className="size-11 flex-none" />
        </div>
      )}
    </div>
  )
}
