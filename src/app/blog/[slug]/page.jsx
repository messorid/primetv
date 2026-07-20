import { getPostBySlug, getAllPosts } from '../../lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data } = getPostBySlug(slug)

  return {
    title: `${data.title} | PrimeTvNashville`,
    description: data.description,
    openGraph: {
      title: `${data.title} | PrimeTvNashville`,
      description: data.description,
      url: `https://primetvnashville.com/blog/${slug}`,
      siteName: 'PrimeTvNashville',
      images: [{ url: data.image, width: 1200, height: 630, alt: data.title }],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.title} | PrimeTvNashville`,
      description: data.description,
      images: [data.image],
    },
    alternates: {
      canonical: `https://primetvnashville.com/blog/${slug}`,
    },
    robots: { index: true, follow: true },
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const { content, data } = getPostBySlug(slug)

  return (
    <main className="py-20 text-black bg-white dark:bg-white">
      <div className="w-[90%] max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
        <p className="text-sm text-neutral-500 mb-6">{new Date(data.date).toLocaleDateString()}</p>

        {data.image && (
          <div className="relative w-full h-64 mb-8 rounded-xl overflow-hidden">
            <Image src={data.image} alt={data.title} fill className="object-cover" priority />
          </div>
        )}

        <article className="space-y-6 text-[17px] leading-relaxed text-neutral-800">
          <MDXRemote source={content} />
        </article>
      </div>
    </main>
  )
}
