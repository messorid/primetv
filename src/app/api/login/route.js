import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import { connectToDatabase } from '@/lib/mongodb'
import { ADMIN_COOKIE, createSessionToken, sessionCookieOptions } from '@/lib/adminSession'


export async function POST(req) {
  try {
    const { email, password } = await req.json()

    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 })
    }

    // Setear cookie segura (1 día) — token firmado, no un valor adivinable
    const token = await createSessionToken()
    if (!token) {
      return NextResponse.json({ success: false, error: 'Servidor sin configurar' }, { status: 500 })
    }

    const response = NextResponse.json({ success: true, message: 'Login exitoso' })
    response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions())

    return response
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
