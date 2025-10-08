// app/book/page.jsx
import JotformEmbed from "./JotformEmbed"

export const metadata = {
  title: "Book installation | PrimeTv Nashville",
  description: "Schedule your TV mounting appointment in minutes",
}

export default function Page() {
  return (
    <section id="book" className="bg-white text-black">
      <JotformEmbed />
    </section>
  )
}
