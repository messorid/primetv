"use client"

import { useState } from "react"
import Image from "next/image"

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

  function prev() { setOpen(i => (i - 1 + PHOTOS.length) % PHOTOS.length) }
  function next() { setOpen(i => (i + 1) % PHOTOS.length) }

  return (
    <section className="w-full bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#E50914] mb-2">
            Our Work
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-black">
            Real Installations, Real Results
          </h2>
          <p className="mt-2 text-black/50 text-sm max-w-md mx-auto">
            Every mount is clean, level, and built to last. See what we&apos;ve done for our Nashville customers.
          </p>
        </div>

        {/* Grid: first photo spans 2 rows on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PHOTOS.map((photo, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              className={`relative overflow-hidden rounded-2xl bg-gray-100 group cursor-zoom-in ${
                i === 0 ? "col-span-2 md:col-span-1 row-span-1 md:row-span-2" : ""
              }`}
              style={{ aspectRatio: i === 0 ? "4/3" : "4/3" }}
              aria-label={`View photo ${i + 1}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                >
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative w-full max-w-3xl"
            style={{ maxHeight: "85vh", aspectRatio: "4/3" }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={PHOTOS[open].src}
              alt={PHOTOS[open].alt}
              fill
              sizes="90vw"
              className="object-contain rounded-xl"
              priority
            />
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white text-lg flex items-center justify-center transition"
          >
            ✕
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-3 md:left-8 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white text-2xl font-bold flex items-center justify-center transition"
          >
            ‹
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-3 md:right-8 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white text-2xl font-bold flex items-center justify-center transition"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={e => { e.stopPropagation(); setOpen(i) }}
                className={`rounded-full transition-all ${
                  i === open ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
