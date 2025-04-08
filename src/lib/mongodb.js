// src/lib/mongodb.js
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Falta definir MONGODB_URI en .env.local')
}

let cached = global.mongoose || { conn: null, promise: null }

export async function connectToDatabase() {
  if (cached.conn) return cached.conn

  cached.promise ||= mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  })

  cached.conn = await cached.promise
  return cached.conn
}
