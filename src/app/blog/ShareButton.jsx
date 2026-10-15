"use client"
// Share a post: the phone's own share sheet where there is one, otherwise
// WhatsApp and copy-link. Each use is counted in GA4.
import { useEffect, useState } from "react"

const track = method => { if (typeof window !== "undefined" && window.gtag) window.gtag("event", "share", { method, content_type: "blog_post" }) }

export default function ShareButton({ title, url }) {
  const [copied, setCopied] = useState(false)
  // Decided after hydration: the server cannot know whether the phone has a
  // share sheet, and guessing differently from the browser breaks hydration.
  const [canShare, setCanShare] = useState(false)
  useEffect(() => { setCanShare(!!navigator.share) }, [])

  async function share() {
    try { await navigator.share({ title, url }); track("native") } catch { /* closed */ }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); track("copy"); setTimeout(() => setCopied(false), 3000) } catch { window.prompt("Copy this link:", url) }
  }

  const btn = "inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-zinc-300 px-4 text-sm font-bold text-ink hover:border-ink"
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-muted">Share this guide:</span>
      {canShare ? (
        <button type="button" onClick={share} className={btn}>Share</button>
      ) : (
        <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer"
          onClick={() => track("whatsapp")} className={btn}>WhatsApp</a>
      )}
      <button type="button" onClick={copy} className={btn} aria-live="polite">{copied ? "✓ Link copied" : "Copy link"}</button>
    </div>
  )
}
