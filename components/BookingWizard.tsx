"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, CalendarDays, MapPin, Loader2, Calendar, ChevronRight } from "lucide-react";
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
    <div className="max-w-3xl mx-auto">
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

          <form onSubmit={handleConfirmBooking} className="flex flex-col gap-6">
            
            {/* Custom Interactive Calendar Grid */}
            <div>
              <label className="text-sm font-bold text-text-dark mb-3 block flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-primary" />
                Select Appointment Date
              </label>
              
              <div className="border border-gray-border rounded-2xl p-4 max-w-sm mx-auto sm:mx-0 bg-white">
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

            <div className="h-px bg-gray-border my-1"></div>

            {/* Contact Details Fields */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
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
              
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex flex-col gap-2 flex-1">
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
                <div className="flex flex-col gap-2 flex-1">
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

              <div className="flex flex-col gap-2 mb-2">
                <label className="text-sm font-bold text-text-dark">Reason for Visit (Optional)</label>
                <textarea 
                  rows={3} 
                  placeholder="Briefly describe your symptoms..." 
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full bg-gray-bg border border-gray-border rounded-xl p-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary resize-none"
                ></textarea>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-border">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-primary hover:bg-blue-hover text-white h-12 px-8 rounded-xl font-bold text-base w-full shadow-md shadow-blue-primary/20 flex items-center justify-center gap-2"
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
            </div>
          </form>
        </div>
      ) : (
        /* Confirmation Step */
        <div className="bg-white border border-gray-border rounded-2xl p-8 md:p-12 shadow-sm text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-badge-bg rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-badge" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-4">Appointment Request Received!</h2>
          <p className="text-text-mid mb-8 max-w-lg mx-auto">
            Your booking request has been successfully submitted. A representative from <span className="font-semibold text-text-dark">{doctor.clinicName}</span> will contact you shortly at <span className="font-semibold text-text-dark">{phonePrefix} {phone}</span> to schedule and finalize your appointment time.
          </p>

          <div className="bg-gray-bg rounded-2xl p-6 w-full max-w-sm mb-8 text-left border border-gray-border">
            <h4 className="font-bold text-text-dark mb-4 border-b border-gray-border pb-3">Booking Summary</h4>
            
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs font-semibold text-text-light uppercase tracking-wider block mb-1">Doctor</span>
                <span className="text-sm font-bold text-text-dark">{doctor.name}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-light uppercase tracking-wider block mb-1">Preferred Date</span>
                <span className="text-sm font-bold text-blue-primary">{formatAppointmentDate(selectedDate)}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-light uppercase tracking-wider block mb-1">Time Slot</span>
                <span className="text-sm font-bold text-text-mid italic">Pending Call Confirmation</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-light uppercase tracking-wider block mb-1">Location</span>
                <span className="text-sm font-bold text-text-dark leading-tight block">{doctor.clinicName}, {doctor.city}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full justify-center">
            <Link href="/" className={`${buttonVariants({ variant: "outline" })} border-2 border-gray-border text-text-dark hover:bg-gray-bg h-12 px-8 rounded-xl font-bold`}>
              Back to Home
            </Link>
            <Link href="/dashboard" className={`${buttonVariants()} bg-blue-primary hover:bg-blue-hover text-white h-12 px-8 rounded-xl font-bold shadow-md shadow-blue-primary/20`}>
              View Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
