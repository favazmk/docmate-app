"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, CalendarDays, Clock, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

export default function BookingWizard({ doctor }: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dates = [
    { day: "Mon", date: "12", fullDate: "Mon, 12 Oct 2026", available: true },
    { day: "Tue", date: "13", fullDate: "Tue, 13 Oct 2026", available: true },
    { day: "Wed", date: "14", fullDate: "Wed, 14 Oct 2026", available: false },
    { day: "Thu", date: "15", fullDate: "Thu, 15 Oct 2026", available: true },
    { day: "Fri", date: "16", fullDate: "Fri, 16 Oct 2026", available: true },
  ];
  const times = ["09:00 AM", "09:30 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+971");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [insurance, setInsurance] = useState("");

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
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
        date: dates[selectedDate].fullDate,
        timeSlot: times[selectedTime || 0],
        patientName: name,
        patientEmail: email,
        patientPhone: `${phonePrefix} ${phone}`,
        reason: reason,
      });

      if (result.success) {
        setStep(3);
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
      {step < 3 && (
        <div className="mb-6 flex items-center">
          <Link href={`/doctors/${doctor.slug}`} className="flex items-center text-text-mid hover:text-blue-primary font-medium text-sm transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Profile
          </Link>
        </div>
      )}

      {/* Steps Progress */}
      {step < 3 && (
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-border -z-10 rounded-full"></div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-primary -z-10 rounded-full transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-blue-primary text-white border-4 border-gray-bg">1</div>
            <span className="text-xs font-bold text-blue-primary uppercase tracking-wider">Date & Time</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-4 border-gray-bg transition-colors ${step >= 2 ? 'bg-blue-primary text-white' : 'bg-white text-text-light border-gray-border'}`}>2</div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-blue-primary' : 'text-text-light'}`}>Patient Details</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-4 border-gray-bg transition-colors ${step === 3 ? 'bg-blue-primary text-white' : 'bg-white text-text-light border-gray-border'}`}>3</div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step === 3 ? 'text-blue-primary' : 'text-text-light'}`}>Done</span>
          </div>
        </div>
      )}

      {/* Doctor Summary Card */}
      {step < 3 && (
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

      {/* Step 1: Select Date & Time */}
      {step === 1 && (
        <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-primary" />
            Select Date & Time
          </h3>
          
          <div className="mb-8">
            <h4 className="font-semibold text-text-dark text-sm mb-3">Available Dates</h4>
            <div className="flex justify-between gap-2 overflow-x-auto pb-2">
              {dates.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => d.available && setSelectedDate(i)}
                  disabled={!d.available}
                  className={`flex flex-col items-center justify-center w-16 h-20 rounded-xl border shrink-0 ${
                    !d.available 
                      ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed opacity-50" 
                      : selectedDate === i 
                        ? "bg-blue-primary border-blue-primary text-white shadow-md shadow-blue-primary/20" 
                        : "bg-white border-gray-border text-text-dark hover:border-blue-primary hover:bg-blue-light/50"
                  } transition-all`}
                >
                  <span className="text-xs uppercase font-semibold mb-1">{d.day}</span>
                  <span className="text-xl font-bold leading-tight">{d.date}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-semibold text-text-dark text-sm mb-3">Available Slots on {dates[selectedDate].fullDate}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {times.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedTime(i)}
                  className={`py-3 px-2 text-sm font-semibold rounded-xl border ${
                    selectedTime === i 
                      ? "bg-blue-primary border-blue-primary text-white shadow-md shadow-blue-primary/20" 
                      : "bg-white border-gray-border text-text-mid hover:border-blue-primary hover:text-blue-primary hover:bg-blue-light/50"
                  } transition-all`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-border">
            <Button 
              type="button"
              onClick={handleNextStep} 
              disabled={selectedTime === null}
              className="bg-blue-primary hover:bg-blue-hover text-white h-12 px-8 rounded-xl font-bold text-base w-full sm:w-auto shadow-md shadow-blue-primary/20 disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Patient Details */}
      {step === 2 && (
        <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-text-dark flex items-center gap-2">
              Patient Details
            </h3>
            <div className="bg-blue-light text-blue-primary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {times[selectedTime || 0]} on {dates[selectedDate].date} Oct
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleConfirmBooking} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-dark">Full Name <span className="text-red-500">*</span></label>
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
                <label className="text-sm font-semibold text-text-dark">Email <span className="text-red-500">*</span></label>
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
                <label className="text-sm font-semibold text-text-dark">Phone Number <span className="text-red-500">*</span></label>
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-dark">Insurance Provider (Optional)</label>
              <select 
                value={insurance}
                onChange={e => setInsurance(e.target.value)}
                className="w-full appearance-none bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary"
              >
                <option value="">Select insurance</option>
                <option value="daman">Daman</option>
                <option value="axa">AXA</option>
                <option value="bupa">Bupa</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold text-text-dark">Reason for Visit (Optional)</label>
              <textarea 
                rows={3} 
                placeholder="Briefly describe your symptoms..." 
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-gray-bg border border-gray-border rounded-xl p-4 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary resize-none"
              ></textarea>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-border">
              <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-text-mid hover:text-text-dark">
                Back
              </button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-primary hover:bg-blue-hover text-white h-12 px-8 rounded-xl font-bold text-base w-full sm:w-auto shadow-md shadow-blue-primary/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="bg-white border border-gray-border rounded-2xl p-8 md:p-12 shadow-sm text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-badge-bg rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-badge" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-4">Booking Confirmed!</h2>
          <p className="text-text-mid mb-8 max-w-md mx-auto">
            We've sent a confirmation email with your appointment details. The clinic will be expecting you.
          </p>

          <div className="bg-gray-bg rounded-2xl p-6 w-full max-w-sm mb-8 text-left border border-gray-border">
            <h4 className="font-bold text-text-dark mb-4 border-b border-gray-border pb-3">Appointment Summary</h4>
            
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs font-semibold text-text-light uppercase tracking-wider block mb-1">Doctor</span>
                <span className="text-sm font-bold text-text-dark">{doctor.name}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-light uppercase tracking-wider block mb-1">Date & Time</span>
                <span className="text-sm font-bold text-blue-primary">{dates[selectedDate].fullDate} at {times[selectedTime || 0]}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-light uppercase tracking-wider block mb-1">Location</span>
                <span className="text-sm font-bold text-text-dark leading-tight block">{doctor.clinicName}, {doctor.city}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button variant="outline" className="border-2 border-gray-border text-text-dark hover:bg-gray-bg h-12 px-8 rounded-xl font-bold">
              Add to Calendar
            </Button>
            <Button asChild className="bg-blue-primary hover:bg-blue-hover text-white h-12 px-8 rounded-xl font-bold shadow-md shadow-blue-primary/20">
              <Link href="/dashboard">View Appointments</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
