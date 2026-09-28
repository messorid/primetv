import mongoose from 'mongoose'

// Legacy. Nothing the site serves today runs on Mongo — leads, bookings,
// installers, earnings and photos all live in Postgres. Only the unused
// /api/login route still imports this.
//
// The missing-URI check used to throw while this module was being imported,
// which broke `next build` on any machine without MONGODB_URI set. It now
// throws when a caller actually tries to connect, so a dead legacy route can
// no longer take the whole build down with it.
const MONGODB_URI = process.env.MONGODB_URI

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('❌ MONGODB_URI no está definido en el archivo .env')
  }

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
