"use client"
// Real installations. Each photo opens larger in a dialog that can be used
// with a keyboard: arrow keys move between photos, Escape closes, and focus
// returns to the photo that was opened.
import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Section, SectionHeader } from "./ui/Section"

const PHOTOS = [
  { src: "/images/tvs/tv-over-fireplace-dark-accent-wall-nashville.jpeg",              alt: "TV mounted over a fireplace on a dark accent wall with a floating mantel and no visible cables, Nashville TN" },
  { src: "/images/tvs/tv-mounted-stacked-stone-fireplace-nashville.jpeg",              alt: "Large TV wall mounted on a stacked stone fireplace above a reclaimed wood mantel, Nashville TN" },
  { src: "/images/hometheater/home-theater-led-accent-lighting-theater-seating-nashville.jpeg", alt: "Home theater room with leather recliners, LED floor lighting and backlit movie posters, Nashville TN" },
  { src: "/images/tvs/tv-ceiling-mount-wood-slat-accent-wall-nashville.jpeg",          alt: "TV on a ceiling-drop mount in front of a wood slat accent wall, Nashville TN" },
  { src: "/images/tvs/samsung-frame-tv-art-mode-painted-brick-fireplace-nashville.jpeg", alt: "Samsung Frame TV in Art Mode mounted on a painted brick fireplace, Nashville TN" },
  { src: "/images/tvs/tv-wall-mount-hidden-cables-drywall-nashville.jpeg",             alt: "TV wall mounted on drywall with the cables routed inside the wall, Nashville TN" },
  { src: "/images/hometheater/home-theater-tv-av-receiver-led-display-shelves-nashville.jpeg", alt: "Home theater media wall with a mounted TV, AV receiver and LED-lit floating shelves, Nashville TN" },
  { src: "/images/tvs/outdoor-tv-mount-covered-patio-fireplace-nashville.jpeg",        alt: "Outdoor TV mounted above a painted brick fireplace on a covered patio, Nashville TN" },
]

export default function GallerySection() {
  const [open, setOpen] = useState(null)
  const triggers = useRef([])
  const closeRef = useRef(null)
  const last = useRef(null)

  const close = useCallback(() => {
    setOpen(null)
    // Back to the photo the visitor opened.
    setTimeout(() => triggers.current[last.current]?.focus(), 0)
  }, [])
  const step = useCallback(d => setOpen(i => (i + d + PHOTOS.length) % PHOTOS.length), [])

  useEffect(() => {
    if (open === null) return
    closeRef.current?.focus()
    const onKey = e => {
      if (e.key === "Escape") close()
      else if (e.key === "ArrowRight") step(1)
      else if (e.key === "ArrowLeft") step(-1)
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow }
  }, [open, close, step])

  return (
    <Section id="our-work" labelledBy="work-title">
      <SectionHeader id="work-title" eyebrow="Our work" title="Real installations in Nashville homes"
        sub="Every mount clean, level and built to last. These are our own photos from recent jobs." />

      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {PHOTOS.map((p, i) => (
          <li key={p.src} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button
              ref={el => (triggers.current[i] = el)}
              type="button"
              onClick={() => { last.current = i; setOpen(i) }}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100"
            >
              <Image src={p.src} alt={p.alt} fill sizes={i === 0 ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 50vw, 25vw"}
                className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
              <span className="sr-only">— view larger</span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={`Photo ${open + 1} of ${PHOTOS.length}`}
          className="fixed inset-0 z-[70] flex flex-col bg-black/95 p-3 sm:p-6"
          onClick={e => { if (e.target === e.currentTarget) close() }}>
          <div className="flex items-center justify-between gap-3 text-white">
            <p className="text-sm font-semibold" aria-live="polite">{open + 1} / {PHOTOS.length}</p>
            <button ref={closeRef} type="button" onClick={close} aria-label="Close photo"
              className="flex size-12 items-center justify-center rounded-full bg-white/15 text-2xl hover:bg-white/30">✕</button>
          </div>
          <div className="relative min-h-0 flex-1" onClick={e => { if (e.target === e.currentTarget) close() }}>
            <Image src={PHOTOS[open].src} alt={PHOTOS[open].alt} fill sizes="95vw" className="object-contain" priority />
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/85">{PHOTOS[open].alt}</p>
          <div className="mt-3 flex justify-center gap-3">
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo"
              className="flex size-12 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/30">‹</button>
            <button type="button" onClick={() => step(1)} aria-label="Next photo"
              className="flex size-12 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/30">›</button>
          </div>
        </div>
      )}
    </Section>
  )
}
