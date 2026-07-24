"use client";

import { CheckCircle2, TrendingUp, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { submitClinicRequest } from "@/app/actions/contact";

export default function ListYourClinicPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      <section className="bg-gradient-to-b from-blue-hover to-blue-primary pt-20 pb-32 px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Grow your practice with Docmate
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Join thousands of healthcare providers in Dubai who are reaching more patients, reducing no-shows, and streamlining their bookings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={() => document.getElementById('clinic-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white hover:bg-gray-bg text-blue-primary h-14 px-8 rounded-xl font-bold text-base">
                Register Your Clinic
              </Button>
              <Button onClick={() => document.getElementById('clinic-form')?.scrollIntoView({ behavior: 'smooth' })} variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white h-14 px-8 rounded-xl font-bold text-base">
                Talk to Sales
              </Button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 hidden md:block">
            <div className="relative w-full aspect-video bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm p-4 shadow-2xl">
              {/* Dashboard mockup representation */}
              <div className="w-full h-full bg-white rounded-xl shadow-lg flex overflow-hidden">
                <div className="w-1/4 bg-gray-50 border-r border-gray-border p-4 flex flex-col gap-3">
                  <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse mt-4"></div>
                  <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-3/4 p-6 flex flex-col gap-6">
                  <div className="flex gap-4">
                    <div className="w-1/3 h-24 bg-blue-50 rounded-xl border border-blue-100 flex flex-col justify-center p-4">
                      <div className="w-1/2 h-3 bg-blue-200 rounded mb-2"></div>
                      <div className="w-3/4 h-6 bg-blue-primary/40 rounded"></div>
                    </div>
                    <div className="w-1/3 h-24 bg-green-50 rounded-xl border border-green-100 flex flex-col justify-center p-4">
                      <div className="w-1/2 h-3 bg-green-200 rounded mb-2"></div>
                      <div className="w-3/4 h-6 bg-green-600/40 rounded"></div>
                    </div>
                  </div>
                  <div className="w-full flex-1 bg-gray-50 rounded-xl border border-gray-border p-4">
                    <div className="w-1/4 h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="w-full h-10 bg-white border border-gray-200 rounded-lg mb-2"></div>
                    <div className="w-full h-10 bg-white border border-gray-200 rounded-lg mb-2"></div>
                    <div className="w-full h-10 bg-white border border-gray-200 rounded-lg"></div>
                  </div>
                </div>
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
                  <label className="text-sm font-semibold text-text-dark">City <span className="text-red-500">*</span></label>
                  <select name="city" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors">
                    <option>Dubai</option>
                    <option>Ajman</option>
                    <option>Riyadh</option>
                    <option>Jeddah</option>
                    <option>Kuwait City</option>
                    <option>Doha</option>
                    <option>Manama</option>
                    <option>Muscat</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">Contact Person <span className="text-red-500">*</span></label>
                  <input required name="contactPerson" type="text" placeholder="Full Name" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">Role <span className="text-red-500">*</span></label>
                  <select name="role" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors">
                    <option>Doctor</option>
                    <option>Clinic Manager</option>
                    <option>Owner</option>
                    <option>Other</option>
                  </select>
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
