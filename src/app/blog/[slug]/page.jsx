import { getPostBySlug, getAllPosts } from '../../lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import Link from 'next/link'
import ShareButton from '../ShareButton'

// Styles for what Markdown produces. Without these the reset leaves every
// heading, list and link looking like body text.
const mdx = {
  h2: props => <h2 className="mt-12 text-2xl sm:text-[1.7rem] font-extrabold tracking-tight text-ink" {...props} />,
  h3: props => <h3 className="mt-8 text-xl font-bold text-ink" {...props} />,
  p: props => <p className="text-[17px] leading-relaxed text-body" {...props} />,
  ul: props => <ul className="list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-body marker:text-brand" {...props} />,
  ol: props => <ol className="list-decimal space-y-2 pl-6 text-[17px] leading-relaxed text-body marker:font-bold marker:text-ink" {...props} />,
  li: props => <li className="pl-1" {...props} />,
  a: ({ href = "", ...props }) => {
    const cls = "font-semibold text-brand-dark underline decoration-2 underline-offset-4 hover:text-ink"
    return href.startsWith("/") ? <Link href={href} className={cls} {...props} /> : <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...props} />
  },
  strong: props => <strong className="font-bold text-ink" {...props} />,
  hr: () => <hr className="my-10 border-zinc-200" />,
  blockquote: props => <blockquote className="border-l-4 border-brand pl-4 italic text-body" {...props} />,
}

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
      images: [{ url: data.image, width: 1200, height: 630, alt: data.imageAlt || data.title }],
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

  // The header photo usually illustrates the topic rather than showing the
  // exact model in the title, so posts can describe the photo itself via
  // imageAlt. Older posts without it fall back to the title.
  const imageAlt = data.imageAlt || data.title

  // Optional FAQ in the front matter: shown at the end of the post and marked
  // up as FAQPage with exactly the same text.
  const faq = Array.isArray(data.faq) ? data.faq.filter(f => f?.q && f?.a) : []
  const url = `${BASE}/blog/${slug}`

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
      "dateModified": data.updated || data.date,
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
    ...(faq.length ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
    }] : []),
  ]

  return (
    <div className="py-20 text-black bg-white dark:bg-white">
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
          {new Date(data.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
        </p>

        {data.image && (
          <div className="relative w-full h-64 mb-8 rounded-xl overflow-hidden">
            <Image src={data.image} alt={imageAlt} fill className="object-cover" priority />
          </div>
        )}

        <article className="space-y-6 text-[17px] leading-relaxed text-neutral-800">
          <MDXRemote source={content} components={mdx} />
        </article>

        {faq.length > 0 && (
          <section aria-labelledby="post-faq" className="mt-14">
            <h2 id="post-faq" className="text-2xl sm:text-[1.7rem] font-extrabold tracking-tight text-ink">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {faq.map(f => (
                <details key={f.q} className="group rounded-2xl border border-zinc-200 bg-white">
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base sm:text-lg font-bold text-ink">{f.q}</h3>
                    <span aria-hidden="true" className="flex size-8 flex-none items-center justify-center rounded-full border-2 border-zinc-300 text-lg font-bold text-ink transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-[17px] leading-relaxed text-body">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10">
          <ShareButton title={data.title} url={url} />
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link href="/blog" className="text-sm font-semibold text-[#E50914] hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
