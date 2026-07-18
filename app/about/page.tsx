import Image from "next/image";
import { CheckCircle2, HeartPulse, ShieldCheck, Users, Building2, MapPin, Target, Compass, Zap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let totalActiveDoctors = 0;
  let totalClinics = 0;

  try {
    totalActiveDoctors = await prisma.doctor.count({ where: { status: "Active" } });
    totalClinics = await prisma.clinic.count();
  } catch (e) {
    console.error("Error fetching about-page stats:", e);
  }

  const stats = [
    { icon: Users, value: `${totalActiveDoctors}`, label: "Verified Specialist Doctors" },
    { icon: Building2, value: `${totalClinics}`, label: "Partner Hospitals & Clinics" },
    { icon: MapPin, value: "3", label: "Emirates Covered" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Verified doctors only",
      description: "Every specialist on Docmate is manually vetted for licensing, credentials, and standing before they ever appear in a search result.",
    },
    {
      icon: HeartPulse,
      title: "Patient-first care",
      description: "Transparent fees, honest reviews, and no hidden steps between you and the care you need.",
    },
    {
      icon: Zap,
      title: "Speed & simplicity",
      description: "Search, compare, and request an appointment in under two minutes — no phone queues, no back-and-forth.",
    },
    {
      icon: MapPin,
      title: "Built for the UAE",
      description: "Designed around how healthcare actually works across Dubai, Sharjah, and Abu Dhabi — not a generic global template.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Section */}
      <section className="bg-blue-primary pt-20 pb-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
            Our Mission
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Transforming Healthcare Access in Dubai
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
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-border shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-light text-blue-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-text-dark mb-2">{stat.value}</h3>
              <p className="text-text-mid font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-4 inline-block rounded-full border border-blue-primary/15 bg-blue-primary/8 px-3 py-1 text-caption font-bold uppercase tracking-[0.06em] text-blue-primary">
              Why we exist
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark leading-tight">
              Mission &amp; Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-gray-border bg-white p-8 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-blue-primary/30 hover:shadow-lg hover:shadow-blue-primary/8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-primary text-white">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-text-dark">Our Mission</h3>
              <p className="text-text-mid leading-relaxed">
                To make quality healthcare in the UAE transparent, accessible, and a few taps away — connecting patients with verified specialists without the friction of phone calls, long hold times, or guesswork.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-border bg-white p-8 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-blue-primary/30 hover:shadow-lg hover:shadow-blue-primary/8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-primary text-white">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-text-dark">Our Vision</h3>
              <p className="text-text-mid leading-relaxed">
                To become the most trusted digital front door to healthcare across the UAE — where finding and booking the right doctor is as simple as booking a table, for every patient and every clinic we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-24 px-4 bg-gray-bg">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark leading-tight">
              Built for patients, <br/>trusted by doctors.
            </h2>
            <p className="text-text-mid text-lg leading-relaxed">
              Founded in 2026, Docmate started with a simple observation: booking a doctor's appointment in Dubai involved too many phone calls and long hold times. We set out to change that by building a platform that connects patients directly with the best healthcare providers.
            </p>
            <p className="text-text-mid text-lg leading-relaxed">
              Today, we're growing steadily across Dubai, Sharjah, and Abu Dhabi — onboarding verified specialists and hospital networks one careful step at a time.
            </p>
            <ul className="flex flex-col gap-3 mt-4">
              <li className="flex items-center gap-3 text-text-dark font-semibold">
                <CheckCircle2 className="w-5 h-5 text-green-badge" /> Rigorous 3-step doctor verification
              </li>
              <li className="flex items-center gap-3 text-text-dark font-semibold">
                <CheckCircle2 className="w-5 h-5 text-green-badge" /> Real-time availability sync
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image src="/cta_doctors_bg.webp" alt="Docmate verified doctors" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-4 inline-block rounded-full border border-blue-primary/15 bg-blue-primary/8 px-3 py-1 text-caption font-bold uppercase tracking-[0.06em] text-blue-primary">
              What we stand for
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark leading-tight">
              The principles behind Docmate
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={i} className="rounded-2xl border border-gray-border bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-blue-primary/30 hover:shadow-lg hover:shadow-blue-primary/8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-light text-blue-primary">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-text-dark">{v.title}</h3>
                <p className="text-sm leading-relaxed text-text-mid">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-transparent border-t border-gray-border text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold text-text-dark mb-6">Ready to take control of your health?</h2>
          <p className="text-text-mid text-lg mb-8">
            Join patients across Dubai, Sharjah, and Abu Dhabi who book their healthcare appointments seamlessly through Docmate.
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
