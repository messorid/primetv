"use client"

import { useEffect, useId, useRef } from "react"

export default function AdminDialog({ title, onClose, children, busy = false, className = "max-w-lg" }) {
  const dialog = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const element = dialog.current
    const trigger = document.activeElement
    element.showModal()
    return () => {
      element.close()
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog ref={dialog} aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); if (!busy) onClose() }}
      onClick={event => { if (!busy && event.target === event.currentTarget) onClose() }}
      className={`fixed inset-x-0 bottom-0 top-auto mx-auto mb-0 max-h-[95dvh] w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-white shadow-2xl backdrop:bg-black/50 sm:inset-0 sm:m-auto sm:max-h-[90dvh] sm:rounded-2xl ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3 sm:px-6">
        <h2 id={titleId} className="text-lg font-extrabold text-gray-900">{title}</h2>
        <button type="button" onClick={onClose} disabled={busy} aria-label="Close"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-2xl text-gray-700 hover:bg-gray-100 disabled:opacity-40">×</button>
      </div>
      {children}
    </dialog>
  )
}
