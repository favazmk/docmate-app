export const dynamic = "force-static";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-border p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-extrabold text-text-dark mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-light mb-8">Last Updated: August 19, 2026</p>

        <div className="prose prose-blue text-text-mid max-w-none flex flex-col gap-6 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">1. Information We Collect</h2>
            <p>
              When using Docmate to search for or request appointments with healthcare providers, we collect personal information necessary to facilitate the booking process. This includes:
            </p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>First name and last name</li>
              <li>Email address</li>
              <li>Phone number (including country code prefix)</li>
              <li>Reason for visit or symptoms (optional)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">2. How We Use Your Information</h2>
            <p>
              Your data is processed to facilitate the appointment request system. Specifically, we:
            </p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>Pass your contact details and preferred appointment date directly to the specific hospital or clinic (e.g., King's College Hospital London - Dubai) you selected.</li>
              <li>Send transaction emails to confirm your request status.</li>
              <li>Allow you to track your appointments on our Platform via email and phone matching.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">3. Data Sharing and Disclosure</h2>
            <p>
              We share your personal information *only* with the healthcare providers you select during the booking process so they can contact you to confirm and schedule your slot. We do *not* sell, rent, or trade patient data to third parties for marketing or advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">4. Data Security</h2>
            <p>
              We implement industry-standard administrative, technical, and physical security measures to safeguard your personal details from unauthorized access, alteration, disclosure, or destruction. However, no transmission method over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">5. Cookies and Website Analytics</h2>
            <p>
              We use Google Analytics, loaded through Google Tag Manager, to understand how visitors use Docmate so we can improve the Platform. These services place cookies on your device and collect limited technical information, including:
            </p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>Pages you view and how long you spend on them</li>
              <li>The website, search engine, or advertisement that referred you</li>
              <li>Your device type, browser, operating system, and screen size</li>
              <li>An approximate, city-level location derived from your IP address</li>
            </ul>
            <p className="mt-3">
              This information is used in aggregate to measure traffic and improve the Platform. It is <strong>not</strong> used to identify you personally, and it is not linked to the appointment requests you submit. The name, email address, phone number, and reason for visit you enter into a booking form are <strong>never</strong> transmitted to Google or any other analytics provider &mdash; those details go only to the healthcare provider you selected, as described in Section 3.
            </p>
            <p className="mt-3">
              Google processes this data as our analytics provider and retains it under its own terms. Google does not receive your IP address in stored form; it is used to derive the approximate location and then discarded.
            </p>
            <p className="mt-3">
              <strong>Your choices.</strong> You can block or delete these cookies at any time through your browser settings, or install the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-primary font-semibold hover:underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              . Most browsers also offer a &ldquo;Do Not Track&rdquo; setting. Declining analytics cookies does not affect your ability to search for doctors or request an appointment &mdash; every feature of Docmate works normally without them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">6. Compliance and Governing Law</h2>
            <p>
              We align our data protection practices with relevant laws of Dubai, the United Arab Emirates federal data protection guidelines, and applicable international privacy frameworks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">7. Contact Us</h2>
            <p>
              If you have any questions, feedback, or concerns regarding your privacy or data rights, please reach out to us at <strong>privacy@docmate.ae</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
