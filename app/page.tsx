import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import SpecialtyCard from "@/components/SpecialtyCard";
import Image from "next/image";
import CitiesGrid from "@/components/CitiesGrid";
import DoctorCard from "@/components/DoctorCard";
import AnimatedSection from "@/components/AnimatedSection";
import HeroOrbs from "@/components/HeroOrbs";
import { BadgeCheck, Globe, Zap, Star, Activity, Heart, Eye, Bone, Baby, Brain, Stethoscope } from "lucide-react";
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
            hospitalGroup: true,
          },
        },
      },
    });

    searchBarDoctors = await prisma.doctor.findMany({
      where: { status: "Active" },
      select: {
        slug: true,
        name: true,
        specialty: true,
        city: true,
      },
    });

    const counts = await prisma.doctor.groupBy({
      by: ["specialty"],
      where: { status: "Active" },
      _count: {
        id: true,
      },
    });
    specialtiesWithCounts = counts as any;

    totalActiveDoctors = await prisma.doctor.count({
      where: { status: "Active" },
    });

    const distinctSpecialties = await prisma.doctor.findMany({
      where: { status: "Active" },
      select: { specialty: true },
      distinct: ["specialty"],
    });
    totalSpecialtiesCount = distinctSpecialties.length;

    const rawHospitals = await prisma.hospitalGroup.findMany({
      include: {
        clinics: {
          include: {
            _count: {
              select: { doctors: true },
            },
          },
        },
      },
    });

    hospitalGroups = rawHospitals.map((h) => {
      const doctorCount = h.clinics.reduce((sum, c) => sum + c._count.doctors, 0);
      const branchCount = h.clinics.length;
      return {
        id: h.id,
        name: h.name,
        photoUrl: h.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(h.name)}&background=2200CC&color=fff`,
        branchCount,
        doctorCount,
        clinics: h.clinics.map((c) => ({
          id: c.id,
          name: c.name,
          city: c.city,
        })),
      };
    });
  } catch (e) {
    console.error("Error fetching homepage DB data:", e);
  }

  const getSpecialtyCount = (name: string) => {
    const found = specialtiesWithCounts.find(
      (s) => s.specialty.toLowerCase() === name.toLowerCase(),
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

  const featuredDoctors = dbDoctors.map((d) => ({
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    rating: d.rating,
    reviews: d.reviews,
    city: d.city,
    countryFlag: "AE",
    languages: d.languages.split(",").map((s: string) => s.trim()),
    fee: d.fee,
    currency: "AED",
    photoUrl: d.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2200CC&color=fff`,
    isVerified: true,
    clinicName: d.clinic ? `${d.clinic.hospitalGroup.name} - ${d.clinic.name}` : d.affiliation,
  }));

  const topCities = [
    { flag: "DXB", name: "Dubai", cities: "Dubai's top hospitals & clinics", href: "/search?city=Dubai" },
    { flag: "AUH", name: "Abu Dhabi", cities: "Capital healthcare & medical centers", href: "/search?city=Abu%20Dhabi" },
    { flag: "SHJ", name: "Sharjah", cities: "Family-focused clinics & polyclinics", href: "/search?city=Sharjah" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden bg-[#0F172A] px-4 pb-32 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(26,18,100,0.4),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(235,235,224,0.12),transparent_24%)]" />
        <div className="hidden md:block absolute inset-0 z-0">
          <Image
            src="/hero_desktop.webp"
            alt="Medical Clinic Dubai"
            fill
            priority
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/35 via-slate-900/55 to-slate-900/78" />
        </div>

        <div className="block md:hidden absolute inset-0 z-0">
          <Image
            src="/hero_mobile.webp"
            alt="Medical Clinic Dubai Mobile"
            fill
            priority
            className="object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/45 via-slate-900/60 to-slate-900/85" />
        </div>

        <HeroOrbs />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="hero-badge mb-4 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-blue-200 backdrop-blur-md">
            Dubai's #1 doctor booking platform
          </span>
          <h1 className="hero-title mb-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Find and Book the <span className="hero-title-delay text-blue-200">Best Doctors</span> Near You
          </h1>
          <p className="hero-subtitle mx-auto mb-8 max-w-2xl text-lg font-medium text-slate-200 md:text-xl lg:mx-0">
            Verified specialists in Dubai, Sharjah & Abu Dhabi. Book in under 2 minutes.
          </p>
        </div>
      </section>

      <AnimatedSection animation="reveal-scale" className="px-4">
        <SearchBar doctors={searchBarDoctors} hospitalGroups={hospitalGroups} />
      </AnimatedSection>

      <AnimatedSection animation="reveal" delay={100} className="mx-4 mt-12 rounded-[2rem] border border-white/70 bg-white/65 px-4 py-6 shadow-[0_20px_60px_rgba(26,18,100,0.08)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-primary transition-transform duration-200 hover:scale-105">
            <BadgeCheck className="h-5 w-5" /> {totalActiveDoctors} verified doctors
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-primary transition-transform duration-200 hover:scale-105">
            <Globe className="h-5 w-5" /> Dubai, Sharjah & Abu Dhabi
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-primary transition-transform duration-200 hover:scale-105">
            <Zap className="h-5 w-5" /> Instant confirmation
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-primary transition-transform duration-200 hover:scale-105">
            <Star className="h-5 w-5" /> 4.8/5 patient rating
          </div>
        </div>
      </AnimatedSection>

      <section id="specialties" className="px-4 py-20">
        <AnimatedSection animation="reveal" className="premium-section relative z-10 mx-auto flex max-w-7xl flex-col items-center rounded-[2rem] px-6 py-14 text-center md:px-10">
          <div className="mb-4 rounded-full border border-blue-primary/10 bg-blue-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-primary">
            Browse by specialty
          </div>
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-text-dark md:text-4xl">
            What are you looking for?
          </h2>

          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
            {specialties.map((s, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1}`}>
                <SpecialtyCard {...s} />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="bg-transparent px-4 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <AnimatedSection animation="reveal">
            <div className="mb-4 rounded-full border border-blue-primary/10 bg-blue-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-primary">
              Top rated
            </div>
            <h2 className="mb-12 text-3xl font-bold tracking-tight text-text-dark md:text-4xl">
              Featured doctors
            </h2>
          </AnimatedSection>

          <div className="mb-10 grid w-full grid-cols-1 gap-6 text-left md:grid-cols-2 lg:grid-cols-4">
            {featuredDoctors.map((d, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1}`}>
                <DoctorCard {...d} variant="grid" />
              </div>
            ))}
          </div>

          <AnimatedSection animation="reveal" delay={300}>
            <Link href="/search">
              <Button variant="outline" className="h-12 rounded-xl border-2 border-blue-primary bg-white/75 px-8 font-semibold text-blue-primary backdrop-blur-sm hover:bg-blue-light hover:shadow-lg hover:shadow-blue-primary/10 hover:-translate-y-0.5 transition-all duration-300">
                View all doctors
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section id="hospitals" className="px-4 py-20">
        <AnimatedSection animation="reveal" className="premium-section relative z-10 mx-auto flex max-w-7xl flex-col items-center rounded-[2rem] px-6 py-14 text-center md:px-10">
          <div className="mb-4 rounded-full border border-blue-primary/10 bg-blue-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-primary">
            Discover hospital wise
          </div>
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-text-dark md:text-4xl">
            Top Hospital Groups & Healthcare Networks
          </h2>

          <div className="grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
            {hospitalGroups.map((h, i) => (
              <div key={h.id} className={`reveal reveal-delay-${i + 1}`}>
                <Link
                  href={`/hospitals/${h.id}`}
                  className="group flex cursor-pointer items-center gap-5 rounded-2xl border border-white/80 bg-white/88 p-6 shadow-[0_18px_40px_rgba(26,18,100,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-primary/40 hover:shadow-[0_22px_44px_rgba(26,18,100,0.14)]"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-border bg-gray-50">
                    <Image src={h.photoUrl} alt={h.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-extrabold text-text-dark transition-colors duration-300 group-hover:text-blue-primary">
                      {h.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-text-mid">
                      {h.branchCount} {h.branchCount === 1 ? "branch" : "branches"} • {h.doctorCount} {h.doctorCount === 1 ? "doctor" : "doctors"}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section id="cities" className="border-t border-gray-border/50 bg-transparent px-4 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <AnimatedSection animation="reveal">
            <div className="mb-4 rounded-full border border-blue-primary/10 bg-blue-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-primary">
              Available across the UAE
            </div>
            <h2 className="mb-12 text-3xl font-bold tracking-tight text-text-dark md:text-4xl">
              Top Cities in the UAE
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="reveal" delay={150}>
            <CitiesGrid areas={topCities} />
          </AnimatedSection>
        </div>
      </section>

      <section className="px-4 py-20">
        <AnimatedSection animation="reveal" className="premium-section relative z-10 mx-auto flex max-w-7xl flex-col items-center rounded-[2rem] px-6 py-14 text-center md:px-10">
          <div className="mb-4 rounded-full border border-blue-primary/10 bg-blue-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-primary">
            Simple process
          </div>
          <h2 className="mb-16 text-3xl font-bold tracking-tight text-text-dark md:text-4xl">
            Book in 3 steps
          </h2>

          <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="reveal reveal-delay-1 rounded-[1.75rem] border border-white/70 bg-white/78 p-8 shadow-[0_18px_40px_rgba(26,18,100,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-primary text-2xl font-bold text-white shadow-lg shadow-blue-primary/30 transition-transform duration-300 hover:scale-110">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold text-text-dark">Search</h3>
              <p className="text-text-mid">Find the right doctor by specialty, location, or spoken languages.</p>
            </div>
            <div className="reveal reveal-delay-2 rounded-[1.75rem] border border-white/70 bg-white/78 p-8 shadow-[0_18px_40px_rgba(26,18,100,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-primary text-2xl font-bold text-white shadow-lg shadow-blue-primary/30 transition-transform duration-300 hover:scale-110">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold text-text-dark">Choose a slot</h3>
              <p className="text-text-mid">View real-time availability and select a time that works best for you.</p>
            </div>
            <div className="reveal reveal-delay-3 rounded-[1.75rem] border border-white/70 bg-white/78 p-8 shadow-[0_18px_40px_rgba(26,18,100,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-primary text-2xl font-bold text-white shadow-lg shadow-blue-primary/30 transition-transform duration-300 hover:scale-110">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold text-text-dark">Confirm</h3>
              <p className="text-text-mid">Enter your details and instantly receive your booking confirmation.</p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section className="px-4 py-20">
        <AnimatedSection animation="reveal-scale">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-primary via-[#2a1d7a] to-blue-mid p-8 shadow-[0_26px_80px_rgba(26,18,100,0.24)] md:p-16 gradient-animate glow-pulse">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(235,235,224,0.12),transparent_28%)]" />
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
              <div className="flex max-w-xl flex-col text-center md:text-left">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Are you a doctor or clinic?
                </h2>
                <p className="text-lg text-white/75">
                  Join Docmate and get discovered by thousands of patients across Dubai. Manage appointments easily.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-4 sm:flex-row md:w-auto">
                <Link href="/list-your-clinic">
                  <Button className="h-12 w-full rounded-xl bg-white px-8 font-bold text-blue-primary hover:bg-gray-bg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 sm:w-auto">
                    List your clinic
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="h-12 w-full rounded-xl border-white/30 bg-transparent px-8 font-semibold text-white hover:bg-white/10 hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 sm:w-auto">
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
