"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, CalendarDays, MapPin, Loader2, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAppointment } from "@/app/actions/booking";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { saveBookingConfirmation } from "@/lib/bookingConfirmation";

interface BookingWizardProps {
  doctor: {
    slug: string;
    name: string;
    specialty: string;
    photoUrl: string;
    clinics: {
      id: string;
      name: string;
      city: string;
      hospitalGroup?: {
        name: string;
      };
    }[];
  };
  user?: {
    name: string;
    email: string;
  };
}

export default function BookingWizard({ doctor, user }: BookingWizardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(
    doctor.clinics.length === 1 ? doctor.clinics[0].id : null
  );

  const selectedClinic = useMemo(() => {
    if (!selectedClinicId) return null;
    return doctor.clinics.find(c => c.id === selectedClinicId) || null;
  }, [selectedClinicId, doctor.clinics]);

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
        clinicId: selectedClinicId || undefined,
      });

      if (result.success) {
        saveBookingConfirmation({
          doctorName: doctor.name,
          doctorSlug: doctor.slug,
          doctorSpecialty: doctor.specialty,
          doctorPhotoUrl: doctor.photoUrl,
          clinicId: selectedClinic?.id,
          clinicName: selectedClinic?.name || doctor.clinics[0]?.name || "the clinic",
          clinicCity: selectedClinic?.city || doctor.clinics[0]?.city || "",
          appointmentDate: formatAppointmentDate(selectedDate),
          patientPhone: `${phonePrefix} ${phone}`,
          bookingId: result.appointmentId || "",
          isLoggedIn: !!user,
        });
        // A full document load, not router.push: it makes /booking-confirmed a
        // real page view, which is what the Google Ads conversion goal counts.
        // A client-side route change would not fire one.
        window.location.assign("/booking-confirmed");
        return;
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
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link href={`/doctors/${doctor.slug}`} className="flex items-center text-text-mid hover:text-blue-primary font-medium text-sm transition-colors w-fit">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Profile
        </Link>
        
        {selectedClinicId && doctor.clinics.length > 1 && (
          <button 
            onClick={() => setSelectedClinicId(null)}
            className="flex items-center text-blue-primary hover:underline font-medium text-sm transition-colors w-fit"
          >
            Change Clinic
          </button>
        )}
      </div>

      {/* Doctor Summary Card */}
      <div className="bg-white border border-gray-border rounded-2xl p-4 flex items-center gap-4 mb-8 shadow-sm">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-border bg-gray-bg">
          <Image src={doctor.photoUrl} alt={doctor.name} fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-dark leading-tight mb-1">{doctor.name}</h2>
          <p className="text-sm font-medium text-blue-primary">{doctor.specialty}</p>
          {selectedClinic && (
            <div className="flex items-center gap-1 mt-1 text-xs text-text-mid font-medium">
              <MapPin className="w-3.5 h-3.5 text-text-light" /> {selectedClinic.hospitalGroup?.name} - {selectedClinic.name}, {selectedClinic.city}
            </div>
          )}
        </div>
      </div>

      {/* Clinic Selection Step */}
      {!selectedClinicId && (
        <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-dark mb-2 flex items-center gap-2">
              <MapPin className="w-5.5 h-5.5 text-blue-primary" />
              Select a Clinic
            </h3>
            <p className="text-sm text-text-mid">
              Please select the clinic branch where you would like to book your appointment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctor.clinics.map(clinic => (
              <div 
                key={clinic.id} 
                onClick={() => setSelectedClinicId(clinic.id)}
                className="border border-gray-border rounded-xl p-5 hover:border-blue-primary hover:shadow-md cursor-pointer transition-all bg-gray-50 hover:bg-blue-light/20 flex flex-col gap-1"
              >
                <h4 className="font-bold text-text-dark text-base">{clinic.hospitalGroup?.name}</h4>
                <p className="font-semibold text-text-mid text-sm">{clinic.name}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-text-light font-medium">
                  <MapPin className="w-3.5 h-3.5" /> {clinic.city}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Form Step */}
      {selectedClinicId && (
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
                  <div className="flex gap-2">
                    <div className="w-[120px] shrink-0">
                      <CustomDropdown 
                        value={phonePrefix}
                        onChange={setPhonePrefix}
                        options={["+971", "+966", "+965"]}
                        placeholder="Prefix"
                      />
                    </div>
                    <input 
                      type="tel" 
                      required
                      placeholder="50 123 4567" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary" 
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-gray-border mt-auto flex flex-col gap-3">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
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
                
                <p className="text-[11px] text-center text-text-light font-medium leading-relaxed px-4">
                  By booking, you agree to our{" "}
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
                </p>

                <div className="flex items-center justify-center gap-1.5 text-text-light">
                  <CheckCircle2 className="w-4 h-4 text-green-badge" />
                  <span className="text-xs font-semibold">Zero Booking Fee</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
