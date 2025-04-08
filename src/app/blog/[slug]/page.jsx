import { getPostBySlug } from '../../lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'

export async function generateMetadata({ params }) {
  const { data } = getPostBySlug(params.slug)

  return {
    title: `${data.title} | Dra. Ana Colmenárez`,
    description: data.description,
    openGraph: {
      images: [data.image],
    },
  }
}

export default function BlogPost({ params }) {
  const { content, data } = getPostBySlug(params.slug)

  return (
    <main className="py-20 bg-blanco text-foreground">
      <div className="w-[90%] max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
        <p className="text-sm text-neutral-500 mb-6">{new Date(data.date).toLocaleDateString()}</p>

        {data.image && (
          <div className="relative w-full h-64 mb-8 rounded-xl overflow-hidden">
            <Image src={data.image} alt={data.title} fill className="object-cover" priority />
          </div>
        )}

        <article className="space-y-6 text-[17px] leading-relaxed text-neutral-800">
          <MDXRemote source={content}  />
        </article>
      </div>
    </main>
  )
}
