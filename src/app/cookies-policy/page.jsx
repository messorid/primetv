export const metadata = {
    title: "Cookies Policy | PrimeTvNashville",
    description: "Learn how PrimeTvNashville uses cookies to improve user experience on our website.",
    alternates: {
      canonical: "https://primetvnashville.com/cookies-policy"
    },
    openGraph: {
      title: "Cookies Policy | PrimeTvNashville",
      description: "Details on the use of cookies for analytics and user experience enhancement.",
      url: "https://primetvnashville.com/cookies-policy",
      siteName: "PrimeTvNashville",
      locale: "en_US",
      type: "website"
    }
  }
  
  export default function CookiesPolicyPage() {
    return (
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-black mb-8">Cookies Policy</h1>
  
          <div className="space-y-6 text-gray-700 leading-relaxed text-base">
            <p>
              Prime TV Nashville uses cookies on our website to enhance functionality and analyze traffic. By using our site, you agree to our use of cookies.
            </p>
  
            <h2 className="font-semibold text-lg">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device that help us recognize your preferences and improve your user experience.
            </p>
  
            <h2 className="font-semibold text-lg">2. Types of Cookies We Use</h2>
            <ul className="list-disc pl-6">
              <li>Essential cookies for basic website functions</li>
              <li>Analytics cookies to understand user behavior</li>
              <li>Functional cookies to remember your settings</li>
            </ul>
  
            <h2 className="font-semibold text-lg">3. How to Control Cookies</h2>
            <p>
              You can disable cookies in your browser settings. However, this may affect some site functionality.
            </p>
  
            <h2 className="font-semibold text-lg">4. Changes to This Policy</h2>
            <p>
              We may update this Cookies Policy from time to time. Updates will be posted on this page.
            </p>
          </div>
        </div>
      </section>
    )
  }
  