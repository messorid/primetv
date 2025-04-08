import { getAllPosts } from '../lib/blog'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Blog PrimeTvNashville',
  description: 'blog',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="py-20 bg-blanco text-foreground">
      <div className="w-[90%] max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-semibold mb-10">PrimeTv Blog</h1>
        <p className="mb-14 text-neutral-600 max-w-xl mx-auto">
          Welcome
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block text-left border rounded-xl shadow-sm hover:shadow-md transition">
              <div className="relative w-full h-52">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                <p className="text-sm text-neutral-700">{post.description}</p>
                <span className="mt-2 text-sm text-marron inline-block group-hover:underline">Leer más →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
