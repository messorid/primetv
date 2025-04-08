import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsPath = path.join(process.cwd(), 'content', 'blog')

export function getAllPosts() {
  const files = fs.readdirSync(postsPath)

  return files.map((filename) => {
    const slug = filename.replace('.mdx', '')
    const fileContent = fs.readFileSync(path.join(postsPath, filename), 'utf8')
    const { data } = matter(fileContent)

    return {
      slug,
      ...data,
    }
  })
}

export function getPostBySlug(slug) {
  const filePath = path.join(postsPath, `${slug}.mdx`)
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { content, data } = matter(fileContent)

  return { content, data }
}
