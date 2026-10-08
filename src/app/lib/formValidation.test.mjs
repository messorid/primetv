// The shared rules behind every public form. The phone rules matter most: a
// lead with an unusable number is a lead we cannot call back.
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  formatUSPhone, phoneDigits, isValidUSPhone, phoneToE164, US_PHONE_MAX_LENGTH,
  cleanZip, isValidZip, isValidEmail, suggestEmail, isValidName, localToday, validate,
} from "./formValidation.js"

test("phone formats progressively as it is typed", () => {
  assert.equal(formatUSPhone(""), "")
  assert.equal(formatUSPhone("6"), "(6")
  assert.equal(formatUSPhone("615"), "(615")
  assert.equal(formatUSPhone("6155"), "(615) 5")
  assert.equal(formatUSPhone("615555"), "(615) 555")
  assert.equal(formatUSPhone("6155550"), "(615) 555-0")
  assert.equal(formatUSPhone("6155550123"), "(615) 555-0123")
})

test("phone never holds more than ten digits", () => {
  assert.equal(formatUSPhone("61555501239999"), "(615) 555-0123")
  assert.equal(phoneDigits("615 555 0123 ext 44"), "6155550123")
})

test("a pasted country code is dropped, not counted", () => {
  assert.equal(formatUSPhone("+1 615 555 0123"), "(615) 555-0123")
  assert.equal(formatUSPhone("1-615-555-0123"), "(615) 555-0123")
  assert.equal(formatUSPhone("16155550123"), "(615) 555-0123")
})

test("formatting is stable when re-applied to its own output", () => {
  // The input re-formats on every keystroke, so this is what actually happens.
  const once = formatUSPhone("6155550123")
  assert.equal(formatUSPhone(once), once)
})

test("deleting back through the formatting works", () => {
  // Backspace over "(615) 555-0" removes the 0 and leaves "(615) 555".
  assert.equal(formatUSPhone("(615) 555-"), "(615) 555")
  assert.equal(formatUSPhone("(615) "), "(615")
  assert.equal(formatUSPhone("("), "")
})

test("maxLength matches the longest formatted number", () => {
  assert.equal(US_PHONE_MAX_LENGTH, formatUSPhone("6155550123").length)
})

test("a real Nashville number is valid", () => {
  assert.equal(isValidUSPhone("(615) 669-0251"), true)
  assert.equal(isValidUSPhone("6156690251"), true)
  assert.equal(isValidUSPhone("+1 615 669 0251"), true)
})

test("numbers that cannot exist are rejected", () => {
  assert.equal(isValidUSPhone("(615) 555-012"), false, "nine digits")
  assert.equal(isValidUSPhone("1234567890"), false, "area code cannot start with 1")
  assert.equal(isValidUSPhone("0155550123"), false, "area code cannot start with 0")
  assert.equal(isValidUSPhone("6151550123"), false, "exchange cannot start with 1")
  assert.equal(isValidUSPhone("call me"), false)
  assert.equal(isValidUSPhone(""), false)
})

test("E.164 is produced only for a complete number", () => {
  assert.equal(phoneToE164("(615) 669-0251"), "+16156690251")
  assert.equal(phoneToE164("(615) 669"), "")
})

test("ZIP keeps five digits and nothing else", () => {
  assert.equal(cleanZip("37209"), "37209")
  assert.equal(cleanZip("37209-1234"), "37209")
  assert.equal(cleanZip("TN 37209"), "37209")
  assert.equal(isValidZip("37209"), true)
  assert.equal(isValidZip("3720"), false)
  assert.equal(isValidZip("Nashville"), false)
})

test("email catches the typos that matter", () => {
  assert.equal(isValidEmail("ada@example.com"), true)
  assert.equal(isValidEmail(" ada@example.com "), true, "surrounding spaces are fine")
  assert.equal(isValidEmail("ada@example"), false, "no dot")
  assert.equal(isValidEmail("adaexample.com"), false, "no @")
  assert.equal(isValidEmail("ada @example.com"), false, "space inside")
  assert.equal(isValidEmail("ada@example.c"), false, "one-letter TLD")
})

test("common domain misspellings get a suggestion, never a silent change", () => {
  assert.equal(suggestEmail("ada@gmial.com"), "ada@gmail.com")
  assert.equal(suggestEmail("ada@Gmail.con"), "ada@gmail.com")
  assert.equal(suggestEmail("ada@gmail.com"), "", "correct addresses get no suggestion")
  assert.equal(suggestEmail("ada@primetvnashville.com"), "")
  assert.equal(suggestEmail("not-an-email"), "")
})

test("names need two real letters", () => {
  assert.equal(isValidName("Jo"), true)
  assert.equal(isValidName("José"), true)
  assert.equal(isValidName("J"), false)
  assert.equal(isValidName("  "), false)
  assert.equal(isValidName("12"), false)
})

test("today is the local date, not the UTC one", () => {
  // 8pm in Nashville on Oct 8 is already Oct 9 in UTC.
  const evening = new Date(2026, 9, 8, 20, 0, 0)
  assert.equal(localToday(evening), "2026-10-08")
})

test("validate reports the first failing rule per field", () => {
  const errors = validate([
    ["phone", false, "first"],
    ["phone", false, "second"],
    ["email", true, "never"],
    ["zip", false, "zip message"],
  ])
  assert.deepEqual(errors, { phone: "first", zip: "zip message" })
})
