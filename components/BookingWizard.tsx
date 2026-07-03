"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, CalendarDays, MapPin, Loader2, PhoneCall, Info } from "lucide-react";
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

  // Dynamically generate the next 5 weekdays
  const dates = useMemo(() => {
    const list = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const current = new Date();
    let count = 0;
    while (list.length < 5 && count < 10) {
      current.setDate(current.getDate() + 1);
      const dayIndex = current.getDay();
      
      // Skip Saturday (6) and Sunday (0) for preferred weekdays
      if (dayIndex === 0 || dayIndex === 6) {
        continue;
      }
      
      const dayName = daysOfWeek[dayIndex];
      const dateNum = current.getDate();
      const monthName = months[current.getMonth()];
      const year = current.getFullYear();
      
      list.push({
        day: dayName,
        date: String(dateNum),
        fullDate: `${dayName}, ${dateNum} ${monthName} ${year}`,
        available: true
      });
      count++;
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState(0);

  // Form Fields
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phonePrefix, setPhonePrefix] = useState("+971");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");

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
        date: dates[selectedDate].fullDate,
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
              <PhoneCall className="w-5.5 h-5.5 text-blue-primary" />
              Request Appointment Call
            </h3>
            <p className="text-sm text-text-mid">
              Select your preferred date and enter your contact details. A hospital representative will call you to finalize your slot.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleConfirmBooking} className="flex flex-col gap-6">
            {/* Preferred Date Selector */}
            <div>
              <label className="text-sm font-bold text-text-dark mb-3 block flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-blue-primary" />
                Select Preferred Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedDate(i)}
                    className={`flex flex-col items-center justify-center w-16 h-20 rounded-xl border shrink-0 transition-all ${
                      selectedDate === i 
                        ? "bg-blue-primary border-blue-primary text-white shadow-md shadow-blue-primary/20" 
                        : "bg-white border-gray-border text-text-dark hover:border-blue-primary hover:bg-blue-light/50"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold mb-1">{d.day}</span>
                    <span className="text-xl font-bold leading-tight">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Notice */}
            <div className="bg-blue-light/40 border border-blue-primary/10 rounded-xl p-4 flex gap-3 text-blue-primary">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                <span className="block font-bold mb-0.5">How the appointment process works:</span>
                Since doctor calendars update in real-time, you are requesting a callback. A coordinator from <span className="underline">{doctor.clinicName}</span> will contact you to verify free slots and finalize your exact time.
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
                  readOnly={!!user?.name}
                  className={`w-full border border-gray-border rounded-xl h-12 px-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary ${user?.name ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-bg'}`} 
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
                    readOnly={!!user?.email}
                    className={`w-full border border-gray-border rounded-xl h-12 px-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary ${user?.email ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-bg'}`} 
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
                    Submitting Request...
                  </>
                ) : (
                  "Request Call to Confirm"
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
          
          <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-4">Request Submitted!</h2>
          <p className="text-text-mid mb-8 max-w-lg mx-auto">
            Your booking request has been forwarded. A representative from <span className="font-semibold text-text-dark">{doctor.clinicName}</span> will call you shortly at <span className="font-semibold text-text-dark">{phonePrefix} {phone}</span> to finalize your appointment time.
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
                <span className="text-sm font-bold text-blue-primary">{dates[selectedDate].fullDate}</span>
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
