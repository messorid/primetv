// Photos live in their own table so the main bookings query never has to carry
// megabytes of base64 it does not need. Shared with the installer email builder
// in ../route.js, which reads photos directly rather than over HTTP.

export const MAX_PHOTOS_PER_BOOKING = 12

// Images are resized and re-encoded in the browser before upload; this is the
// backstop for anything that still arrives oversized. ~3M chars of base64 is
// roughly 2.2 MB of decoded image.
export const MAX_DATA_URL_CHARS = 3_000_000

export async function ensurePhotoTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS booking_photos (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID NOT NULL,
      filename   TEXT,
      mime       TEXT,
      data_url   TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS booking_photos_booking_id_idx ON booking_photos (booking_id)`
}

// Turns a stored data URL into a nodemailer attachment with a stable cid so the
// same image can also be rendered inline in the email body.
export function photoToAttachment(photo, index) {
  const match = /^data:([^;]+);base64,(.*)$/s.exec(photo.dataUrl || photo.data_url || "")
  if (!match) return null
  const [, mime, b64] = match
  const ext = mime.split("/")[1] || "jpg"
  return {
    filename: photo.filename || `job-photo-${index + 1}.${ext}`,
    content: Buffer.from(b64, "base64"),
    contentType: mime,
    cid: `jobphoto${index}@primetv`,
  }
}
