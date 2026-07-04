export const dynamic = "force-static";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-border p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-extrabold text-text-dark mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-light mb-8">Last Updated: July 4, 2026</p>

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
            <h2 className="text-lg font-bold text-text-dark mb-2">5. Compliance and Governing Law</h2>
            <p>
              We align our data protection practices with relevant laws of Dubai, the United Arab Emirates federal data protection guidelines, and applicable international privacy frameworks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">6. Contact Us</h2>
            <p>
              If you have any questions, feedback, or concerns regarding your privacy or data rights, please reach out to us at <strong>privacy@docmate.ae</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
