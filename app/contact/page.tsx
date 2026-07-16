"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { submitContact } from "@/app/actions/contact";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitContact(formData);
    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">Get in touch</h1>
          <p className="text-lg text-text-mid leading-relaxed">
            Have a question about your appointment, want to partner with us, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl border border-gray-border overflow-hidden shadow-sm">
          
          {/* Contact Info (Left) */}
          <div className="w-full lg:w-1/3 bg-blue-primary p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background design */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div>
              <h3 className="text-3xl font-bold text-white mb-8">Contact Info</h3>
              
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="font-semibold text-white mb-1">Phone</span>
                    <span>+971 4 123 4567</span>
                    <span className="text-sm opacity-70 mt-1">Mon-Fri, 9am - 6pm (GST)</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="font-semibold text-white mb-1">Email</span>
                    <span>support@docmate.com</span>
                    <span className="text-sm opacity-70 mt-1">We'll reply within 24 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="font-semibold text-white mb-1">Office</span>
                    <span className="leading-relaxed">Dubai Internet City<br/>Building 3, Floor 4<br/>Dubai, United Arab Emirates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="w-full lg:w-2/3 p-10 md:p-12">
            <h3 className="text-2xl font-bold text-text-dark mb-8">Send us a message</h3>
            
            {success && (
              <div className="mb-6 bg-green-badge-bg border border-green-badge text-green-badge px-4 py-3 rounded-xl">
                Thank you for reaching out! We have received your message and will get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">First Name</label>
                  <input required name="firstName" type="text" placeholder="John" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">Last Name</label>
                  <input required name="lastName" type="text" placeholder="Doe" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">Email Address</label>
                  <input required name="email" type="email" placeholder="john@example.com" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-semibold text-text-dark">Subject</label>
                  <select name="subject" className="bg-gray-bg border border-gray-border rounded-xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors">
                    <option>General Inquiry</option>
                    <option>Support with Booking</option>
                    <option>Clinic Partnership</option>
                    <option>Feedback</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-text-dark">Message</label>
                <textarea required name="message" rows={5} placeholder="How can we help you?" className="bg-gray-bg border border-gray-border rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-blue-primary transition-colors resize-none"></textarea>
              </div>

              <div className="pt-4">
                <Button disabled={isSubmitting} type="submit" className="w-full md:w-auto bg-blue-primary hover:bg-blue-hover text-white h-12 px-10 rounded-xl font-bold shadow-lg shadow-blue-primary/20">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
