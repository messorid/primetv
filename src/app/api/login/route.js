import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import connectToDatabase from '@/lib/mongodb'

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

    // Setear cookie segura (1 día)
    const response = NextResponse.json({ success: true, message: 'Login exitoso' })
    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 día
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return response
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
