// Single source of truth for the pricing disclaimer. Every price shown on the
// public site is an estimate — the final figure is confirmed by a sales rep —
// so the wording lives here rather than being retyped on each page.

const TEXT =
  "All prices shown are approximate estimates and may vary depending on your TV, " +
  "wall type, and installation conditions. Final pricing is confirmed by one of " +
  "our sales representatives before any work begins."

export default function PriceDisclaimer({ variant = "light", className = "" }) {
  const isDark = variant === "dark"

  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        isDark
          ? "border-white/15 bg-white/5"
          : "border-amber-200 bg-amber-50"
      } ${className}`}
    >
      <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-amber-900"}`}>
        <span className="font-bold">Please note:</span> {TEXT}
      </p>
    </div>
  )
}

// Compact inline version for tight spots like forms and small cards.
export function PriceDisclaimerLine({ className = "" }) {
  return (
    <p className={`text-[11px] leading-relaxed text-black/50 ${className}`}>
      Prices are approximate and may vary. Final pricing is confirmed by our sales team.
    </p>
  )
}
