import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "User Terms and Conditions | Docmate",
  description:
    "The General Terms and Conditions for Users of docmate.ae, issued by Mediserve Healthcare Consultancy LLC and governed by the laws of the United Arab Emirates.",
  alternates: { canonical: "/terms" },
};

/**
 * Verbatim rendering of the User Terms and Conditions issued by Mediserve
 * Healthcare Consultancy LLC. Wording is the client's; only whitespace and
 * punctuation slips from the source document were repaired. Do not reword
 * clauses here — amend the source document and re-render.
 */

/** A numbered clause. The number is emphasised, the text is not. */
function Clause({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="mt-2">
      <strong className="text-text-dark">{n}</strong> {children}
    </p>
  );
}

/** A defined term from Section 2. */
function Definition({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <li>
      <strong className="text-text-dark">&ldquo;{term}&rdquo;</strong> {children}
    </li>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-border p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-extrabold text-text-dark mb-2">User Terms and Conditions</h1>
        <p className="text-sm text-text-light mb-8">Last Updated: August 30, 2026</p>

        <div className="prose prose-blue text-text-mid max-w-none flex flex-col gap-6 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">1. General Terms</h2>
            <p>
              These General Terms and Conditions for Users (hereinafter referred to as the
              &ldquo;User Terms and Conditions&rdquo;) are issued by Mediserve Healthcare Consultancy
              LLC, having its registered office at Shams Business Center, Sharjah Media City Free
              Zone, Al Messaned, Sharjah, UAE under license number 2647142.01, as the sole owner and
              operator of the website www.docmate.ae (hereinafter referred to as the &ldquo;Service
              Provider&rdquo; and the &ldquo;Website&rdquo;, respectively).
            </p>
            <p className="mt-3">
              These User Terms and Conditions regulate the legal relationship between the Service
              Provider and any person using the Website (hereinafter referred to as the
              &ldquo;User&rdquo;) in connection with the use of the services made available by the
              Service Provider through the Website, as well as all matters arising from such
              relationship.
            </p>
            <p className="mt-3">
              These User Terms and Conditions are governed by the applicable laws of the United Arab
              Emirates.
            </p>
            <p className="mt-3">
              The User Terms and Conditions form part of the agreement between the Service Provider
              and the User because the Service Provider provides the User with the opportunity to
              review and accept these terms before entering into the agreement.
            </p>
            <p className="mt-3">
              These Terms and Conditions apply to the use of the Service Provider&rsquo;s services.
              By registering with and using the Website, the User confirms and agrees to be bound by
              these User Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">2. Definitions and Basic Concepts</h2>
            <p>
              For the purposes of these User Terms and Conditions, the following terms shall have the
              meanings set out below:
            </p>
            <ul className="list-disc pl-6 mt-2 flex flex-col gap-2">
              <Definition term="Parties">
                means the User and the Service Provider collectively.
              </Definition>
              <Definition term="Partner">
                means a partner of the Service Provider that is either an individual or a company
                licensed by the Dubai Health Authority (DHA) to provide healthcare services, or a
                natural or legal person authorized to provide non-healthcare services within the UAE.
              </Definition>
              <Definition term="Data Controller">
                means the Service Provider, which independently determines the purposes and methods
                of processing personal data.
              </Definition>
              <Definition term="Database">
                means the Partners available through the Website, including their contact details and
                other relevant information, as well as the User&rsquo;s name, telephone number, and
                other information requested by the Partner.
              </Definition>
              <Definition term="Service">
                means the intermediary service provided by the Service Provider through which its
                system receives, processes, and transmits appointment bookings made by Users to
                Partners. The Service Provider does not personally meet Users, and the Service is
                provided to Users free of charge.
              </Definition>
              <Definition term="Service Provider">
                means Mediserve Healthcare Consultancy LLC, having its registered office at Shams
                Business Center, Sharjah Media City Free Zone, Al Messaned, Sharjah, UAE, license
                number 2647142.01, and email address{" "}
                <a
                  href="mailto:admin@docmate.ae"
                  className="text-blue-primary font-semibold hover:underline"
                >
                  admin@docmate.ae
                </a>
                .
              </Definition>
              <Definition term="Recipient">
                means any natural or legal person, including a Partner, analytics service provider,
                or marketing service provider, to whom or with whom personal data is communicated in
                connection with the Service.
              </Definition>
              <Definition term="Processing">
                means any operation or series of operations performed on personal data or sets of
                personal data collected from Users and Partners, whether carried out through
                automated means or otherwise. This includes collection, recording, organization,
                structuring, storage, adaptation, alteration, retrieval, consultation, use,
                disclosure through transmission, dissemination, making available by other means,
                alignment, combination, restriction, erasure, or destruction.
              </Definition>
              <Definition term="Treatment">
                means healthcare services provided to the User by an individual or company authorized
                to provide healthcare services and acting as a Partner through the Website. It also
                includes well-being services booked through the Website by the Partner and provided
                by the Service Provider for the purpose of maintaining the User&rsquo;s physical and
                mental health. Treatment may be provided either through face-to-face consultations or
                online consultations.
              </Definition>
              <Definition term="Treatment Details">
                means information supplied by the Partner concerning a Treatment, including
                information about doctors, their schedules, available appointments, locations,
                prices, and descriptions of the Treatment.
              </Definition>
              <Definition term="Visit">
                means a Treatment appointment that the User has attended.
              </Definition>
              <Definition term="User">
                means an individual who makes an appointment with a Partner of the Service Provider
                through the Website, whether the appointment is made for the User themselves or for a
                third party.
              </Definition>
              <Definition term="User Account">
                means the password-protected section of the Website through which the User can book
                appointments through the Service Provider, access the User Terms and Conditions,
                view, modify, or cancel appointment bookings, provide ratings for Partners following
                completed bookings, view booked appointments and Partner and doctor information, and
                make changes to personal data where permitted by the Website.
              </Definition>
              <Definition term="Website">
                means the website www.docmate.ae, or another URL designated by the Service Provider
                at its discretion, provided that prior notice is given to the User, together with the
                services made available through that website.
              </Definition>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">3. Scope and Content of the Service</h2>
            <p>The Service Provider makes the following Services available to Users:</p>
            <Clause n="3.1">
              The Website provides an online interface through which Partners can display their
              available appointment dates, which may then be booked by Users of the Website.
            </Clause>
            <Clause n="3.2">
              When a User makes a booking through the Website, the User enters into a contractual
              relationship directly with the relevant Partner.
            </Clause>
            <Clause n="3.3">
              The Treatment Details displayed through the Services are based on information supplied
              by the Partners. The Service Provider does not independently verify the Partners&rsquo;
              doctors through any public registry.
            </Clause>
            <Clause n="3.4">
              The Partners remain solely responsible at all times for ensuring that the Treatment
              Details displayed on the Website are accurate, complete, and truthful.
            </Clause>
            <Clause n="3.5">
              The Website is not intended to constitute, and must not be interpreted as, a
              recommendation or endorsement by the Service Provider of any Partner listed on the
              Website.
            </Clause>
            <Clause n="3.6">
              Each Partner is solely responsible for ensuring that its medical and other activities
              comply with all applicable laws and regulations in force in the UAE.
            </Clause>
            <Clause n="3.7">
              The Service Provider shall not be liable for the actual provision or performance of any
              Treatment, including any failure by a Partner to provide or perform the Treatment.
            </Clause>
            <Clause n="3.8">
              The Service Provider acknowledges that, in certain unforeseen circumstances, a Partner
              may be unable to be available to the User at the agreed appointment time. The Services
              are intended solely for the User&rsquo;s personal and non-commercial use.
            </Clause>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">
              4. Registration and Appointment Booking
            </h2>
            <Clause n="4.1">
              Booking an appointment through the Website requires registration. Registration may be
              completed by submitting the required contact information and other necessary data.
            </Clause>
            <Clause n="4.2">
              Users who have not registered may browse the available Partners and appointments but
              cannot make an appointment booking.
            </Clause>
            <Clause n="4.3">
              A User who has not previously registered may complete the registration process at the
              time of making their first booking.
            </Clause>
            <Clause n="4.4">
              When a Treatment is booked, the Service Provider may contact the User both before and
              after the scheduled Treatment appointment.
            </Clause>
            <Clause n="4.5">
              Following a Treatment booking, the Service Provider may contact the User by telephone
              to confirm and verify the details of the booked Treatment.
            </Clause>
            <Clause n="4.6">
              The Service Provider may contact the relevant Partner to confirm whether the scheduled
              Visit actually took place.
            </Clause>
            <Clause n="4.7">
              In both cases, the Service Provider may request feedback or a review concerning the
              Treatment, Visit, and Partner.
            </Clause>
            <Clause n="4.8">
              Telephone conversations may be recorded for the purpose of verifying bookings.
            </Clause>
            <Clause n="4.9">
              The User is legally responsible under applicable civil and criminal laws for ensuring
              that all information and data provided by the User are truthful and accurate.
            </Clause>
            <Clause n="4.10">
              The Service Provider shall not be responsible or liable for any consequences arising
              from inaccurate or incorrectly provided information or data.
            </Clause>
            <Clause n="4.11">
              Completion of the registration process is subject to the User accepting the User Terms
              and Conditions published on the Website and the applicable{" "}
              <Link
                href="/data-protection-policy"
                className="text-blue-primary font-semibold hover:underline"
              >
                Data Protection Policy
              </Link>
              . Acceptance of these User Terms and Conditions constitutes a contractual agreement
              between the Service Provider and the User.
            </Clause>
            <Clause n="4.12">
              Once the User has accepted these User Terms and Conditions and completed registration,
              the User may not withdraw such acceptance while continuing to use the Service.
            </Clause>
            <Clause n="4.13">
              By making an appointment booking, the User expressly acknowledges and accepts that the
              User&rsquo;s data will be transmitted to the relevant Partner.
            </Clause>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">
              5. User Obligations and Responsibilities
            </h2>
            <Clause n="5.1">
              The User is responsible for ensuring that all data and information submitted through
              the Website are accurate and complete. The User is solely responsible for selecting the
              Treatment that they wish to obtain from among the Services provided through the
              Website.
            </Clause>
            <Clause n="5.2">
              If the User wishes to review, change, or cancel a reservation, the User may do so
              independently through their User Account.
            </Clause>
            <Clause n="5.3">
              The User confirms and warrants that they have the legal capacity and authority required
              to enter into these User Terms and Conditions.
            </Clause>
            <Clause n="5.4">
              The User must not use the Website for any unlawful, deceptive, unauthorized, or harmful
              purpose or in any manner that is otherwise prohibited.
            </Clause>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">6. Data Protection</h2>
            <Clause n="6.1">
              The Service Provider&rsquo;s{" "}
              <Link
                href="/data-protection-policy"
                className="text-blue-primary font-semibold hover:underline"
              >
                Data Protection Policy
              </Link>{" "}
              is available on the Service Provider&rsquo;s Website and governs the applicable
              processing and protection of personal data.
            </Clause>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">7. Prices and Charges</h2>
            <Clause n="7.1">
              Any price displayed on the Service Provider&rsquo;s Website represents the price
              specified by the relevant Partner.
            </Clause>
            <Clause n="7.2">
              The User may access and use the Services provided directly by the Service Provider free
              of charge.
            </Clause>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">8. Complaints and Dispute Handling</h2>
            <Clause n="8.1">
              If the User has any complaint, claim, or issue involving incorrect data entered while
              using the Service, the User may contact the Service Provider by email at{" "}
              <a
                href="mailto:admin@docmate.ae"
                className="text-blue-primary font-semibold hover:underline"
              >
                admin@docmate.ae
              </a>
              .
            </Clause>
            <Clause n="8.2">
              In the event of a consumer protection issue, the User may also contact the Dubai Health
              Authority (DHA) or the UAE Department of Economic Development (DED).
            </Clause>
            <Clause n="8.3">
              Any disputes may be submitted to the competent courts of Dubai, UAE, in accordance with
              the applicable laws of the United Arab Emirates.
            </Clause>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">9. Legal Disclaimer</h2>
            <Clause n="9.1">
              The Service Provider reserves all rights relating to the Website, including all or any
              part of the Website and all content made available through it.
            </Clause>
            <Clause n="9.2">
              Responsibility for the content of classified advertisements, advertisements, and any
              other materials published or placed on the Website rests exclusively with the person or
              entity that submitted the material or the customer of the relevant service.
            </Clause>
            <Clause n="9.3">
              The Service Provider disclaims any liability for loss, damage, or harm resulting from
              materials published or placed on the Website.
            </Clause>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">10. Miscellaneous Provisions</h2>
            <Clause n="10.1">
              Unless expressly stated otherwise, all intellectual property rights, including
              copyrights, relating to the software required to operate and use the Services, as well
              as the content, information, and materials contained on or used by the Website, belong
              to the Service Provider.
            </Clause>
            <Clause n="10.2">
              These User Terms and Conditions and all procedures associated with the Services shall
              be governed by and interpreted in accordance with the laws of the United Arab Emirates.
            </Clause>
            <Clause n="10.3">
              If any provision of these User Terms and Conditions is determined to be or becomes
              invalid, unenforceable, or non-binding, the remaining provisions shall continue to
              remain valid and fully effective.
            </Clause>
            <Clause n="10.4">
              The Service Provider reserves the right to amend these User Terms and Conditions
              unilaterally. By accessing or using the Service, the User confirms their acceptance of
              and agreement to these User Terms and Conditions.
            </Clause>
          </section>

          <section>
            <p className="text-sm text-text-light">
              See also our{" "}
              <Link href="/privacy-policy" className="text-blue-primary font-semibold hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/data-protection-policy"
                className="text-blue-primary font-semibold hover:underline"
              >
                Data Protection Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
