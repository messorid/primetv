// US phone numbers as the office types them: digits only, at most ten, shown as
// (615) 555-0100 while typing. No US area code starts with 1, so a leading 1 is
// the country code and is dropped: +1 615 555 0100 still fits.

export function usPhoneDigits(value) {
  return String(value ?? "").replace(/\D/g, "").replace(/^1/, "").slice(0, 10)
}

// Formats as far as the digits go, so deleting never gets stuck on a ") " or "-".
export function formatUsPhone(value) {
  const d = usPhoneDigits(value)
  if (d.length <= 3) return d.length ? `(${d}` : ""
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export const isUsPhone = value => usPhoneDigits(value).length === 10
