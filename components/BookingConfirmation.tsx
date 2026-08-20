"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, CalendarDays, MapPin, Sparkles, Phone, CalendarCheck, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { readBookingConfirmation, type BookingConfirmationDetails } from "@/lib/bookingConfirmation";

/**
 * Tell Google Tag Manager a booking request actually went through.
 *
 * The page-view goal on /booking-confirmed is what the ads team asked for, but
 * a page view also fires when someone reloads or returns to this URL. This
 * event fires only on the hop straight from the booking form, so it is the
 * more precise of the two signals and worth having available.
 *
 * No patient details go in it: the privacy policy promises that the name,
 * email, phone, and reason for visit are never transmitted to Google.
 */
function pushBookingConversion(details: BookingConfirmationDetails) {
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "booking_confirmed",
    doctorSlug: details.doctorSlug,
    doctorSpecialty: details.doctorSpecialty,
    clinicId: details.clinicId,
    clinicCity: details.clinicCity,
    // Deliberately no appointment ID. Google Ads can use one to de-duplicate
    // conversions, but the privacy policy states that analytics data is not
    // linked to the appointment requests submitted — add it only if that
    // wording is revised first.
  });
}

export default function BookingConfirmation() {
  // sessionStorage is unavailable while the page is server-rendered, so the
  // details arrive on the first client render rather than in the initial HTML.
  const [details, setDetails] = useState<BookingConfirmationDetails | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = readBookingConfirmation();
    setDetails(stored);
    setIsLoaded(true);
    // Only a real booking fires the conversion event. Someone who bookmarks
    // this URL or opens it in a fresh tab has no stored details and must not
    // register as a second conversion.
    if (stored) pushBookingConversion(stored);
  }, []);

  if (!isLoaded) {
    return <div className="min-h-[60vh]" />;
  }

  const trackHref = details?.isLoggedIn ? "/dashboard" : "/track";
  const trackLabel = details?.isLoggedIn ? "View Dashboard" : "Track Booking";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-border/60 bg-white shadow-[0_24px_64px_-20px_rgba(26,18,100,0.28)] animate-in fade-in zoom-in duration-500">
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-primary via-blue-mid to-blue-primary" />

      <div className="flex flex-col items-center p-8 text-center md:p-12">
        <div className="relative mb-6">
          <div className="absolute inset-0 scale-150 rounded-full bg-green-badge/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-green-badge/20 bg-gradient-to-br from-green-badge-bg to-white shadow-lg shadow-green-badge/15">
            <CheckCircle2 className="h-10 w-10 text-green-badge" />
          </div>
        </div>

        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-primary/15 bg-blue-primary/8 px-3 py-1 text-caption font-bold uppercase tracking-[0.06em] text-blue-primary">
          <Sparkles className="h-3.5 w-3.5" /> Request confirmed
        </span>

        <h2 className="mb-4 text-2xl font-bold text-text-dark md:text-3xl">Appointment Request Received!</h2>

        {details ? (
          <p className="mx-auto mb-10 max-w-lg text-text-mid">
            Your booking request has been successfully submitted. A representative from <span className="font-semibold text-text-dark">{details.clinicName}</span> will contact you shortly at <span className="font-semibold text-text-dark">{details.patientPhone}</span> to schedule and finalize your appointment time.
          </p>
        ) : (
          // Reached by reloading in a new tab, or by opening the URL directly.
          // The appointment itself is safe in the database either way.
          <p className="mx-auto mb-10 max-w-lg text-text-mid">
            Your booking request has been successfully submitted. A representative from the clinic will contact you shortly on the number you provided to schedule and finalize your appointment time.
          </p>
        )}

        {details && (
          <div className="mb-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-border/60 text-left shadow-sm">
            <div className="flex items-center gap-4 border-b border-gray-border/60 bg-white p-5">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-border bg-gray-bg">
                <Image src={details.doctorPhotoUrl} alt={details.doctorName} fill className="object-cover" />
              </div>
              <div>
                <span className="mb-0.5 block text-xs font-semibold uppercase tracking-wider text-text-light">Doctor</span>
                <span className="text-base font-bold leading-tight text-text-dark">{details.doctorName}</span>
                <span className="mt-0.5 block text-xs font-semibold text-blue-primary">{details.doctorSpecialty}</span>
              </div>
            </div>

            <div className="divide-y divide-gray-border/60 bg-gray-bg">
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-primary shadow-sm">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-text-light">Preferred Date</span>
                  <span className="text-sm font-bold text-text-dark">{details.appointmentDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-primary shadow-sm">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-text-light">Location</span>
                  <span className="block text-sm font-bold leading-tight text-text-dark">
                    {details.clinicName}, {details.clinicCity}
                  </span>
                </div>
              </div>
            </div>
            {details.bookingId && (
              <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-border/60">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-primary shadow-sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-text-light">Booking ID</span>
                  <span className="block text-sm font-bold leading-tight text-text-dark font-mono bg-blue-50 px-2 py-0.5 rounded text-blue-800 border border-blue-100">{details.bookingId.substring(0, 8).toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* What happens next */}
        <div className="mb-10 w-full max-w-md">
          <h4 className="mb-6 text-left text-xs font-bold uppercase tracking-wider text-text-light">What happens next</h4>
          <div className="relative flex justify-between">
            <div className="absolute left-4 right-4 top-4 h-0.5 bg-gray-border" />
            <div className="absolute left-4 top-4 h-0.5 bg-blue-primary/40" style={{ width: "calc(50% - 1rem)" }} />
            {[
              { icon: Check, label: "Request received", state: "done" },
              { icon: Phone, label: "Clinic calls you", state: "active" },
              { icon: CalendarCheck, label: "Appointment confirmed", state: "upcoming" },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex w-20 flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step.state === "done"
                      ? "border-blue-primary bg-blue-primary text-white"
                      : step.state === "active"
                        ? "border-blue-primary bg-white text-blue-primary"
                        : "border-gray-border bg-white text-text-light"
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <span className={`text-[11px] font-semibold leading-tight ${step.state === "upcoming" ? "text-text-light" : "text-text-dark"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full justify-center gap-4">
          <Link href="/" className={`${buttonVariants({ variant: "outline" })} h-12 rounded-xl border-2 border-gray-border px-8 font-bold text-text-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-bg`}>
            Back to Home
          </Link>
          <Link href={trackHref} className={`${buttonVariants()} h-12 rounded-xl bg-blue-primary px-8 font-bold text-white shadow-md shadow-blue-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-hover hover:shadow-lg`}>
            {trackLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
