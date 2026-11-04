export const metadata = {
    title: "Privacy Policy | PrimeTvNashville",
    description: "Read how PrimeTvNashville protects your personal information when using our website or booking services.",
    alternates: {
      canonical: "https://www.primetvnashville.com/privacy-policy"
    },
    openGraph: {
      title: "Privacy Policy | PrimeTvNashville",
      description: "Details on how we collect, use, and protect your data at PrimeTvNashville.",
      url: "https://www.primetvnashville.com/privacy-policy",
      siteName: "PrimeTvNashville",
      locale: "en_US",
      type: "website"
    }
  }
  
  export default function PrivacyPolicyPage() {
    return (
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-black mb-8">Privacy Policy</h1>
  
          <div className="space-y-6 text-gray-700 leading-relaxed text-base">
            <p>
              At PrimeTvNashville, we value your privacy. This Privacy Policy explains how we collect, use, and protect the personal information you provide when you use our website or book services.
            </p>
  
            <h2 className="font-semibold text-lg">1. Information We Collect</h2>
            <p>
              We collect personal information such as your name, phone number, email, and address when you book a service or contact us.
            </p>
  
            <h2 className="font-semibold text-lg">2. How We Use Your Information</h2>
            <p>
              Your information is used solely for communication, scheduling services, and improving our offerings. We do not sell or share your information without consent.
            </p>
  
            <h2 className="font-semibold text-lg">3. Data Protection</h2>
            <p>
              We use industry-standard security protocols to safeguard your information and prevent unauthorized access.
            </p>
  
            <h2 className="font-semibold text-lg">4. Third-Party Services</h2>
            <p>
              Some data may be processed by trusted third parties (e.g., payment processors). These parties are also bound by confidentiality and security obligations.
            </p>
  
            <h2 className="font-semibold text-lg">5. Text Messages (SMS)</h2>
            <p>
              If you agree to receive texts by ticking the optional box when you book,
              we use your mobile number to send appointment reminders, a review request after your job, and replies to
              your replies. We keep a record of when and how you agreed. Message frequency varies; message and data
              rates may apply. Reply STOP to stop at any time, or HELP for help. See our{" "}
              <a href="/sms-terms" className="font-semibold underline">SMS Terms</a>.
            </p>
            <p>
              We do not sell or share your SMS opt-in data or personal information with third parties for marketing
              purposes. No mobile information will be shared with third parties or affiliates for marketing or promotional
              purposes. Text messaging originator opt-in data and consent will not be shared with any third parties,
              except the service providers that deliver our messages on our behalf.
            </p>

            <h2 className="font-semibold text-lg">6. Contact Us</h2>
            <p>
              If you have questions about this policy or wish to update your data, contact us at info@primetvnashville.com.
            </p>
          </div>
        </div>
      </section>
    )
  }
  