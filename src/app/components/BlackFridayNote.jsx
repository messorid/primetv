// A Black Friday callout for blog posts: <BlackFridayNote /> in the MDX. It
// renders nothing once BLACK_FRIDAY_ON is false (lib/blackFriday.js), so the
// posts stay true after the sale without being edited.
//
//   topic="fireplace"  for posts about fireplace installs
//   topic="hardwall"   for posts about brick, stone or tile
//   (none)             the general offer
import Link from "next/link"
import { BLACK_FRIDAY_ON, BF_PROMOS, BF_DISCOUNT_PCT } from "../lib/blackFriday"

export const BF_PAGE = "/black-friday-tv-mounting-nashville"

const link = "font-bold text-brand-dark underline decoration-2 underline-offset-4 hover:text-ink"

export default function BlackFridayNote({ topic }) {
  if (!BLACK_FRIDAY_ON) return null
  const from = Math.min(...BF_PROMOS.map(p => p.amount))
  const text =
    topic === "fireplace"
      ? `Our Black Friday Promos for two TVs are for drywall walls and don't cover a TV mounted over a fireplace. A fireplace install is booked as a standard service instead, and gets ${BF_DISCOUNT_PCT}% off for Black Friday.`
      : topic === "hardwall"
      ? `Our Black Friday Promos for two TVs are for drywall walls only. Brick, stone, tile and concrete installs are booked as a standard service instead, and get ${BF_DISCOUNT_PCT}% off for Black Friday.`
      : `Two TVs mounted from $${from} with a Black Friday Promo (drywall walls only, not over a fireplace), or ${BF_DISCOUNT_PCT}% off any other service. Limited time.`
  return (
    <div className="not-prose my-8 rounded-2xl bg-ink p-5 text-white">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-bright">Black Friday at PrimeTV</p>
      <p className="mt-1.5 text-base leading-relaxed text-white">{text}</p>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-base">
        <Link href={BF_PAGE} className="font-bold text-white underline decoration-brand-bright decoration-2 underline-offset-4 hover:text-brand-bright">See the Black Friday deals</Link>
        <Link href="/book" className="font-bold text-white underline decoration-brand-bright decoration-2 underline-offset-4 hover:text-brand-bright">Book installation</Link>
      </p>
    </div>
  )
}
