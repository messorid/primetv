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
              <li key={inst.id} className="flex items-center gap-4 px-6 py-4">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
