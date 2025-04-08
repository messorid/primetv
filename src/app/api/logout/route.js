import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada' })
  response.cookies.set('admin-auth', '', { maxAge: 0, path: '/' })
  return response
}
