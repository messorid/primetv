// Admin session tokens.
//
// The previous scheme set `admin-auth=true` from client JavaScript and the
// middleware only checked that the cookie existed, so anyone could type that
// cookie into a browser console and reach every customer record and financial
// figure in the admin panel. Tokens are now HMAC-signed server-side and carry
// their own expiry, so a browser cannot mint one.
//
// Each token also carries a role:
//   admin   the owner (ADMIN_EMAIL / ADMIN_PASSWORD) — everything
//   seller  a salesperson from the staff_users table — bookings, leads and
//           messages, but no money, no pay settings, nothing deleted
// A token from before roles existed ("expiry.signature") is an admin token.
//
// Web Crypto is used rather than node:crypto so the same helpers run both in
// Edge middleware and in Node route handlers.

export const ADMIN_COOKIE = "admin-auth"

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000 // 1 day, matching the previous session length
export const ROLES = ["admin", "seller"]

// Admin pages a seller can't open; the middleware sends them to Today.
export const OWNER_ONLY_PAGES = ["/admin/earnings", "/admin/insights", "/admin/reporte", "/admin/installers", "/admin/team"]

// ADMIN_PASSWORD is the fallback so this works with the environment that is
// already deployed. Set ADMIN_SESSION_SECRET to rotate sessions independently
// of the password.
function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ""
}

function toBase64Url(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function sign(message) {
  const secret = getSecret()
  if (!secret) return null
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(message)))
}

function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// `uid` is the staff user's id (empty for the owner). Neither field may
// contain a dot, which separates the parts of the token.
export async function createSessionToken({ role = "admin", uid = "" } = {}, ttlMs = DEFAULT_TTL_MS) {
  if (!ROLES.includes(role) || /\./.test(String(uid))) return null
  const payload = `${Date.now() + ttlMs}.${role}.${uid}`
  const signature = await sign(payload)
  return signature ? `${payload}.${signature}` : null
}

// The session a token stands for — { role, uid, expiresAt } — or null.
export async function verifySessionToken(token) {
  if (typeof token !== "string") return null
  const parts = token.split(".")
  let payload, signature, role = "admin", uid = ""
  if (parts.length === 2) {
    [payload, signature] = parts // a token from before roles: the owner
  } else if (parts.length === 4) {
    payload = parts.slice(0, 3).join(".")
    role = parts[1]
    uid = parts[2]
    signature = parts[3]
  } else {
    return null
  }
  if (!ROLES.includes(role)) return null

  const expiresAt = Number(parts[0])
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null

  const expected = await sign(payload)
  if (expected === null || !constantTimeEqual(signature, expected)) return null
  return { role, uid, expiresAt }
}

export async function getSession(request) {
  return verifySessionToken(request?.cookies?.get(ADMIN_COOKIE)?.value)
}

// The owner only: money, pay settings, team, deleting.
export async function isAdminRequest(request) {
  return (await getSession(request))?.role === "admin"
}

// Anyone signed in to the admin: the owner or a seller.
export async function isStaffRequest(request) {
  return !!(await getSession(request))
}

export const isOwnerOnlyPage = path => OWNER_ONLY_PAGES.some(p => path === p || path.startsWith(`${p}/`))

export function sessionCookieOptions(ttlMs = DEFAULT_TTL_MS) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(ttlMs / 1000),
  }
}

export function unauthorized() {
  return Response.json(
    { ok: false, success: false, error: "Unauthorized" },
    { status: 401 },
  )
}

// Signed in, but this is the owner's to do.
export function forbidden(what = "This") {
  return Response.json(
    { ok: false, success: false, error: `${what} is only available to the owner.` },
    { status: 403 },
  )
}
