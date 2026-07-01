import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import SpecialtyCard from "@/components/SpecialtyCard";
import DoctorCard from "@/components/DoctorCard";
import CountryCard from "@/components/CountryCard";
import { BadgeCheck, Globe, Zap, ShieldCheck, Star, Activity, Heart, Eye, Bone, Baby, Brain, Stethoscope } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const specialties = [
    { name: "Dentistry", count: 423, icon: Activity, href: "/search?specialty=dentistry" },
    { name: "Cardiology", count: 156, icon: Heart, href: "/search?specialty=cardiology" },
    { name: "Ophthalmology", count: 89, icon: Eye, href: "/search?specialty=ophthalmology" },
    { name: "Orthopedics", count: 210, icon: Bone, href: "/search?specialty=orthopedics" },
    { name: "Pediatrics", count: 342, icon: Baby, href: "/search?specialty=pediatrics" },
    { name: "Neurology", count: 67, icon: Brain, href: "/search?specialty=neurology" },
    { name: "Pulmonology", count: 45, icon: Stethoscope, href: "/search?specialty=pulmonology" },
    { name: "View All", count: 22, icon: Activity, href: "/search", isViewAll: true },
  ];

  let dbDoctors = [];
  try {
    dbDoctors = await prisma.doctor.findMany({
      take: 4,
      where: { status: "Active" }
    });
  } catch (e) {
    console.error("Error fetching doctors on homepage:", e);
  }

  const featuredDoctors = dbDoctors.map(d => ({
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    rating: d.rating,
    reviews: d.reviews,
    city: d.city,
    countryFlag: "🇦🇪",
    languages: d.languages.split(",").map(s => s.trim()),
    fee: d.fee,
    currency: "AED",
    photoUrl: d.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2200CC&color=fff`,
    isVerified: true
  }));

  const emirates = [
    { flag: "🏙️", name: "Dubai", cities: "Downtown, Marina, Jumeirah...", href: "/dubai" },
    { flag: "🏛️", name: "Abu Dhabi", cities: "Corniche, Yas Island...", href: "/abu-dhabi" },
    { flag: "🕌", name: "Sharjah", cities: "Al Majaz, Al Qasimia...", href: "/sharjah" },
    { flag: "🏖️", name: "Ajman", cities: "Al Rashidiya, Al Nuaimia...", href: "/ajman" },
    { flag: "⛰️", name: "Ras Al Khaimah", cities: "Al Nakheel, Al Hamra...", href: "/ras-al-khaimah" },
    { flag: "🌊", name: "Fujairah", cities: "Al Faseel, Dibba...", href: "/fujairah" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-hover to-blue-primary pt-16 pb-32 px-4 relative">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="uppercase tracking-widest text-[11px] font-bold text-white/70 mb-4">
            GCC's #1 doctor booking platform
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Find & book trusted doctors across the GCC — instantly
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto mb-8">
            Verified specialists in UAE, Saudi Arabia, Kuwait, Bahrain, Qatar and Oman. Book in under 2 minutes.
          </p>
        </div>
      </section>

      {/* Search Bar Wrapper */}
      <div className="px-4">
        <SearchBar />
      </div>

      {/* Trust Strip */}
      <section className="bg-blue-light border-y border-gray-border/50 py-6 mt-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-2 text-blue-primary font-medium text-sm">
            <BadgeCheck className="w-5 h-5" /> 500+ verified doctors
          </div>
          <div className="flex items-center gap-2 text-blue-primary font-medium text-sm">
            <Globe className="w-5 h-5" /> 6 GCC countries
          </div>
          <div className="flex items-center gap-2 text-blue-primary font-medium text-sm">
            <Zap className="w-5 h-5" /> Instant confirmation
          </div>
          <div className="flex items-center gap-2 text-blue-primary font-medium text-sm">
            <ShieldCheck className="w-5 h-5" /> 100+ insurance plans
          </div>
          <div className="flex items-center gap-2 text-blue-primary font-medium text-sm">
            <Star className="w-5 h-5" /> 4.8/5 patient rating
          </div>
        </div>
      </section>

      {/* Specialty Grid */}
      <section id="specialties" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-blue-light text-blue-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-primary/10">
            Browse by specialty
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-12 tracking-tight">
            What are you looking for?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {specialties.map((s, i) => (
              <SpecialtyCard key={i} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-20 px-4 bg-gray-bg">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-blue-light text-blue-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-primary/10">
            Top rated
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-12 tracking-tight">
            Featured doctors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-10 text-left">
            {featuredDoctors.map((d, i) => (
              <DoctorCard key={i} {...d} />
            ))}
          </div>

          <Button variant="outline" className="border-2 border-blue-primary text-blue-primary hover:bg-blue-light h-12 px-8 rounded-xl font-semibold">
            View all doctors
          </Button>
        </div>
      </section>

      {/* Browse by Emirate */}
      <section id="emirates" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-blue-light text-blue-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-primary/10">
            Available across the UAE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-12 tracking-tight">
            Browse by Emirate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
            {emirates.map((e, i) => (
              <CountryCard key={i} flag={e.flag} name={e.name} cities={e.cities} href={e.href} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-bg">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-blue-light text-blue-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-primary/10">
            Simple process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-16 tracking-tight">
            Book in 3 steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-primary text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-primary/30">
                1
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-3">Search</h3>
              <p className="text-text-mid">Find the right doctor by specialty, location, or accepted insurance plans.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-primary text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-primary/30">
                2
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-3">Choose a slot</h3>
              <p className="text-text-mid">View real-time availability and select a time that works best for you.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-primary text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-primary/30">
                3
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-3">Confirm</h3>
              <p className="text-text-mid">Enter your details and instantly receive your booking confirmation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-hover to-blue-primary rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-primary/10">
            <div className="flex flex-col max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Are you a doctor or clinic?
              </h2>
              <p className="text-white/75 text-lg">
                Join Docmate and get discovered by thousands of patients across the GCC. Manage appointments easily.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <Button className="bg-white hover:bg-gray-bg text-blue-primary h-12 px-8 rounded-xl font-bold">
                List your clinic
              </Button>
              <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white h-12 px-8 rounded-xl font-semibold">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
