export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { ADMIN_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/adminSession"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const validEmail    = process.env.ADMIN_EMAIL
    const validPassword = process.env.ADMIN_PASSWORD

    if (!validEmail || !validPassword) {
      return Response.json({ ok: false, error: "Server not configured" }, { status: 500 })
    }

    if (email !== validEmail || password !== validPassword) {
      return Response.json({ ok: false, error: "Invalid credentials" }, { status: 401 })
    }

    // The session cookie is issued here, httpOnly and signed, so it cannot be
    // forged from the browser the way the old client-set cookie could.
    const token = await createSessionToken()
    if (!token) {
      return Response.json({ ok: false, error: "Server not configured" }, { status: 500 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions())
    return response
  } catch {
    return Response.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}
