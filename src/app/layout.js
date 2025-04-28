import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PrimeTvNashville | TV Mounting and Installation Experts",
  description: "Professional TV installation services in Nashville TN",
  openGraph: {
    title: "PrimeTvNashville",
    description: "Reliable and expert TV mounting in Nashville",
    url: "https://primetvnashville.com",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
}

export default function Layout({ children }) {
  return (
    <html lang="en">
    <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QJMH27JB3N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QJMH27JB3N');
          `}
        </Script>
      </head>
      <body className={inter.className}>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Toaster position="top-center" />
        <Footer/>
        </body>
    </html>
  )
}
