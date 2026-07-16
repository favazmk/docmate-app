export const dynamic = "force-static";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-border p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-extrabold text-text-dark mb-2">Terms and Conditions</h1>
        <p className="text-sm text-text-light mb-8">Last Updated: July 4, 2026</p>

        <div className="prose prose-blue text-text-mid max-w-none flex flex-col gap-6 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">1. Agreement to Terms</h2>
            <p>
              Welcome to Docmate. By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">2. Scope of Services</h2>
            <p>
              Docmate acts exclusively as a directory and booking platform connecting patients with medical clinics and healthcare practitioners in Dubai. We do not provide medical services, professional medical advice, diagnosis, or treatment. Any medical consult, booking confirmation, or scheduling is the sole responsibility of the respective healthcare provider.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">3. Booking and Contact Information</h2>
            <p>
              When requesting an appointment on Docmate, you agree to provide accurate, current, and complete contact details (your name, email address, phone number, and optional symptoms or reasons for your visit). 
              Our platform shares this information with the chosen clinic or hospital (e.g., King's College Hospital London - Dubai) who will contact you directly to schedule, confirm, or modify your appointment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">4. Disclaimers and Limitation of Liability</h2>
            <p>
              Docmate makes no representations or warranties regarding the availability, credentials, qualifications, or quality of care of any doctor listed on the platform. 
              Under no circumstances shall Docmate or its affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from your healthcare choices, appointments booked through the platform, or interactions with medical staff.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">5. UAE Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of Dubai and the federal laws of the United Arab Emirates. Any dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the Dubai Courts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-dark mb-2">6. Modifications to Terms</h2>
            <p>
              Docmate reserves the right to revise these Terms and Conditions at any time. Your continued use of the platform following the posting of modifications constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
