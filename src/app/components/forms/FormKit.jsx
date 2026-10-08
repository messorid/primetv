"use client"

// ─────────────────────────────────────────────────────────────────────────────
// FORM KIT — the fields every public form is built from.
//
// What each piece guarantees, because the old forms got every one of these
// wrong in at least one place:
//
//   • The <label> is connected to its control (htmlFor/id), so tapping the
//     label focuses the field and a screen reader announces what it is for.
//   • Text is 16px. iOS Safari zooms the whole page into any input smaller
//     than that, and leaves it zoomed — the single most "visually
//     uncomfortable" thing about the old forms on a phone.
//   • Controls are at least 48px tall, so they are easy to hit with a thumb.
//   • Hints and errors are tied to the field with aria-describedby, and an
//     invalid field says so with aria-invalid, so the reason is read out with
//     the field rather than floating somewhere on the page.
//   • Each field asks the phone for the right keyboard (inputMode) and lets
//     the browser autofill it (autoComplete).
//   • Choices are real radio buttons under the styling, so arrow keys, Tab and
//     screen readers all work the way people expect.
// ─────────────────────────────────────────────────────────────────────────────

import { forwardRef, useEffect, useRef } from "react"
import {
  formatUSPhone, US_PHONE_MAX_LENGTH, cleanZip, suggestEmail,
} from "../../lib/formValidation"

const BASE =
  "block w-full min-h-[48px] rounded-xl border bg-white px-4 py-3 text-base text-black " +
  "placeholder:text-black/35 transition-colors focus:outline-none focus:ring-4 " +
  "disabled:bg-gray-50 disabled:text-black/40"
const OK = "border-black/20 focus:border-[#E50914] focus:ring-[#E50914]/15"
const BAD = "border-red-500 bg-red-50/40 focus:border-red-500 focus:ring-red-500/15"

const inputClass = error => `${BASE} ${error ? BAD : OK}`

// ── Shared frame: label, hint, error ────────────────────────────────────────

function describedBy(id, hint, error) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined
}

