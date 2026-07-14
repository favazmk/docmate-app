import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import SpecialtyCard from "@/components/SpecialtyCard";
import Image from "next/image";
import CitiesGrid from "@/components/CitiesGrid";
import DoctorCard from "@/components/DoctorCard";
import CountryCard from "@/components/CountryCard";
import { BadgeCheck, Globe, Zap, ShieldCheck, Star, Activity, Heart, Eye, Bone, Baby, Brain, Stethoscope } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function Home() {
  let dbDoctors: any[] = [];
  let searchBarDoctors: { slug: string; name: string; specialty: string; city: string }[] = [];
  let specialtiesWithCounts: { specialty: string; _count: { id: number } }[] = [];
  let hospitalGroups: any[] = [];
  let totalActiveDoctors = 0;
  let totalSpecialtiesCount = 0;

  try {
    dbDoctors = await prisma.doctor.findMany({
      take: 4,
      where: { status: "Active" },
      include: {
        clinic: {
          include: {
            hospitalGroup: true
          }
        }
      }
    });
    
    searchBarDoctors = await prisma.doctor.findMany({
      where: { status: "Active" },
      select: {
        slug: true,
        name: true,
        specialty: true,
        city: true
      }
    });

    const counts = await prisma.doctor.groupBy({
      by: ['specialty'],
      where: { status: "Active" },
      _count: {
        id: true
      }
    });
    specialtiesWithCounts = counts as any;

    totalActiveDoctors = await prisma.doctor.count({
      where: { status: "Active" }
    });

    const distinctSpecialties = await prisma.doctor.findMany({
      where: { status: "Active" },
      select: { specialty: true },
      distinct: ['specialty']
    });
    totalSpecialtiesCount = distinctSpecialties.length;

    // Fetch hospital groups with clinics and count of doctors
    const rawHospitals = await prisma.hospitalGroup.findMany({
      include: {
        clinics: {
          include: {
            _count: {
              select: { doctors: true }
            }
          }
        }
      }
    });

    hospitalGroups = rawHospitals.map(h => {
      const doctorCount = h.clinics.reduce((sum, c) => sum + c._count.doctors, 0);
      const branchCount = h.clinics.length;
      return {
        id: h.id,
        name: h.name,
        photoUrl: h.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(h.name)}&background=2200CC&color=fff`,
        branchCount,
        doctorCount,
        clinics: h.clinics.map(c => ({
          id: c.id,
          name: c.name,
          city: c.city
        }))
      };
    });

  } catch (e) {
    console.error("Error fetching homepage DB data:", e);
  }

  const getSpecialtyCount = (name: string) => {
    const found = specialtiesWithCounts.find(
      s => s.specialty.toLowerCase() === name.toLowerCase()
    );
    return found ? found._count.id : 0;
  };

  const specialties = [
    { name: "Gynecology", count: getSpecialtyCount("Gynecology"), icon: Activity, href: "/search?specialty=Gynecology" },
    { name: "Cardiology", count: getSpecialtyCount("Cardiology"), icon: Heart, href: "/search?specialty=Cardiology" },
    { name: "Ophthalmology", count: getSpecialtyCount("Ophthalmology"), icon: Eye, href: "/search?specialty=Ophthalmology" },
    { name: "Orthopedics", count: getSpecialtyCount("Orthopedics"), icon: Bone, href: "/search?specialty=Orthopedics" },
    { name: "Pediatrics", count: getSpecialtyCount("Pediatrics"), icon: Baby, href: "/search?specialty=Pediatrics" },
    { name: "Neurology", count: getSpecialtyCount("Neurology"), icon: Brain, href: "/search?specialty=Neurology" },
    { name: "Pulmonology", count: getSpecialtyCount("Pulmonology"), icon: Stethoscope, href: "/search?specialty=Pulmonology" },
    { name: "View All", count: totalSpecialtiesCount, icon: Activity, href: "/search", isViewAll: true },
  ];

  const featuredDoctors = dbDoctors.map(d => ({
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    rating: d.rating,
    reviews: d.reviews,
    city: d.city,
    countryFlag: "🇦🇪",
    languages: d.languages.split(",").map((s: string) => s.trim()),
    fee: d.fee,
    currency: "AED",
    photoUrl: d.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2200CC&color=fff`,
    isVerified: true,
    clinicName: d.clinic ? `${d.clinic.hospitalGroup.name} - ${d.clinic.name}` : d.affiliation
  }));

  const topCities = [
    { flag: "DXB", name: "Dubai", cities: "Dubai's top hospitals & clinics", href: "/search?city=Dubai" },
    { flag: "AUH", name: "Abu Dhabi", cities: "Capital healthcare & medical centers", href: "/search?city=Abu%20Dhabi" },
    { flag: "SHJ", name: "Sharjah", cities: "Family-focused clinics & polyclinics", href: "/search?city=Sharjah" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 px-4 overflow-hidden bg-[#0F172A]">
        {/* Background Image for Desktop */}
        <div className="hidden md:block absolute inset-0 z-0">
          <Image 
            src="/hero_desktop.webp" 
            alt="Medical Clinic Dubai" 
            fill 
            priority
            className="object-cover opacity-70" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/70" />
        </div>
        
        {/* Background Image for Mobile */}
        <div className="block md:hidden absolute inset-0 z-0">
          <Image 
            src="/hero_mobile.webp" 
            alt="Medical Clinic Dubai Mobile" 
            fill 
            priority
            className="object-cover opacity-65" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/80" />
        </div>

        <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
          <span className="uppercase tracking-widest text-[11px] font-medium text-blue-300 mb-4">
            Dubai's #1 doctor booking platform
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6 tracking-tight">
            Find and Book the <span className="text-blue-200">Best Doctors</span> Near You
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium">
            Verified specialists in Dubai, Sharjah & Abu Dhabi. Book in under 2 minutes.
          </p>
        </div>
      </section>

      {/* Search Bar Wrapper */}
      <div className="px-4">
        <SearchBar doctors={searchBarDoctors} hospitalGroups={hospitalGroups} />
      </div>

      {/* Trust Strip */}
      <section className="bg-blue-light border-y border-gray-border/50 py-6 mt-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-2 text-blue-primary font-medium text-sm">
            <BadgeCheck className="w-5 h-5" /> {totalActiveDoctors} verified doctors
          </div>
          <div className="flex items-center gap-2 text-blue-primary font-medium text-sm">
            <Globe className="w-5 h-5" /> Dubai, Sharjah & Abu Dhabi
          </div>
          <div className="flex items-center gap-2 text-blue-primary font-medium text-sm">
            <Zap className="w-5 h-5" /> Instant confirmation
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
              <DoctorCard key={i} {...d} variant="grid" />
            ))}
          </div>

          <Link href="/search">
            <Button variant="outline" className="border-2 border-blue-primary text-blue-primary hover:bg-blue-light h-12 px-8 rounded-xl font-semibold">
              View all doctors
            </Button>
          </Link>
        </div>
      </section>

      {/* Discover by Hospital Group */}
      <section id="hospitals" className="py-20 px-4 bg-white border-t border-gray-border/50">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-blue-light text-blue-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-primary/10">
            Discover hospital wise
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-12 tracking-tight">
            Top Hospital Groups & Healthcare Networks
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
            {hospitalGroups.map((h) => (
              <Link
                key={h.id}
                href={`/search?hospitalGroupId=${h.id}`}
                className="bg-white border border-gray-border rounded-2xl p-6 flex items-center gap-5 hover:border-blue-primary hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-border bg-gray-50 flex items-center justify-center shrink-0">
                  <Image src={h.photoUrl} alt={h.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-text-dark text-lg group-hover:text-blue-primary transition-colors">
                    {h.name}
                  </h3>
                  <p className="text-xs font-medium text-text-mid mt-1">
                    {h.branchCount} {h.branchCount === 1 ? "branch" : "branches"} • {h.doctorCount} {h.doctorCount === 1 ? "doctor" : "doctors"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by City */}
      <section id="cities" className="py-20 px-4 bg-gray-bg border-t border-gray-border/50">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-blue-light text-blue-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-primary/10">
            Available across the UAE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-12 tracking-tight">
            Top Cities in the UAE
          </h2>

          <CitiesGrid areas={topCities} />
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
              <p className="text-text-mid">Find the right doctor by specialty, location, or spoken languages.</p>
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
                Join Docmate and get discovered by thousands of patients across Dubai. Manage appointments easily.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <Link href="/list-your-clinic">
                <Button className="w-full sm:w-auto bg-white hover:bg-gray-bg text-blue-primary h-12 px-8 rounded-xl font-bold">
                  List your clinic
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white h-12 px-8 rounded-xl font-semibold">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
