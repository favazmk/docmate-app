import type { Metadata } from "next";
import BookingConfirmation from "@/components/BookingConfirmation";

/**
 * The single confirmation URL for every doctor.
 *
 * Booking used to confirm in place on /book/<doctor-slug>, which meant the URL
 * was identical before and after submitting and differed per doctor — nothing
 * Google Ads could hang a page-view conversion goal on. Every successful
 * booking now lands here instead, so the ads team has one fixed destination:
 * https://docmate.ae/booking-confirmed
 *
 * noindex because this page is meaningless to a search visitor, and because an
 * indexed confirmation URL collects organic hits that would count as
 * conversions.
 */
export const metadata: Metadata = {
  title: "Appointment Request Received | Doc Mate",
  description: "Your appointment request has been submitted. The clinic will contact you shortly.",
  robots: { index: false, follow: false },
};

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <BookingConfirmation />
      </div>
    </div>
  );
}