export function FieldFrame({ id, label, required, optional, hint, error, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-black/85 mb-1.5">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-[#E50914]"> *</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
        {optional && <span className="font-normal text-black/45"> (optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] leading-snug text-black/55">{hint}</p>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}

function FieldError({ id, children }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium leading-snug text-red-600">
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-px size-4 flex-none">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 102 0V7a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
      <span>{children}</span>
    </p>
  )
}

// ── Text ────────────────────────────────────────────────────────────────────

export const TextField = forwardRef(function TextField(
  { id, label, value, onChange, onBlur, required, optional, hint, error,
    type = "text", autoComplete, inputMode, placeholder, maxLength,
    autoCapitalize, spellCheck, enterKeyHint, className, ...rest },
  ref,
) {
  return (
    <FieldFrame id={id} label={label} required={required} optional={optional}
      hint={hint} error={error} className={className}>
      <input
        ref={ref}
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        enterKeyHint={enterKeyHint}
        className={inputClass(error)}
        {...rest}
      />
    </FieldFrame>
  )
})

// A US phone number, formatted as it is typed and capped at ten digits. The
// keypad opens instead of the full keyboard.
export function PhoneField({ hint = "10-digit US number, for updates about your request.", ...props }) {
  return (
    <TextField
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      placeholder="(615) 555-0123"
      maxLength={US_PHONE_MAX_LENGTH}
      hint={hint}
      {...props}
      onChange={v => props.onChange(formatUSPhone(v))}
    />
  )
}

// Email, with the phone's email keyboard and no auto-capitalising, plus a
// one-tap fix when the domain looks misspelled ("gmial.com").
export function EmailField({ hint = "So we can reach you about your request.", ...props }) {
  const suggestion = suggestEmail(props.value)
  return (
    <div className={props.className}>
      <TextField
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="name@example.com"
        hint={hint}
        {...props}
        className={undefined}
      />
      {suggestion && (
        <button
          type="button"
          onClick={() => props.onChange(suggestion)}
          className="mt-1.5 text-[13px] text-black/70 underline decoration-dotted underline-offset-2 hover:text-[#E50914]"
        >
          Did you mean <strong className="font-semibold">{suggestion}</strong>?
        </button>
      )}
    </div>
  )
}

// Five digits, numeric keypad, nothing else accepted.
export function ZipField({ hint = "5 digits, like 37209.", ...props }) {
  return (
    <TextField
      inputMode="numeric"
      autoComplete="postal-code"
      placeholder="37209"
      maxLength={5}
      pattern="[0-9]*"
      hint={hint}
      {...props}
      onChange={v => props.onChange(cleanZip(v))}
    />
  )
}

export function TextAreaField({
  id, label, value, onChange, onBlur, required, optional, hint, error,
  placeholder, rows = 3, maxLength, className,
}) {
  return (
    <FieldFrame id={id} label={label} required={required} optional={optional}
      hint={hint} error={error} className={className}>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`${inputClass(error)} resize-y min-h-[96px] leading-relaxed`}
      />
      {maxLength && (
        <p className="mt-1 text-right text-[12px] text-black/40" aria-hidden="true">
          {String(value || "").length}/{maxLength}
        </p>
      )}
    </FieldFrame>
  )
}

// A native select. On a phone it opens the system picker, which is easier to
// use than any custom dropdown.
export function SelectField({
  id, label, value, onChange, onBlur, required, optional, hint, error,
  options, placeholder = "Select…", className,
}) {
  return (
    <FieldFrame id={id} label={label} required={required} optional={optional}
      hint={hint} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={`${inputClass(error)} appearance-none pr-11 ${value ? "" : "text-black/45"}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => {
            const opt = typeof o === "string" ? { value: o, label: o } : o
            return <option key={opt.value} value={opt.value} className="text-black">{opt.label}</option>
          })}
        </select>
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor"
          className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-black/45">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </FieldFrame>
  )
}

// ── Choices ─────────────────────────────────────────────────────────────────
//
// Big tappable cards with a real radio input underneath. The input is visually
// hidden but still focusable, so keyboard and screen reader users get native
// radio behaviour (Tab into the group, arrows to move, Space to pick).

export function ChoiceGroup({
  id, legend, value, onChange, options, required, hint, error,
  columns = 1, size = "md", className = "",
}) {
  const cols = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" }[columns]
  return (
    <fieldset
      id={id}
      className={className}
      aria-describedby={describedBy(id, hint, error)}
      aria-invalid={error ? true : undefined}
      tabIndex={-1}
    >
      <legend className="mb-2 text-sm font-semibold text-black/85">
        {legend}
        {required && (
          <>
            <span aria-hidden="true" className="text-[#E50914]"> *</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </legend>
      {hint && !error && <p id={`${id}-hint`} className="-mt-1 mb-2 text-[13px] text-black/55">{hint}</p>}

      <div className={`grid gap-2.5 ${cols}`}>
        {options.map(o => {
          const opt = typeof o === "string" ? { value: o, label: o } : o
          const checked = value === opt.value
          const inputId = `${id}-${String(opt.value).replace(/[^A-Za-z0-9_-]/g, "_")}`
          return (
            <label
              key={opt.value}
              htmlFor={inputId}
              className={`relative flex cursor-pointer items-center gap-3 rounded-xl border-2 transition-colors
                has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#E50914]/20
                ${size === "sm" ? "min-h-[48px] px-3.5 py-2.5" : "min-h-[56px] px-4 py-3"}
                ${checked
                  ? "border-[#E50914] bg-red-50 text-black"
                  : error
                  ? "border-red-300 bg-white hover:border-red-400"
                  : "border-black/12 bg-white hover:border-black/30"}`}
            >
              <input
                type="radio"
                id={inputId}
                name={id}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                required={required}
                className="sr-only"
              />
              {opt.emoji && <span aria-hidden="true" className="text-xl leading-none">{opt.emoji}</span>}
              <span className="min-w-0 flex-1">
                <span className={`block font-semibold leading-snug ${size === "sm" ? "text-sm" : "text-[15px]"}`}>{opt.label}</span>
                {opt.desc && <span className="mt-0.5 block text-[13px] leading-snug text-black/55">{opt.desc}</span>}
              </span>
              <span
                aria-hidden="true"
                className={`flex size-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
                  checked ? "border-[#E50914] bg-[#E50914]" : "border-black/25"
                }`}
              >
                {checked && <span className="size-2 rounded-full bg-white" />}
              </span>
            </label>
          )
        })}
      </div>

      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </fieldset>
  )
}

export function CheckboxField({ id, checked, onChange, children, error, required }) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition-colors
          has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#E50914]/20
          ${error ? "border-red-300 bg-red-50/40" : checked ? "border-[#E50914]/40 bg-red-50/40" : "border-black/10"}`}
      >
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 flex-none cursor-pointer accent-[#E50914]"
        />
        <span className="text-sm leading-snug text-black/75">{children}</span>
      </label>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}

// ── Feedback ────────────────────────────────────────────────────────────────

// Lists what still needs fixing, each item jumping to its field. Takes focus
// when it appears so a keyboard or screen reader user hears it immediately,
// instead of pressing a button that silently does nothing.
export function ErrorSummary({ errors, labels, onJump }) {
  const ref = useRef(null)
  const keys = Object.keys(errors || {})
  const signature = keys.join("|")

  useEffect(() => {
    if (!keys.length) return
    // Focus without the browser's own scroll, which parks the box at the very
    // top edge — under the site's fixed header — then centre it ourselves.
    ref.current?.focus({ preventScroll: true })
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    // Re-focus only when the set of problems changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  if (!keys.length) return null
  // Focus alone gets it read out. Adding role="alert" as well makes most
  // screen readers announce the same list twice.
  return (
    <div
      ref={ref}
      tabIndex={-1}
      aria-labelledby="form-error-summary-title"
      className="rounded-xl border-2 border-red-200 bg-red-50 p-4 focus:outline-none focus:ring-4 focus:ring-red-500/15"
    >
      <p id="form-error-summary-title" className="text-sm font-bold text-red-700">
        {keys.length === 1 ? "One thing to fix before continuing:" : `${keys.length} things to fix before continuing:`}
      </p>
      <ul className="mt-2 space-y-1">
        {keys.map(k => (
          <li key={k}>
            <button
              type="button"
              onClick={() => onJump(k)}
              className="text-left text-sm text-red-700 underline underline-offset-2 hover:text-red-900"
            >
              {labels?.[k] ? <strong className="font-semibold">{labels[k]}:</strong> : null} {errors[k]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FormAlert({ tone = "info", children }) {
  const tones = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error:   "border-red-200 bg-red-50 text-red-700",
    info:    "border-black/10 bg-gray-50 text-black/70",
  }
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  )
}

// A step's heading takes focus when the step changes, so moving to step 2
// announces "Tell us about your project" instead of leaving focus on a button
// that no longer exists.
export const StepHeading = forwardRef(function StepHeading({ as: Tag = "h2", children, sub, step, total }, ref) {
  return (
    <div className="mb-6">
      {step && total && (
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#E50914]">
          Step {step} of {total}
        </p>
      )}
      <Tag ref={ref} tabIndex={-1} className="text-xl font-extrabold text-black focus:outline-none sm:text-2xl">
        {children}
      </Tag>
      {sub && <p className="mt-1 text-sm leading-relaxed text-black/60">{sub}</p>}
    </div>
  )
})

// Primary and secondary buttons sized for thumbs, with a visible focus ring.
export function PrimaryButton({ children, busy, busyLabel = "Sending…", className = "", ...props }) {
  return (
    <button
      {...props}
      aria-busy={busy || undefined}
      disabled={busy || props.disabled}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#E50914] px-7 text-base font-bold text-white
        shadow-lg shadow-red-500/20 transition hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E50914]/30
        disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {busy && (
        <svg aria-hidden="true" className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
          <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {busy ? busyLabel : children}
    </button>
  )
}

export function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-black/12 bg-white px-6 text-base font-semibold text-black
        transition hover:bg-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/15 ${className}`}
    >
      {children}
    </button>
  )
}

// Focuses a field by id, scrolling it into the middle of the screen rather
// than under a sticky header.
export function focusField(id) {
  const el = document.getElementById(id)
  if (!el) return
  const target = el.matches("fieldset") ? el.querySelector("input") || el : el
  target.scrollIntoView({ behavior: "smooth", block: "center" })
  target.focus({ preventScroll: true })
}
