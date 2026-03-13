import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-28 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold mb-2">PrimeTvNashville</h2>
          <p className="text-gray-400">
            Professional TV mounting and home theater installation services
            in Nashville, Tennessee.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-2">Navigation</h3>
          <ul className="space-y-1 text-gray-300">
            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white transition">
                Services
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-2">Legal</h3>
          <ul className="space-y-1 text-gray-300">
            <li>
              <Link href="/terms" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookies-policy" className="hover:text-white transition">
                Cookies Policy
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="text-center text-gray-500 text-xs mt-10 space-y-2">
        <p>
          © {new Date().getFullYear()} PrimeTvNashville. All rights reserved.
        </p>

        <p>
          Website designed and developed by{" "}
          <a
            href="https://www.boostori.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E50914] font-medium hover:underline"
          >
            Boostori — www.boostori.com
          </a>
        </p>
      </div>
    </footer>
  )
}
