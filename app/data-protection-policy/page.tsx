import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Data Protection Policy | Docmate",
  description:
    "The Data Protection Policy of Mediserve Healthcare Consultancy LLC, controller of docmate.ae — what data is processed, on what legal ground, for how long, and the rights of data subjects under UAE law.",
  alternates: { canonical: "/data-protection-policy" },
};

/**
 * Verbatim rendering of the Data Protection Policy issued by Mediserve
 * Healthcare Consultancy LLC. Referenced by clause 6.1 of the User Terms and
 * Conditions, which requires it to be published on the Website. Wording is the
 * client's; only whitespace and punctuation slips from the source document were
 * repaired. Do not reword sections here — amend the source document and
 * re-render.
 */

/** A "Term: definition" entry. */
function Term({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li>
      <strong className="text-text-dark">{label}:</strong> {children}
    </li>
  );
}

export default function DataProtectionPolicyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-border p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-extrabold text-text-dark mb-2">Data Protection Policy</h1>
        <p className="text-sm text-text-light mb-8">Last Updated: August 24, 2026</p>

        <div className="prose prose-blue text-text-mid max-w-none flex flex-col gap-6 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">
              1. Data Controller Identification
            </h2>
            <p>
              Mediserve Healthcare Consultancy LLC handles your data as the primary controller.
            </p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>
                <strong className="text-text-dark">Registered Office:</strong> Shams Business Center,
                Sharjah Media City Free Zone, Al Messaned, Sharjah, UAE.
              </li>
              <li>
                <strong className="text-text-dark">License Number:</strong> 2647142.01
              </li>
              <li>
                <strong className="text-text-dark">Platform:</strong> www.docmate.ae
              </li>
            </ul>
            <p className="mt-3">
              The Company processes all details in strict alignment with UAE data protection
              regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">2. Key Terminology</h2>
            <p>
              Any terms not explicitly explained here inherit their meanings from the www.docmate.ae{" "}
              <Link href="/terms" className="text-blue-primary font-semibold hover:underline">
                General Terms and Conditions
              </Link>
              :
            </p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-2">
              <Term label="Personal Data">
                Any detail identifying an individual (e.g., names, phone numbers, email addresses,
                and IP locations).
              </Term>
              <Term label="Health Data">
                Personal records tracking physical or mental well-being and medical service
                histories.
              </Term>
              <Term label="Processing">
                Any operation applied to data, including gathering, organizing, storing, or sharing
                it.
              </Term>
              <Term label="Controller">
                The organization determining why and how personal data gets managed.
              </Term>
              <Term label="Data Subject">
                The specific individual whose personal info is being processed.
              </Term>
              <Term label="Consent">
                A clear, voluntary, informed, and explicit agreement given by a user to permit data
                usage.
              </Term>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">
              3. Scope and Intent of Data Handling
            </h2>
            <p>
              The Controller manages info strictly to operate the www.docmate.ae healthcare search
              and appointment portal. The system lets patients reserve appointments while enabling
              medical professionals to handle schedules and collect patient reviews.
            </p>
            <p className="mt-3">
              Using the portal is entirely voluntary. However, refusing to grant data processing
              permission makes it impossible to use core features like appointment scheduling. If
              data moves across international borders, the Company deploys standard security
              frameworks to maintain compliance with UAE laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">4. Operational Activities</h2>

            <h3 className="text-base font-semibold text-text-dark mt-4 mb-1.5">
              4.1 Portal Utilization
            </h3>
            <p>
              The system records distinct details based on your user profile to connect patients with
              practitioners and keep communication channels open:
            </p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>
                <strong className="text-text-dark">Patient Details:</strong> Full name, ID
                credentials, email, phone contact, selected doctor, appointment scheduling
                parameters, and submitted evaluations.
              </li>
              <li>
                <strong className="text-text-dark">Healthcare Provider Details:</strong> Full name,
                operational contact lines, professional credentials, shifts, and medical reviews.
              </li>
            </ul>

            <h4 className="text-sm md:text-base font-semibold italic text-text-dark mt-4 mb-1.5">
              Primary Objectives
            </h4>
            <ul className="list-disc pl-6 flex flex-col gap-1.5">
              <li>Operating the online reservation infrastructure.</li>
              <li>Linking platform visitors with localized medical institutions.</li>
              <li>Keeping users informed about scheduling changes or cancellations.</li>
              <li>Texting notifications or status updates via mobile networks.</li>
              <li>
                Gathering system diagnostics, handling troubleshooting, and maintaining performance
                analytics.
              </li>
              <li>Administering marketing campaigns and boosting platform performance.</li>
            </ul>

            <h4 className="text-sm md:text-base font-semibold italic text-text-dark mt-4 mb-1.5">
              Legal Grounds &amp; Retention
            </h4>
            <ul className="list-disc pl-6 flex flex-col gap-1.5">
              <li>
                <strong className="text-text-dark">Legal Ground:</strong> Explicit user authorization
                or direct contract execution under UAE legal structures.
              </li>
              <li>
                <strong className="text-text-dark">Authorized Recipients:</strong> Medical centers,
                general platform visitors (for public reviews), and infrastructure maintenance
                vendors.
              </li>
              <li>
                <strong className="text-text-dark">Storage Limit:</strong> Up to 3 years following
                account deactivation, or until authorization is officially revoked.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-text-dark mt-6 mb-1.5">4.2 Cookie Usage</h3>
            <p>
              The platform deploys cookies&mdash;small localized browser data packets&mdash;to
              optimize functionality and interface layouts. Users retain complete control over these
              trackers and can adjust them via browser privacy preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">
              5. Information Distribution and Cross-Border Transfers
            </h2>
            <p>
              Information is shared only under essential operational circumstances, such as
              delivering booking details to a clinic or troubleshooting with IT contractors. These
              partners process data strictly under the Company&rsquo;s mandate.
            </p>
            <p className="mt-3">
              Information may safely move outside the UAE under strict local legal parameters. The
              platform may use completely anonymized records for broader statistical reports. If the
              platform undergoes ownership transitions or corporate sales, user data transfers to the
              buying party to keep services running smoothly. Disclosures to regulatory bodies will
              only occur if mandated by law, and users will be notified unless legal bans prevent it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">6. Retention Benchmarks</h2>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-1.5">
              <li>
                <strong className="text-text-dark">Account Records:</strong> Retained for exactly 3
                years following formal platform account closures.
              </li>
              <li>
                <strong className="text-text-dark">Marketing Subscriptions:</strong> Preserved
                continuously until the user officially unsubscribes.
              </li>
              <li>
                <strong className="text-text-dark">Customer Support Records:</strong> Maintained
                strictly until the problem is resolved, up to a maximum duration of 3 years.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">7. Legal Rights of Data Subjects</h2>
            <p>
              The platform enforces all protections guaranteed by UAE data legislation. The Company
              commits to fulfilling verified inquiries within 30 days of submission.
            </p>

            <h4 className="text-sm md:text-base font-semibold italic text-text-dark mt-4 mb-1.5">
              Available Rights
            </h4>
            <ul className="list-disc pl-6 flex flex-col gap-1.5">
              <li>
                <strong className="text-text-dark">Access &amp; Information:</strong> Confirm if your
                data is processed and request comprehensive records of its usage.
              </li>
              <li>
                <strong className="text-text-dark">Rectification:</strong> Demand swift updates to
                outdated or missing information.
              </li>
              <li>
                <strong className="text-text-dark">Restriction:</strong> Halt active processing
                during ongoing accuracy disputes, unlawful use cases, or legal defense claims.
              </li>
              <li>
                <strong className="text-text-dark">Withdrawal &amp; Objection:</strong> Revoke your
                system authorization or challenge data processing tied to corporate interests.
              </li>
              <li>
                <strong className="text-text-dark">Erasure:</strong> Request total data deletion when
                records are no longer required, consent is rescinded, or processing violations occur.
              </li>
            </ul>

            <h4 className="text-sm md:text-base font-semibold italic text-text-dark mt-4 mb-1.5">
              Grievances and Contact
            </h4>
            <p>
              Users can submit administrative updates or exercise their data protections by messaging{" "}
              <a
                href="mailto:admin@docmate.ae"
                className="text-blue-primary font-semibold hover:underline"
              >
                admin@docmate.ae
              </a>
              . If problems persist, you have the right to file formal disputes directly with the UAE
              Data Protection Authority.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">
              8. General Cyber Security and Third-Party Redirection
            </h2>
            <p>
              Cookies optimize system safety and responsiveness. However, because internet data
              streams are never completely foolproof, users upload information at their own risk. The
              site also contains links to external portals; this policy does not cover outside
              platforms, so users should review those external privacy rules independently.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">
              9. Adjustments and Document Maintenance
            </h2>
            <p>
              The Company welcomes user feedback at{" "}
              <a
                href="mailto:admin@docmate.ae"
                className="text-blue-primary font-semibold hover:underline"
              >
                admin@docmate.ae
              </a>
              . This document was officially updated on 24.08.2026.
            </p>
          </section>

          <section>
            <p className="text-sm text-text-light">
              See also our{" "}
              <Link href="/privacy-policy" className="text-blue-primary font-semibold hover:underline">
                Privacy Policy
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
