import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy | Doc Mate",
  description:
    "How Mediserve Healthcare Consultancy LLC and docmate.ae collect, use, share, and protect your personal data, in line with UAE Federal Decree-Law No. 45 of 2021.",
  alternates: { canonical: "/privacy-policy" },
};

/**
 * Verbatim rendering of the Privacy Policy issued by Mediserve Healthcare
 * Consultancy LLC. Wording is the client's; only whitespace and punctuation
 * slips from the source document were repaired. Do not reword sections here —
 * amend the source document and re-render.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-border p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-extrabold text-text-dark mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-light mb-8">Last Updated: August 30, 2026</p>

        <div className="prose prose-blue text-text-mid max-w-none flex flex-col gap-6 text-sm md:text-base leading-relaxed">
          <p>
            We use this Privacy Policy to explain how Mediserve Healthcare Consultancy LLC and its
            associate www.docmate.ae protect your personal data. This policy applies when you use
            our websites, mobile apps, and services.
          </p>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">1. About Us</h2>
            <p>We run a digital healthcare platform designed to help users:</p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>Find medical professionals.</li>
              <li>Check patient reviews.</li>
              <li>Schedule medical appointments.</li>
            </ul>
            <p className="mt-3">
              We serve as the data controller for all data processed through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">2. Collected Information</h2>
            <p>We gather the following types of information:</p>

            <h3 className="text-base font-semibold text-text-dark mt-4 mb-1.5">a. Personal Details</h3>
            <ul className="list-disc pl-6 flex flex-col gap-1.5">
              <li>Full name</li>
              <li>Contact phone number</li>
              <li>Email address (if you choose to share it)</li>
            </ul>

            <h3 className="text-base font-semibold text-text-dark mt-4 mb-1.5">b. Appointment Details</h3>
            <ul className="list-disc pl-6 flex flex-col gap-1.5">
              <li>Chosen doctor or medical clinic</li>
              <li>Scheduled date and time of the visit</li>
              <li>Nature of the appointment (procedure or consultation)</li>
            </ul>

            <h3 className="text-base font-semibold text-text-dark mt-4 mb-1.5">
              c. Health-Related Information (sensitive personal data)
            </h3>
            <p>
              We process limited medical details strictly needed to schedule and manage your visits.
              This includes the medical specialty and the type of visit.
            </p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>
                <strong>Sharing:</strong> This information is sent exclusively to your chosen
                healthcare provider for booking coordination.
              </li>
              <li>
                <strong>Exclusions:</strong> We never save medical records, clinical histories,
                diagnoses, or lab results.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-text-dark mt-4 mb-1.5">
              d. Device and Usage Details
            </h3>
            <ul className="list-disc pl-6 flex flex-col gap-1.5">
              <li>IP addresses</li>
              <li>Type of device used</li>
              <li>Operating system</li>
              <li>App interaction behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">
              3. How Your Information Is Utilized
            </h2>
            <p>We use the gathered data to:</p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>Enable seamless appointment booking.</li>
              <li>Pass reservation specifics to your selected medical providers.</li>
              <li>Send out booking updates, reminders, and confirmations.</li>
              <li>Maintain, secure, and optimize our digital platform.</li>
              <li>Identify and block fraudulent activities or platform abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">4. Overview of Data Processing</h2>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-left text-xs md:text-sm border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-border">
                    <th className="py-2.5 pr-4 font-bold text-text-dark align-bottom">Data Category</th>
                    <th className="py-2.5 pr-4 font-bold text-text-dark align-bottom">Objective</th>
                    <th className="py-2.5 pr-4 font-bold text-text-dark align-bottom">Legal Ground</th>
                    <th className="py-2.5 pr-4 font-bold text-text-dark align-bottom">Shared With</th>
                    <th className="py-2.5 font-bold text-text-dark align-bottom">Storage Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-border/60">
                    <td className="py-2.5 pr-4 align-top">Name &amp; Phone Number</td>
                    <td className="py-2.5 pr-4 align-top">Appointment scheduling &amp; alerts</td>
                    <td className="py-2.5 pr-4 align-top">Contractual necessity</td>
                    <td className="py-2.5 pr-4 align-top">Partner Clinics &amp; Hospitals</td>
                    <td className="py-2.5 align-top">Processed until you revoke your consent.</td>
                  </tr>
                  <tr className="border-b border-gray-border/60">
                    <td className="py-2.5 pr-4 align-top">Appointment Specifics</td>
                    <td className="py-2.5 pr-4 align-top">Scheduling management</td>
                    <td className="py-2.5 pr-4 align-top">Contractual necessity</td>
                    <td className="py-2.5 pr-4 align-top">Partner Clinics &amp; Hospitals</td>
                    <td className="py-2.5 align-top">Processed until you revoke your consent.</td>
                  </tr>
                  <tr className="border-b border-gray-border/60">
                    <td className="py-2.5 pr-4 align-top">Health-Related Data</td>
                    <td className="py-2.5 pr-4 align-top">Medical care coordination</td>
                    <td className="py-2.5 pr-4 align-top">Explicit consent / necessity</td>
                    <td className="py-2.5 pr-4 align-top">Partner Clinics &amp; Hospitals</td>
                    <td className="py-2.5 align-top">Processed until you revoke your consent.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 align-top">Device &amp; Usage Details</td>
                    <td className="py-2.5 pr-4 align-top">Performance analytics</td>
                    <td className="py-2.5 pr-4 align-top">Legitimate interests</td>
                    <td className="py-2.5 pr-4 align-top">External Service providers</td>
                    <td className="py-2.5 align-top">Processed until you revoke your consent.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">5. Legal Basis for Data Handling</h2>
            <p>When required, our data processing relies on:</p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>Contractual obligations.</li>
              <li>Our legitimate interests.</li>
              <li>Explicit user permission (specifically for sensitive data types).</li>
            </ul>
            <p className="mt-3">
              Special category health data is processed only out of necessity and in strict alignment
              with regional data protection statutes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">6. Information Sharing</h2>
            <p>Data is shared exclusively under these necessary conditions:</p>

            <h3 className="text-base font-semibold text-text-dark mt-4 mb-1.5">a. Healthcare Facilities</h3>
            <p>
              Your details go directly to your chosen hospital or clinic solely to coordinate your
              visit.
            </p>

            <h3 className="text-base font-semibold text-text-dark mt-4 mb-1.5">
              b. External Service Providers
            </h3>
            <p>We partner with verified vendors to handle:</p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>Communications (WhatsApp and SMS messaging).</li>
              <li>Cloud data hosting.</li>
              <li>Platform usage analytics.</li>
            </ul>
            <p className="mt-3">These partners handle data strictly under our direct guidance.</p>

            <h3 className="text-base font-semibold text-text-dark mt-4 mb-1.5">c. Legal Enforcement</h3>
            <p>We will share data if mandated by statutory legal authorities.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">7. Data Storage Limits</h2>
            <p>We keep your details only for the required duration:</p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>
                <strong>Standard Timeline:</strong> The platform processes your data until you submit
                a request to withdraw your consent.
              </li>
              <li>
                <strong>Exceptions:</strong> Regulatory or statutory legal demands may require longer
                storage windows.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">8. Data Erasure</h2>
            <p>
              You maintain the right to ask for the complete removal of your personal information at
              any moment.
            </p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>
                <strong>How to Request:</strong> Email your request to{" "}
                <a
                  href="mailto:admin@docmate.ae"
                  className="text-blue-primary font-semibold hover:underline"
                >
                  admin@docmate.ae
                </a>
                .
              </li>
              <li>
                <strong>Timeline:</strong> Erasure requests are fulfilled within 30 days unless legal
                mandates require retention. Once erased, files are wiped from our network
                permanently, and our third-party vendors are instructed to delete them as well.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">9. Your Personal Rights</h2>
            <p>Depending on localized legislation, your rights include:</p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>Accessing your stored profile data.</li>
              <li>Correcting inaccuracies in your data.</li>
              <li>Requesting full data deletion.</li>
              <li>Objecting to specific data processing actions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">10. Safeguarding Data</h2>
            <p>
              We utilize robust and appropriate security frameworks to keep your information safe.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">11. Global Data Routing</h2>
            <p>
              Your data may be managed or transferred across international borders. We ensure all
              required protective frameworks are actively enforced during these transfers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">
              12. United Arab Emirates Regulation (PDPL)
            </h2>
            <p>
              For users residing within the UAE, our data operations strictly adhere to Federal
              Decree-Law No. 45 of 2021 regarding Personal Data Protection.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">13. Minors&rsquo; Privacy</h2>
            <p>
              Our digital platform is not built for or targeted toward individuals under the age of
              18.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">14. External Platform Links</h2>
            <p>
              We do not take responsibility for the privacy protocols of outside websites linked on
              our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">15. Policy Revisions</h2>
            <p>We will update this privacy statement from time to time.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">
              16. Health Data &mdash; Google Play Special Disclosure
            </h2>
            <p>
              Our mobile application may access and gather specific health-related metrics, limited
              to:
            </p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>The selected medical specialty.</li>
              <li>The specific nature of the medical procedure or consultation.</li>
              <li>
                <strong>Usage Purpose:</strong> Strictly used to facilitate and secure appointments
                with your chosen healthcare professional.
              </li>
              <li>
                <strong>Recipients:</strong> Disclosed only to your chosen clinic or hospital. It is
                never sold, handed over to unrelated third parties, or used for marketing campaigns.
              </li>
              <li>
                <strong>Storage Limit:</strong> Maintained continuously until you submit an explicit
                erasure request.
              </li>
              <li>
                <strong>Removal Method:</strong> Contact us directly at{" "}
                <a
                  href="mailto:admin@docmate.ae"
                  className="text-blue-primary font-semibold hover:underline"
                >
                  admin@docmate.ae
                </a>{" "}
                to wipe this data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">17. Contact</h2>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:admin@docmate.ae"
                  className="text-blue-primary font-semibold hover:underline"
                >
                  admin@docmate.ae
                </a>
              </li>
              <li>
                <strong>Company:</strong> Mediserve Healthcare Consultancy LLC.
              </li>
              <li>
                <strong>Website:</strong> www.docmate.ae
              </li>
            </ul>
          </section>

          <section>
            <p className="text-sm text-text-light">
              See also our{" "}
              <Link
                href="/data-protection-policy"
                className="text-blue-primary font-semibold hover:underline"
              >
                Data Protection Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="text-blue-primary font-semibold hover:underline">
                User Terms and Conditions
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
