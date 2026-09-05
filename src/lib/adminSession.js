// Admin session tokens.
//
// The previous scheme set `admin-auth=true` from client JavaScript and the
// middleware only checked that the cookie existed, so anyone could type that
// cookie into a browser console and reach every customer record and financial
// figure in the admin panel. Tokens are now HMAC-signed server-side and carry
// their own expiry, so a browser cannot mint one.
//
// Web Crypto is used rather than node:crypto so the same helpers run both in
// Edge middleware and in Node route handlers.

export const ADMIN_COOKIE = "admin-auth"

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000 // 1 day, matching the previous session length

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

export async function createSessionToken(ttlMs = DEFAULT_TTL_MS) {
  const expiresAt = String(Date.now() + ttlMs)
  const signature = await sign(expiresAt)
  return signature ? `${expiresAt}.${signature}` : null
}

export async function verifySessionToken(token) {
  if (typeof token !== "string") return false
  const dot = token.indexOf(".")
  if (dot < 1) return false

  const expiresAt = token.slice(0, dot)
  const signature = token.slice(dot + 1)

  const expiresMs = Number(expiresAt)
  if (!Number.isFinite(expiresMs) || Date.now() > expiresMs) return false

  const expected = await sign(expiresAt)
  return expected !== null && constantTimeEqual(signature, expected)
}

export async function isAdminRequest(request) {
  return verifySessionToken(request?.cookies?.get(ADMIN_COOKIE)?.value)
}

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
