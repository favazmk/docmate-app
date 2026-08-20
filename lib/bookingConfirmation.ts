/**
 * The booking confirmation lives at one fixed URL, /booking-confirmed, so that
 * Google Ads can use a single page-view conversion goal instead of one per
 * doctor. The details shown on it therefore have to survive the hop from
 * /book/<doctor-slug>, and they travel through sessionStorage rather than the
 * query string.
 *
 * That choice is deliberate: the confirmation names the patient's phone number,
 * and the privacy policy promises that phone numbers are never transmitted to
 * Google. Anything in the URL reaches Google Analytics as the page path, so the
 * details cannot ride along there. sessionStorage stays in the browser tab.
 *
 * Reading the appointment back out of the database by its booking ID was the
 * other option, and was rejected: it would put a patient's name and phone
 * number behind a guessable eight-character URL.
 */
export const BOOKING_CONFIRMATION_KEY = "docmate:lastBooking";

export interface BookingConfirmationDetails {
  doctorName: string;
  doctorSlug: string;
  doctorSpecialty: string;
  doctorPhotoUrl: string;
  clinicId?: string;
  clinicName: string;
  clinicCity: string;
  /** Already formatted for display, e.g. "Fri, 21 Aug 2026". */
  appointmentDate: string;
  /** Shown back to the patient as the number the clinic will call. */
  patientPhone: string;
  bookingId: string;
  /** Decides whether the page offers "View Dashboard" or "Track Booking". */
  isLoggedIn: boolean;
}

export function saveBookingConfirmation(details: BookingConfirmationDetails): void {
  try {
    sessionStorage.setItem(BOOKING_CONFIRMATION_KEY, JSON.stringify(details));
  } catch {
    // Private browsing modes and full storage quotas both throw here. The
    // booking is already saved server-side, so the worst case is the generic
    // confirmation instead of the itemised one — never a lost appointment.
  }
}

export function readBookingConfirmation(): BookingConfirmationDetails | null {
  try {
    const raw = sessionStorage.getItem(BOOKING_CONFIRMATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookingConfirmationDetails;
    return parsed && typeof parsed.doctorName === "string" ? parsed : null;
  } catch {
    return null;
  }
}
