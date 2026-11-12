"use client"
// Folds a secondary block on phones behind a "Show…" button, to keep the
// homepage short where it is read by scrolling. From tablet width up it is
// always open. The content stays in the page either way, so links inside it
// are still there for search engines.
import { useId, useState } from "react"

export default function MobileCollapse({ label, className = "", children }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(o => !o)}
        className="flex min-h-[52px] w-full items-center justify-between gap-4 rounded-2xl border-2 border-zinc-300 bg-white px-5 text-left text-base font-bold text-ink hover:border-ink md:hidden"
      >
        {open ? label.replace(/^Show/, "Hide") : label}
        <span aria-hidden="true" className={`text-xl text-muted transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div id={id} className={`${open ? "block" : "hidden"} md:block`}>{children}</div>
    </div>
  )
}
