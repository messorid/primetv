"use client"
import { useState, useEffect } from "react"

export default function InstallersPage() {
  const [installers, setInstallers] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [form,       setForm]       = useState({ name: "", email: "", phone: "" })
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState("")

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res  = await fetch("/api/installers")
    const data = await res.json()
    if (data.ok) setInstallers(data.installers)
    setLoading(false)
  }

  async function add(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) { setError("Name and email are required"); return }
    setSaving(true); setError("")
    const res  = await fetch("/api/installers", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    })
    const data = await res.json()
    if (data.ok) {
      setInstallers(prev => [...prev, data.installer])
      setForm({ name: "", email: "", phone: "" })
    } else {
      setError("Error saving installer")
    }
    setSaving(false)
  }

  async function remove(id) {
    if (!confirm("Remove this installer?")) return
    setInstallers(prev => prev.filter(i => i.id !== id))
    await fetch(`/api/installers?id=${id}`, { method: "DELETE" })
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Installers</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your installation team</p>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Add Installer</h2>
        <form onSubmit={add} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500">Full Name *</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="John Smith"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Phone</label>
              <input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="(615) 000-0000"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="installer@email.com"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#E50914] text-white text-sm font-bold py-2.5 hover:bg-red-700 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Add Installer"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Team ({installers.length})
          </h2>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-400 text-sm">Loading…</p>
        ) : installers.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">No installers yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {installers.map(inst => (
              <li key={inst.id} className="px-6 py-4">
                <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E50914]/10 flex items-center justify-center flex-none">
                  <span className="text-[#E50914] font-bold text-sm">
                    {inst.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{inst.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {inst.email}{inst.phone ? ` · ${inst.phone}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => remove(inst.id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition font-medium"
                >
                  Remove
                </button>
                </div>
                <CrewPageLink installer={inst} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// The installer's own jobs page: open it, copy or share the link, email it to
// them, or replace it if it ever ends up with the wrong person.
function CrewPageLink({ installer }) {
  const [info, setInfo] = useState(null)
  const [busy, setBusy] = useState("")
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")

  async function load() {
    setErr("")
    try {
      const d = await fetch(`/api/installers/portal?id=${installer.id}`).then(r => r.json())
      if (d.ok) setInfo(d); else setErr(d.error || "Could not load the link.")
    } catch { setErr("No connection.") }
  }
  const say = m => { setMsg(m); setTimeout(() => setMsg(""), 4000) }

  async function post(action) {
    if (action === "rotate" && !confirm(`Make a new link for ${installer.name}? The current link will stop working.`)) return
    setBusy(action); setErr("")
    try {
      const d = await fetch("/api/installers/portal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: installer.id, action }),
      }).then(r => r.json())
      if (!d.ok) setErr(d.error || "Could not do that.")
      else if (action === "email") say(`✓ Sent to ${d.sentTo}`)
      else { setInfo(d); say("✓ New link made — the old one no longer works") }
    } catch { setErr("No connection.") } finally { setBusy("") }
  }

  async function copy() {
    try {
      if (navigator.share) await navigator.share({ title: `${installer.name} — jobs`, url: info.url })
      else { await navigator.clipboard.writeText(info.url); say("✓ Link copied") }
    } catch { /* share sheet closed */ }
  }

  if (!info) {
    return (
      <div className="mt-2 pl-14">
        <button onClick={load} className="text-xs font-semibold text-blue-600 hover:underline">📋 Jobs page link</button>
        {err && <p className="mt-1 text-[11px] text-red-500">{err}</p>}
      </div>
    )
  }
  return (
    <div className="mt-3 ml-14 rounded-xl border border-gray-200 bg-gray-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">📋 Jobs page</p>
      <div className="flex flex-wrap gap-1.5">
        <a href={info.path} target="_blank" rel="noreferrer" className={linkBtn}>Open ↗</a>
        <button onClick={copy} className={linkBtn}>{typeof navigator !== "undefined" && navigator.share ? "Share link" : "Copy link"}</button>
        <button onClick={() => post("email")} disabled={!!busy || !installer.email} className={linkBtn}>
          {busy === "email" ? "Sending…" : "✉️ Email to installer"}
        </button>
        <button onClick={() => post("rotate")} disabled={!!busy} className={`${linkBtn} text-gray-400`}>
          {busy === "rotate" ? "…" : "New link"}
        </button>
      </div>
      {msg && <p role="status" className="mt-2 text-[11px] font-semibold text-emerald-600">{msg}</p>}
      {err && <p role="alert" className="mt-2 text-[11px] text-red-500">{err}</p>}
    </div>
  )
}

const linkBtn = "rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition disabled:opacity-40"
