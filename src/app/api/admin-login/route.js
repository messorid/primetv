export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const validEmail    = process.env.ADMIN_EMAIL
    const validPassword = process.env.ADMIN_PASSWORD

    if (!validEmail || !validPassword) {
      return Response.json({ ok: false, error: "Server not configured" }, { status: 500 })
    }

    if (email === validEmail && password === validPassword) {
      return Response.json({ ok: true })
    }

    return Response.json({ ok: false, error: "Invalid credentials" }, { status: 401 })
  } catch {
    return Response.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}
