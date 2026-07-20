/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Include MDX blog content files in the standalone output
  outputFileTracingIncludes: {
    "/blog": ["./content/blog/**/*"],
    "/blog/[slug]": ["./content/blog/**/*"],
  },
}

export default nextConfig
