import fs from 'fs'
import path from 'path'

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://primetvnashville.com',
  generateRobotsTxt: false, // managed manually in public/robots.txt
  exclude: ['/admin', '/admin/*', '/api/*'],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, url) => {
    const priorities = {
      'https://primetvnashville.com': 1.0,
      'https://primetvnashville.com/tv-mounting-nashville': 0.95,
      'https://primetvnashville.com/services/tv-mounting': 0.9,
      'https://primetvnashville.com/services/home-theater': 0.85,
      'https://primetvnashville.com/services': 0.85,
      'https://primetvnashville.com/pricing': 0.8,
      'https://primetvnashville.com/contact': 0.8,
      'https://primetvnashville.com/book': 0.8,
      'https://primetvnashville.com/soundbar-installation-nashville': 0.8,
      // area landing pages
      'https://primetvnashville.com/tv-mounting-murfreesboro': 0.85,
      'https://primetvnashville.com/tv-mounting-franklin': 0.85,
      'https://primetvnashville.com/tv-mounting-brentwood': 0.85,
      'https://primetvnashville.com/tv-mounting-hendersonville': 0.82,
      'https://primetvnashville.com/tv-mounting-smyrna': 0.82,
      'https://primetvnashville.com/tv-mounting-mount-juliet': 0.82,
      'https://primetvnashville.com/tv-mounting-gallatin': 0.82,
      'https://primetvnashville.com/tv-mounting-spring-hill': 0.82,
      'https://primetvnashville.com/tv-mounting-lebanon': 0.8,
      'https://primetvnashville.com/tv-mounting-la-vergne': 0.8,
      'https://primetvnashville.com/tv-mounting-goodlettsville': 0.8,
      'https://primetvnashville.com/tv-mounting-nolensville': 0.8,
      // other pages
      'https://primetvnashville.com/about': 0.6,
      'https://primetvnashville.com/blog': 0.7,
      'https://primetvnashville.com/privacy-policy': 0.2,
      'https://primetvnashville.com/terms': 0.2,
      'https://primetvnashville.com/cookies-policy': 0.2,
    }

    return {
      loc: url,
      changefreq: config.changefreq,
      priority: priorities[url] ?? config.priority,
      lastmod: new Date().toISOString(),
    }
  },
  additionalPaths: async () => {
    const blogDir = path.join(process.cwd(), 'content/blog')
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx'))

    return files.map((file) => ({
      loc: `/blog/${file.replace('.mdx', '')}`,
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: new Date().toISOString(),
    }))
  },
}

export default config
