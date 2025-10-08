// app/book/JotformEmbed.jsx
"use client"

import { useEffect, useRef, useState } from "react"

const FORM_ID = "241416092525048"
const FORM_URL = `https://form.jotform.com/${FORM_ID}`

export default function JotformEmbed() {
  const iframeRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    function onMessage(e) {
      try {
        const url = new URL(e.origin)
        const isJotform = /(^|\.)jotform\.(com|io)$/.test(url.hostname)
        if (!isJotform) return
      } catch { return }

      if (typeof e.data !== "string") return

      // Mensajes tipicos de Jotform para resize y scroll
      if (e.data.indexOf("setHeight") > -1) {
        const parts = e.data.split(":")
        const h = parseInt(parts[1], 10)
        if (Number.isFinite(h) && iframeRef.current) {
          iframeRef.current.style.height = h + "px"
        }
      }
      if (e.data.indexOf("scrollIntoView") > -1) {
        iframeRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold">Book your installation</h1>
        <p className="mt-2 text-black/70">Secure form powered by Jotform</p>
      </header>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
        <iframe
          id={`JotFormIFrame-${FORM_ID}`}
          ref={iframeRef}
          title="PrimeTv Nashville booking"
          src={FORM_URL}
          frameBorder="0"
          scrolling="no"
          className="w-full"
          // altura inicial grande por si el postMessage tarda
          style={{ height: "1200px" }}
          onLoad={() => setLoaded(true)}
          allow="geolocation; microphone; camera; autoplay; encrypted-media"
        />
      </div>

      {!loaded && (
        <p className="mt-3 text-sm text-black/60">Loading form...</p>
      )}

      <p className="mt-6 text-xs text-black/60">
        If the form does not load, open it in a new tab
        {" "}
        <a
          href={FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[#E50914]"
        >
          Open form
        </a>
      </p>
    </div>
  )
}
