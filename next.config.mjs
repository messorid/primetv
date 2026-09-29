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
      // /samsung-frame-tv-installation-nashville already covers this query in
      // full — no-gap mount, One Connect routing, Art Mode, hard walls. A second
      // page on the same topic would split the ranking between two URLs rather
      // than strengthen either, so the shorter path redirects into it instead.
      {
        source: "/samsung-frame-tv-installation",
        destination: "/samsung-frame-tv-installation-nashville",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
