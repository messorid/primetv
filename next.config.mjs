/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
  outputFileTracingIncludes: {
    "/blog": ["./content/blog/**/*"],
    "/blog/[slug]": ["./content/blog/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/tv-mounting-nashville",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
