import { getPostBySlug, getAllPosts } from '../../lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import Link from 'next/link'

const BASE = "https://www.primetvnashville.com"

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
      url: `${BASE}/blog/${slug}`,
      siteName: 'PrimeTvNashville',
      images: [{ url: data.image, width: 1200, height: 630, alt: data.title }],
      locale: 'en_US',
      type: 'article',
      publishedTime: data.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.title} | PrimeTvNashville`,
      description: data.description,
      images: [data.image],
    },
    alternates: {
      canonical: `${BASE}/blog/${slug}`,
    },
    robots: { index: true, follow: true },
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const { content, data } = getPostBySlug(slug)

  const absoluteImage = data.image?.startsWith("http")
    ? data.image
    : `${BASE}${data.image}`

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": data.title,
      "description": data.description,
      "image": absoluteImage,
      "datePublished": data.date,
      "dateModified": data.date,
      "url": `${BASE}/blog/${slug}`,
      "author": {
        "@type": "Organization",
        "name": "PrimeTvNashville",
        "url": BASE,
      },
      "publisher": {
        "@type": "Organization",
        "name": "PrimeTvNashville",
        "url": BASE,
        "logo": { "@type": "ImageObject", "url": `${BASE}/logo.webp`, "width": 200, "height": 60 },
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE}/blog/${slug}` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE}/blog` },
        { "@type": "ListItem", "position": 3, "name": data.title, "item": `${BASE}/blog/${slug}` },
      ],
    },
  ]

  return (
    <main className="py-20 text-black bg-white dark:bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="w-[90%] max-w-3xl mx-auto">
        {/* Visual breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500">
          <Link href="/" className="hover:text-[#E50914] transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-[#E50914] transition-colors">Blog</Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-700 font-medium line-clamp-1">{data.title}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
        <p className="text-sm text-neutral-500 mb-6">
          {new Date(data.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        {data.image && (
          <div className="relative w-full h-64 mb-8 rounded-xl overflow-hidden">
            <Image src={data.image} alt={data.title} fill className="object-cover" priority />
          </div>
        )}

        <article className="space-y-6 text-[17px] leading-relaxed text-neutral-800">
          <MDXRemote source={content} />
        </article>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link href="/blog" className="text-sm font-semibold text-[#E50914] hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </main>
  )
}
