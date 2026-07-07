export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { connectToDatabase } from "@/lib/mongodb"
import Booking from "@/models/Booking"

export async function GET() {
  try {
    await connectToDatabase()
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean()
    return Response.json({ ok: true, bookings })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { id, status, notes } = await request.json()
    await connectToDatabase()
    const update = {}
    if (status !== undefined) update.status = status
    if (notes  !== undefined) update.notes  = notes
    await Booking.findByIdAndUpdate(id, update)
    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    await connectToDatabase()
    await Booking.findByIdAndDelete(id)
    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false }, { status: 500 })
  }
}
