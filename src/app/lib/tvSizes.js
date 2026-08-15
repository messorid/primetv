// ─────────────────────────────────────────────────────────────────────────────
// TV SIZES — single source of truth for every size picker in the booking form.
// Keeping this one list everywhere (standard TVs + custom quote) means the
// "size" value is always one of these exact strings, so it can be aggregated
// for metrics (Admin → Reporte) instead of free text.
// ─────────────────────────────────────────────────────────────────────────────

export const TV_SIZES = [24, 32, 40, 43, 50, 55, 58, 60, 65, 70, 75, 77, 82, 85, 86, 98]

export function priceHintForSize(size) {
  const n = parseInt(size)
  if (!n) return ""
  if (n <= 55) return "$110"
  if (n <= 70) return "$150"
  return "Ask price"
}
