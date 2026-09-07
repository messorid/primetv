// Single source of truth for the pricing disclaimer. Every price on the public
// site is a starting price — the final figure depends on the job and is set by
// a sales rep — so the wording lives here rather than being retyped per page.

export const PRICE_FACTORS = [
  "The difficulty of the installation",
  "The wall type and surface",
  "The mount or bracket being installed",
]

export default function PriceDisclaimer({ variant = "light", className = "" }) {
  const isDark = variant === "dark"

  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        isDark ? "border-white/15 bg-white/5" : "border-amber-200 bg-amber-50"
      } ${className}`}
    >
      <p className={`text-xs leading-relaxed ${isDark ? "text-white/70" : "text-amber-900"}`}>
        <span className="font-bold">Prices start from the amounts shown.</span>{" "}
        Your final price depends on the difficulty of the installation, the wall type, and the
        mount or bracket being installed.{" "}
        <span className="font-semibold">
          Pull-down mantel mounts (MantelMount and similar) are priced separately.
        </span>{" "}
        One of our sales representatives confirms your exact price before any work begins.
      </p>
    </div>
  )
}

// Compact inline version for tight spots like forms and small cards.
export function PriceDisclaimerLine({ className = "" }) {
  return (
    <p className={`text-[11px] leading-relaxed text-black/50 ${className}`}>
      Starting price. Final cost depends on installation difficulty, wall type and the mount used —
      mantel mounts are priced separately. Confirmed by our sales team.
    </p>
  )
}
