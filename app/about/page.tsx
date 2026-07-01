import Image from "next/image";
import { CheckCircle2, HeartPulse, ShieldCheck, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-blue-primary pt-20 pb-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
            Our Mission
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Transforming Healthcare Access in the GCC
          </h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed">
            We built Docmate because finding the right doctor shouldn't be harder than the illness itself. 
            We're on a mission to make healthcare transparent, accessible, and instantaneous.
          </p>
        </div>
      </section>

      {/* Stats / Value Prop */}
      <section className="py-16 px-4 bg-gray-bg border-b border-gray-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-border shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-light text-blue-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-bold text-text-dark mb-2">500+</h3>
            <p className="text-text-mid font-medium">Verified Specialist Doctors</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-gray-border shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-light text-blue-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HeartPulse className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-bold text-text-dark mb-2">50,000+</h3>
            <p className="text-text-mid font-medium">Patients Treated Yearly</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-gray-border shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-light text-blue-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-bold text-text-dark mb-2">100%</h3>
            <p className="text-text-mid font-medium">Verified Patient Reviews</p>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark leading-tight">
              Built for patients, <br/>trusted by doctors.
            </h2>
            <p className="text-text-mid text-lg leading-relaxed">
              Founded in 2026, Docmate started with a simple observation: booking a doctor's appointment in the GCC involved too many phone calls, long hold times, and uncertainty about insurance coverage.
            </p>
            <p className="text-text-mid text-lg leading-relaxed">
              Today, we are the fastest-growing health-tech platform in the region, connecting thousands of patients with top-tier healthcare providers in the UAE, Saudi Arabia, Kuwait, Bahrain, Qatar, and Oman.
            </p>
            <ul className="flex flex-col gap-3 mt-4">
              <li className="flex items-center gap-3 text-text-dark font-semibold">
                <CheckCircle2 className="w-5 h-5 text-green-badge" /> Rigorous 3-step doctor verification
              </li>
              <li className="flex items-center gap-3 text-text-dark font-semibold">
                <CheckCircle2 className="w-5 h-5 text-green-badge" /> Real-time availability sync
              </li>
              <li className="flex items-center gap-3 text-text-dark font-semibold">
                <CheckCircle2 className="w-5 h-5 text-green-badge" /> Transparent consultation fees
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            {/* Placeholder image */}
            <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
              <span className="text-blue-primary/30 font-bold text-xl">Team Photo Placeholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-bg border-t border-gray-border text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold text-text-dark mb-6">Ready to take control of your health?</h2>
          <p className="text-text-mid text-lg mb-8">
            Join thousands of patients who book their healthcare appointments seamlessly through Docmate.
          </p>
          <div className="flex gap-4 w-full md:w-auto">
            <Link href="/search" className={`${buttonVariants()} flex-1 md:flex-none bg-blue-primary hover:bg-blue-hover text-white h-12 px-8 rounded-xl font-bold text-base shadow-lg shadow-blue-primary/20`}>
              Find a Doctor
            </Link>
            <Link href="/list-your-clinic" className={`${buttonVariants({ variant: "outline" })} flex-1 md:flex-none border-2 border-gray-border text-text-dark hover:bg-white h-12 px-8 rounded-xl font-bold text-base`}>
              For Clinics
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
