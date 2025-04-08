import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Toaster } from 'react-hot-toast'

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
      <body className={inter.className}>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Toaster position="top-center" />
        <Footer/>
        </body>
    </html>
  )
}
