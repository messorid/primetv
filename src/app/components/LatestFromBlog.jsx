import Link from "next/link"

export default function LatestFromBlog() {
  return (
    <section className="bg-gray-50 py-20 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-black mb-4">
          Learn More About TV Installations
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Discover expert tips, clean setup ideas, and answers to common questions about mounting TVs and home theaters.
        </p>
        <Link
          href="/blog"
          className="inline-block bg-[#e50914] text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Read Our Blog
        </Link>
      </div>
    </section>
  )
}
