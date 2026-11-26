"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { forgetMe } from "../useMe"

export default function LoginPage() {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res  = await fetch("/api/admin-login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.ok) {
        // The session cookie is set by the server (httpOnly + signed). This flag
        // only drives the sidebar UI; it grants no access on its own.
        localStorage.setItem("admin-auth", "true")
        forgetMe() // whoever was signed in before on this tab
        router.push("/admin/today")
      } else {
        setError("Email or password incorrect")
      }
    } catch {
      setError("Connection error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111] p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">
            <span className="text-brand-bright">Prime</span>TV
          </h1>
          <p className="mt-1 text-sm text-white/70">Admin Console</p>
        </div>

        <form onSubmit={handleSubmit} aria-busy={loading}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-4">

          <div>
            <label htmlFor="admin-email" className="text-sm font-semibold text-gray-700">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="text-sm font-semibold text-gray-700">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#E50914] text-white font-bold py-3 text-sm hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

      </div>
    </main>
  )
}
