"use client";

import { CheckCircle2, TrendingUp, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { submitClinicRequest } from "@/app/actions/contact";
import CustomDropdown from "@/components/ui/CustomDropdown";

// Sample day behind the hero illustration. Initials only — it is a mock-up of
// the product, and a fake schedule should never look like real patient records.
const DAY_SHEET: { time: string; patient?: string; note?: string; state: "confirmed" | "open" | "new" }[] = [
  { time: "09:00", patient: "A. K.", note: "Follow-up", state: "confirmed" },
  { time: "09:30", patient: "M. R.", note: "New patient", state: "confirmed" },
  { time: "10:00", state: "open" },
  { time: "10:30", patient: "S. A.", note: "Booked on Docmate", state: "new" },
  { time: "11:00", patient: "H. B.", note: "Reminder sent", state: "confirmed" },
];

const CITY_SUGGESTIONS = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
  "Al Ain",
];

export default function ListYourClinicPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState("Doctor");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitClinicRequest(formData);
    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero */}
      {/* The right-hand column used to be a grey skeleton dashboard, which read
          as a page that had failed to load. It is now a clinic day sheet — the
          artifact this product actually replaces — so the hero shows the pitch
          made below it (new patients, fewer no-shows, a fuller schedule)
          instead of only stating it. */}
      <section className="relative overflow-hidden bg-blue-primary px-4 pt-16 pb-32 md:pt-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,rgba(235,235,224,0.13),transparent_46%),radial-gradient(circle_at_4%_0%,rgba(235,235,224,0.07),transparent_38%)]"
        />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-16 relative z-10">
          <div className="w-full lg:w-[54%] text-center lg:text-left">
            <span className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-caption font-medium uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-star-color" />
              For clinics &amp; hospitals
            </span>

            <h1 className="hero-title mt-6 mb-6 text-display font-bold text-white">
              Grow your practice with Docmate
            </h1>

            <p className="hero-subtitle text-white/70 text-lg md:text-xl leading-relaxed mb-9 max-w-xl mx-auto lg:mx-0">
              Join thousands of healthcare providers in Dubai who are reaching more patients, reducing no-shows, and streamlining their bookings.
            </p>

            <div
              className="hero-subtitle flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              style={{ animationDelay: "0.85s" }}
            >
              <Button
                onClick={() => document.getElementById("clinic-form")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-white hover:bg-gray-bg text-blue-primary h-14 px-8 rounded-xl font-bold text-base shadow-lg shadow-black/20"
              >
                Register Your Clinic
              </Button>
              <Button
                onClick={() => document.getElementById("clinic-form")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white h-14 px-8 rounded-xl font-bold text-base"
              >
                Talk to Sales
              </Button>
            </div>
          </div>

          {/* Illustrative only — hidden from assistive tech so a sample schedule
              is never announced as real appointments. */}
          <div aria-hidden="true" className="w-full lg:w-[46%] hidden md:block">
            <div
              className="anim-hidden anim-fade-scale rounded-[20px] border border-white/15 bg-white/[0.07] p-2 shadow-2xl shadow-black/30 backdrop-blur-sm"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="rounded-2xl bg-white px-6 py-5">

                <div className="flex items-baseline justify-between border-b border-gray-border pb-4">
                  <div>
                    <p className="text-caption font-semibold uppercase tracking-[0.12em] text-text-light">Today</p>
                    <p className="text-subheading font-bold text-text-dark">Your clinic schedule</p>
                  </div>
                  <span className="rounded-full bg-blue-primary/[0.07] px-3 py-1 text-caption font-semibold text-blue-primary">
                    Thu 12
                  </span>
                </div>

                <ul className="flex flex-col divide-y divide-gray-border/70">
                  {DAY_SHEET.map((slot, i) => (
                    <li
                      key={slot.time}
                      className={`${slot.state === "new" ? "day-slot-new" : "day-slot"} flex items-center gap-4 py-3.5`}
                      style={{ animationDelay: `${0.75 + i * 0.13}s` }}
                    >
                      <span className="w-12 shrink-0 text-secondary font-semibold tabular-nums text-text-light">
                        {slot.time}
                      </span>

                      <span
                        className={`h-9 w-[3px] shrink-0 rounded-full ${
                          slot.state === "open"
                            ? "bg-gray-border"
                            : slot.state === "new"
                              ? "bg-star-color"
                              : "bg-green-badge/70"
                        }`}
                      />

                      {slot.state === "open" ? (
                        <span className="text-secondary font-medium text-text-light">Open slot</span>
                      ) : (
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <span className="min-w-0">
                            <span className="block text-secondary font-semibold text-text-dark">{slot.patient}</span>
                            <span className="block text-caption text-text-mid">{slot.note}</span>
                          </span>
                          {slot.state === "new" ? (
                            <span className="day-ping shrink-0 rounded-full bg-star-color/15 px-2.5 py-1 text-caption font-bold text-[#B45309]">
                              New
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-green-badge-bg px-2.5 py-1 text-caption font-semibold text-green-badge">
                              Confirmed
                            </span>
                          )}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="day-now mt-1 flex items-center gap-2" style={{ animationDelay: "1.5s" }}>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-primary" />
                  <span className="h-px flex-1 bg-blue-primary/25" />
                  <span className="text-caption font-semibold uppercase tracking-[0.1em] text-blue-primary/60">Now</span>
                </div>

                <p className="mt-4 border-t border-gray-border pt-4 text-caption font-medium text-text-mid">
                  4 booked · 1 slot left · reminders sent automatically
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-border rounded-2xl p-8 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-light text-blue-primary rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text-dark mb-3">Reach New Patients</h3>
            <p className="text-text-mid leading-relaxed">
              Get discovered by millions of patients searching for your specialty in your exact location every month.
            </p>
          </div>
          <div className="bg-white border border-gray-border rounded-2xl p-8 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-light text-blue-primary rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text-dark mb-3">Reduce No-Shows</h3>
            <p className="text-text-mid leading-relaxed">
              Automated SMS and email reminders ensure patients show up. Easily fill last-minute cancellations.
            </p>
          </div>
          <div className="bg-white border border-gray-border rounded-2xl p-8 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-light text-blue-primary rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text-dark mb-3">Grow Revenue</h3>
            <p className="text-text-mid leading-relaxed">
              Optimize your schedule, build your online reputation with verified reviews, and increase your overall clinic revenue.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="clinic-form" className="py-20 px-4 bg-transparent border-t border-gray-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-dark mb-4">Request an Invitation</h2>
            <p className="text-text-mid text-lg">
              Leave your details below and our partnership team will be in touch within 24 hours to set up your clinic profile.
            </p>
          </div>

          <div className="bg-white border border-gray-border rounded-3xl p-8 md:p-12 shadow-sm">
            {success && (
              <div className="mb-8 bg-green-badge-bg border border-green-badge text-green-badge px-6 py-4 rounded-xl flex flex-col items-center text-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-green-badge mb-2" />
                <h3 className="font-bold text-lg">Request Submitted Successfully!</h3>
                <p>Thank you for your interest in Docmate. Our partnership team will be in touch with you shortly.</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">Clinic/Hospital Name <span className="text-red-500">*</span></label>
                  <input required name="clinicName" type="text" placeholder="e.g. Mediclinic" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="clinic-city" className="text-sm font-semibold text-text-dark">City <span className="text-red-500">*</span></label>
                  {/* Free text, not a fixed list: clinics outside the eight cities we
                      used to hardcode were dropping out of the form here. The datalist
                      keeps the common ones one keystroke away without limiting anyone. */}
                  <input
                    required
                    id="clinic-city"
                    name="city"
                    type="text"
                    list="clinic-city-options"
                    autoComplete="address-level2"
                    placeholder="e.g. Dubai"
                    className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors"
                  />
                  <datalist id="clinic-city-options">
                    {CITY_SUGGESTIONS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">Contact Person <span className="text-red-500">*</span></label>
                  <input required name="contactPerson" type="text" placeholder="Full Name" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">Role <span className="text-red-500">*</span></label>
                  <CustomDropdown
                    value={role}
                    onChange={setRole}
                    options={["Doctor", "Clinic Manager", "Owner", "Other"]}
                    placeholder="Select Role"
                  />
                  <input type="hidden" name="role" value={role} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">Email Address <span className="text-red-500">*</span></label>
                  <input required name="email" type="email" placeholder="work@clinic.com" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">Phone Number <span className="text-red-500">*</span></label>
                  <input required name="phone" type="tel" placeholder="+971 50 123 4567" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-dark">Number of Doctors <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
                  {["1 - 5", "6 - 15", "16 - 50", "50+"].map(size => (
                    <label key={size} className="flex items-center justify-center border border-gray-border rounded-xl h-12 cursor-pointer hover:border-blue-primary hover:bg-blue-light/50 transition-colors bg-white">
                      <input required type="radio" name="size" value={size} className="hidden" />
                      <span className="text-sm font-medium text-text-dark">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-border mt-2">
                <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-primary hover:bg-blue-hover text-white h-14 rounded-xl font-bold text-base shadow-lg shadow-blue-primary/20">
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
                <p className="text-center text-xs text-text-light mt-4">
                  By submitting this form, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>

            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
