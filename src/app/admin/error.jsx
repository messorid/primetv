"use client"

import { useEffect, useState } from "react"

// A tab left open across a deploy is the usual way the admin breaks: Vercel
// replaces the JS chunks, the old ones 404, and Next shows a bare
// "client-side exception" with nothing to act on. That is recoverable — the
// page just needs the new build — so recover from it instead of reporting it.
const STALE_BUILD = /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i

const RELOAD_GUARD = "admin-stale-reload"

export default function AdminError({ error, reset }) {
  const [reloading, setReloading] = useState(false)

  const isStaleBuild = STALE_BUILD.test(`${error?.name || ""} ${error?.message || ""}`)

  useEffect(() => {
    if (!isStaleBuild) return
    // Guarded so a genuinely broken build cannot put the page in a reload loop.
    // The guard is cleared by the layout once a page renders successfully.
    try {
      if (sessionStorage.getItem(RELOAD_GUARD)) return
      sessionStorage.setItem(RELOAD_GUARD, "1")
    } catch {
      return
    }
    setReloading(true)
    window.location.reload()
  }, [isStaleBuild])

  function hardReload() {
    try { sessionStorage.removeItem(RELOAD_GUARD) } catch {}
    window.location.reload()
  }

  if (reloading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <p className="text-sm text-gray-500">Updating to the latest version…</p>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm text-center">
        <div className="text-4xl mb-3">{isStaleBuild ? "🔄" : "⚠️"}</div>

        <h1 className="text-lg font-extrabold text-gray-900">
          {isStaleBuild ? "This page is out of date" : "Something went wrong"}
        </h1>

        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          {isStaleBuild
            ? "The site was updated while this tab was open. Reloading will pick up the new version — nothing was lost."
            : "The admin panel hit an unexpected error. Your data is safe; reloading usually clears it."}
        </p>

        {!isStaleBuild && error?.message && (
          <p className="mt-3 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-[11px] font-mono text-gray-500 break-words text-left">
            {error.message}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={hardReload}
            className="flex-1 rounded-xl bg-[#E50914] text-white text-sm font-bold py-2.5 hover:bg-red-700 transition"
          >
            Reload
          </button>
          <button
            onClick={() => reset()}
            className="rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2.5 hover:bg-gray-50 transition"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}
