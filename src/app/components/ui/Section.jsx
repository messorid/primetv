// The building blocks every homepage section is made of, so the page reads as
// one design: the same widths, spacing, heading sizes and buttons throughout.
//
// Text colours never go lighter than `text-muted` (#52525B, 7.8:1 on white),
// and red text on dark backgrounds uses `brand-bright` — see globals.css.
import Link from "next/link"

const TONES = {
  white: "bg-white text-ink",
  soft:  "bg-soft text-ink",
  dark:  "bg-ink text-white",
}

export function Section({ id, tone = "white", className = "", inner = "", labelledBy, children }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`w-full ${TONES[tone]} ${className}`}>
      <div className={`mx-auto max-w-6xl px-4 sm:px-6 py-14 md:py-20 ${inner}`}>{children}</div>
    </section>
  )
}

export function SectionHeader({ id, eyebrow, title, sub, align = "left", tone = "light", className = "" }) {
  const dark = tone === "dark"
  const center = align === "center"
  return (
    <header className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <p className={`text-sm font-bold uppercase tracking-[0.14em] ${dark ? "text-brand-bright" : "text-brand-dark"}`}>
          {eyebrow}
        </p>
      )}
      <h2 id={id} className={`mt-2 text-[1.85rem] leading-tight sm:text-4xl font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {sub && (
        <p className={`mt-3 text-base sm:text-lg leading-relaxed ${dark ? "text-white/80" : "text-body"}`}>{sub}</p>
      )}
    </header>
  )
}

const BUTTONS = {
  primary:   "bg-brand text-white hover:bg-brand-dark shadow-lg shadow-red-600/20",
  secondary: "bg-white text-ink border-2 border-zinc-300 hover:border-ink",
  dark:      "bg-white text-ink hover:bg-zinc-100",
  outlineDark: "border-2 border-white/40 text-white hover:border-white hover:bg-white/10",
}

// Buttons are at least 48px tall and say what happens ("Book installation",
// not "Submit"). Focus rings come from globals.css.
export function ButtonLink({ href, variant = "primary", size = "md", className = "", children, ...rest }) {
  const sizes = { md: "min-h-[52px] px-7 text-base", sm: "min-h-[44px] px-5 text-sm" }
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors ${sizes[size]} ${BUTTONS[variant]} ${className}`
  if (/^(tel|sms|mailto):|^https?:/.test(href)) return <a href={href} className={cls} {...rest}>{children}</a>
  return <Link href={href} className={cls} {...rest}>{children}</Link>
}

// The phone number as a real link, everywhere it appears.
export const PHONE_DISPLAY = "(615) 669-0251"
export const PHONE_TEL = "tel:+16156690251"
export const PHONE_SMS = "sms:+16156690251"

export function Check({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={`size-5 flex-none ${className}`}>
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
    </svg>
  )
}
