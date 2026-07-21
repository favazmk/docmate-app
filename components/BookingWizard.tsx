"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, CalendarDays, MapPin, Loader2, Calendar, ChevronRight, Sparkles, Phone, CalendarCheck, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { createAppointment } from "@/app/actions/booking";

interface BookingWizardProps {
  doctor: {
    slug: string;
    name: string;
    specialty: string;
    photoUrl: string;
    clinicName: string;
    city: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

export default function BookingWizard({ doctor, user }: BookingWizardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth()); // 0-indexed

  // Form Fields (editable even if user metadata is present)
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phonePrefix, setPhonePrefix] = useState("+971");
  const [phone, setPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [reason, setReason] = useState("");

  // Month names helper
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeekShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Calendar Grid Generation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    
    // Padding for previous month days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(currentYear, currentMonth, d));
    }
    
    return days;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isDateInPast = (date: Date) => {
    const comparisonDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < comparisonDate;
  };

  const formatAppointmentDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthShorts = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]}, ${date.getDate()} ${monthShorts[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const result = await createAppointment({
        doctorSlug: doctor.slug,
        date: formatAppointmentDate(selectedDate),
        timeSlot: "Pending Phone Call",
        patientName: name,
        patientEmail: email,
        patientPhone: `${phonePrefix} ${phone}`,
        reason: reason,
      });

      if (result.success) {
        setBookingId(result.appointmentId || "");
        setIsConfirmed(true);
      } else {
        setErrorMsg(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the database. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header / Back */}
      {!isConfirmed && (
        <div className="mb-6 flex items-center">
          <Link href={`/doctors/${doctor.slug}`} className="flex items-center text-text-mid hover:text-blue-primary font-medium text-sm transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Profile
          </Link>
        </div>
      )}

      {/* Doctor Summary Card */}
      {!isConfirmed && (
        <div className="bg-white border border-gray-border rounded-2xl p-4 flex items-center gap-4 mb-8 shadow-sm">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-border bg-gray-bg">
            <Image src={doctor.photoUrl} alt={doctor.name} fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-dark leading-tight mb-1">{doctor.name}</h2>
            <p className="text-sm font-medium text-blue-primary">{doctor.specialty}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-text-mid font-medium">
              <MapPin className="w-3.5 h-3.5 text-text-light" /> {doctor.clinicName}, {doctor.city}
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Step */}
      {!isConfirmed ? (
        <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-text-dark mb-2 flex items-center gap-2">
              <CalendarDays className="w-5.5 h-5.5 text-blue-primary" />
              Book Appointment
            </h3>
            <p className="text-sm text-text-mid">
              Select your preferred appointment date and provide your contact information to finalize your request.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Calendar Selection */}
            <div className="md:col-span-6 flex flex-col">
              <label className="text-sm font-bold text-text-dark mb-3 flex items-center gap-1.5 select-none">
                <Calendar className="w-4 h-4 text-blue-primary" />
                Select Appointment Date
              </label>
              
              <div className="border border-gray-border rounded-2xl p-4 w-full bg-white">
                {/* Month Navigator */}
                <div className="flex items-center justify-between mb-4">
                  <button 
                    type="button" 
                    onClick={handlePrevMonth}
                    className="p-1.5 hover:bg-gray-bg rounded-lg text-text-mid hover:text-text-dark transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm text-text-dark select-none">
                    {months[currentMonth]} {currentYear}
                  </span>
                  <button 
                    type="button" 
                    onClick={handleNextMonth}
                    className="p-1.5 hover:bg-gray-bg rounded-lg text-text-mid hover:text-text-dark transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Weekdays Labels */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {daysOfWeekShort.map((day) => (
                    <span key={day} className="text-xs font-semibold text-text-light select-none">
                      {day}
                    </span>
                  ))}
                </div>
                
                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} />;
                    }
                    
                    const isSelected = selectedDate.getDate() === date.getDate() && 
                                       selectedDate.getMonth() === date.getMonth() && 
                                       selectedDate.getFullYear() === date.getFullYear();
                    const isPast = isDateInPast(date);
                    
                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        disabled={isPast}
                        onClick={() => setSelectedDate(date)}
                        className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all select-none ${
                          isPast 
                            ? "text-text-light/40 cursor-not-allowed font-medium" 
                            : isSelected 
                              ? "bg-blue-primary text-white shadow-md shadow-blue-primary/20 scale-105" 
                              : "text-text-dark hover:bg-blue-light/50 hover:text-blue-primary"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Contact Details Fields & Button */}
            <div className="md:col-span-6 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-text-dark">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary" 
                  />
                </div>
                
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-text-dark">Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary" 
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-text-dark">Phone Number <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <select 
                      value={phonePrefix}
                      onChange={e => setPhonePrefix(e.target.value)}
                      className="bg-gray-bg border border-gray-border border-r-0 rounded-l-xl h-12 px-3 text-sm font-medium text-text-dark focus:outline-none"
                    >
                      <option>+971</option>
                      <option>+966</option>
                      <option>+965</option>
                    </select>
                    <input 
                      type="tel" 
                      required
                      placeholder="50 123 4567" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-gray-bg border border-gray-border rounded-r-xl h-12 px-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary" 
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-gray-border mt-auto flex flex-col gap-3">
                <div className="flex items-start gap-2.5 px-0.5">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-primary focus:ring-blue-primary cursor-pointer accent-blue-primary" 
                  />
                  <label htmlFor="terms" className="text-xs text-text-mid font-medium cursor-pointer select-none leading-relaxed">
                    I agree to DocMate's{" "}
                    <Link 
                      href="/terms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-primary hover:underline font-semibold"
                    >
                      Terms &amp; Conditions
                    </Link>{" "}
                    and{" "}
                    <Link 
                      href="/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-primary hover:underline font-semibold"
                    >
                      Privacy Policy
                    </Link>.
                  </label>
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting || !acceptedTerms}
                  className="bg-blue-primary hover:bg-blue-hover disabled:opacity-50 disabled:cursor-not-allowed text-white h-12 px-8 rounded-xl font-bold text-base w-full shadow-md shadow-blue-primary/20 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Book Appointment"
                  )}
                </Button>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-text-light">
                  <CheckCircle2 className="w-4 h-4 text-green-badge" />
                  <span className="text-xs font-semibold">Zero Booking Fee</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* Confirmation Step */
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
            <p className="mx-auto mb-10 max-w-lg text-text-mid">
              Your booking request has been successfully submitted. A representative from <span className="font-semibold text-text-dark">{doctor.clinicName}</span> will contact you shortly at <span className="font-semibold text-text-dark">{phonePrefix} {phone}</span> to schedule and finalize your appointment time.
            </p>

            {/* Booking Summary */}
            <div className="mb-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-border/60 text-left shadow-sm">
              <div className="flex items-center gap-4 border-b border-gray-border/60 bg-white p-5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-border bg-gray-bg">
                  <Image src={doctor.photoUrl} alt={doctor.name} fill className="object-cover" />
                </div>
                <div>
                  <span className="mb-0.5 block text-xs font-semibold uppercase tracking-wider text-text-light">Doctor</span>
                  <span className="text-base font-bold leading-tight text-text-dark">{doctor.name}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-blue-primary">{doctor.specialty}</span>
                </div>
              </div>

              <div className="divide-y divide-gray-border/60 bg-gray-bg">
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-primary shadow-sm">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-text-light">Preferred Date</span>
                    <span className="text-sm font-bold text-text-dark">{formatAppointmentDate(selectedDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-primary shadow-sm">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-text-light">Location</span>
                    <span className="block text-sm font-bold leading-tight text-text-dark">{doctor.clinicName}, {doctor.city}</span>
                  </div>
                </div>
              </div>
              {bookingId && (
                <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-border/60">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-primary shadow-sm">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-text-light">Booking ID</span>
                    <span className="block text-sm font-bold leading-tight text-text-dark font-mono bg-blue-50 px-2 py-0.5 rounded text-blue-800 border border-blue-100">{bookingId.substring(0, 8).toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>

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
              {user ? (
                <Link href="/dashboard" className={`${buttonVariants()} h-12 rounded-xl bg-blue-primary px-8 font-bold text-white shadow-md shadow-blue-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-hover hover:shadow-lg`}>
                  View Dashboard
                </Link>
              ) : (
                <Link href="/track" className={`${buttonVariants()} h-12 rounded-xl bg-blue-primary px-8 font-bold text-white shadow-md shadow-blue-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-hover hover:shadow-lg`}>
                  Track Booking
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
