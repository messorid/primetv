// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER REVIEWS shown on the homepage, under the hero.
//
// Only real Google reviews, copied word for word — never written or edited by
// us. While this list is empty the section doesn't appear at all.
//
//   name    as it shows on Google ("Sarah M.")
//   text    the review, exactly as written
//   when    optional, a fixed month ("October 2026") — not "a month ago",
//           which goes out of date
//   stars   1 to 5
// ─────────────────────────────────────────────────────────────────────────────

export const REVIEWS = [
  { name: "Adrianna Blackwell", stars: 5, text: "Super professional! They even cleaned up the dry wall mess. 10/10 recommend" },
  { name: "betty Claxton", stars: 5, text: "These guys did a great job. They were right on time and were very good at their job. They were also very nice and friendly. Highly recommend them!!" },
  { name: "Jackie Vanaria", stars: 5, text: "These guys were great! They hung our tv and it looks great!" },
  { name: "Caroline Todd", stars: 5, text: "I had difficulty mounting the tv on my own with hard to find studs but they were able to make it work and the job was done quickly and neatly." },
]

// The business profile on Google, where all the reviews are.
export const GOOGLE_PROFILE_URL = "https://share.google/7n1n3WVYa3T7MA2B1"
