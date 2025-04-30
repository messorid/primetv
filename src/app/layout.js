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
                {/* Meta Pixel Code */}
                <Script
          id="fb-pixel-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function(f,b,e,v,n,t,s){
  if(f.fbq) return;
  n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq) f._fbq=n;
  n.push=n; n.loaded=!0; n.version='2.0';
  n.queue=[];
  t=b.createElement(e); t.async=!0;
  t.src=v;
  s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)
})(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1015602400177523');
fbq('track', 'PageView');
            `
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1015602400177523&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Toaster position="top-center" />
        <Footer/>
        </body>
    </html>
  )
}
