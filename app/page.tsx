import { Button, buttonVariants } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import SpecialtyCard from "@/components/SpecialtyCard";
import Image from "next/image";
import CitiesGrid from "@/components/CitiesGrid";
import DoctorCard from "@/components/DoctorCard";
import AnimatedSection from "@/components/AnimatedSection";
import HeroOrbs from "@/components/HeroOrbs";
import { BadgeCheck, Globe, Zap, Star, Activity, Heart, Eye, Bone, Baby, Brain, Stethoscope, Building2 } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
// Cached for 5 minutes. Admin actions call revalidatePath(), so edits made
// through the dashboard still appear immediately.
export const revalidate = 300;

export default async function Home() {
  let dbDoctors: any[] = [];
  let searchBarDoctors: { slug: string; name: string; specialty: string; city: string }[] = [];
  let specialtiesWithCounts: { specialty: string; _count: { id: number } }[] = [];
  let hospitalGroups: any[] = [];
  let totalActiveDoctors = 0;
  let totalSpecialtiesCount = 0;

  try {
    const doctorCardInclude = {
      clinics: {
        select: {
          name: true,
          city: true,
          hospitalGroup: { select: { name: true } },
        },
      },
    };

    // Homepage shows up to 4 admin-picked featured doctors; if fewer than 4
    // are marked featured, fill the rest with top-rated active doctors so the
    // section never looks sparse.
    const featuredPicks = await prisma.doctor.findMany({
      where: { status: "Active", isFeatured: true },
      take: 4,
      orderBy: { name: "asc" },
      include: doctorCardInclude,
    });

    if (featuredPicks.length < 4) {
      const fillerDoctors = await prisma.doctor.findMany({
        where: { status: "Active", isFeatured: false },
        take: 4 - featuredPicks.length,
        orderBy: [{ rating: "desc" }, { reviews: "desc" }],
        include: doctorCardInclude,
      });
      dbDoctors = [...featuredPicks, ...fillerDoctors];
    } else {
      dbDoctors = featuredPicks;
    }

    searchBarDoctors = await prisma.doctor.findMany({
      where: { status: "Active" },
      select: {
        slug: true,
        name: true,
        specialty: true,
        clinics: { select: { city: true } },
        availableDays: true,
        availableTime: true,
      },
    }).then(docs => docs.map(d => ({
      ...d,
      city: d.clinics.length > 0 ? d.clinics[0].city : ""
    })));

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
        photoUrl: h.photoUrl ? h.photoUrl.split(",")[0].trim() : `https://ui-avatars.com/api/?format=png&name=${encodeURIComponent(h.name)}&background=2200CC&color=fff`,
        branchCount,
        doctorCount,
        isFeatured: h.isFeatured,
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

  // Homepage shows up to 4 admin-picked featured hospital groups; if fewer
  // than 4 are marked featured, fill the rest with the largest networks by
  // doctor count so the section never looks sparse.
  const featuredHospitalGroups = [
    ...hospitalGroups.filter((h) => h.isFeatured),
    ...hospitalGroups.filter((h) => !h.isFeatured).sort((a, b) => b.doctorCount - a.doctorCount),
  ].slice(0, 4);

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
  ];

  const featuredDoctors = dbDoctors.map((d) => ({
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    type: d.type,
    rating: d.rating,
    reviews: d.reviews,
    languages: d.languages.split(",").map((s: string) => s.trim()),
    fee: d.fee,
    currency: "AED",
    photoUrl: d.photoUrl || `https://ui-avatars.com/api/?format=png&name=${encodeURIComponent(d.name)}&background=2200CC&color=fff`,
    isVerified: true,
    isFeatured: d.isFeatured,
    clinics: d.clinics,
    experience: d.experience,
    availableDays: d.availableDays || undefined,
    availableTime: d.availableTime || undefined,
  }));

  const topCities = [
    { flag: "DXB", name: "Dubai", cities: "Dubai's top hospitals & clinics", href: "/search?city=Dubai", image: "/city_dubai.webp" },
    { flag: "SHJ", name: "Sharjah", cities: "Family-focused clinics & polyclinics", href: "/search?city=Sharjah", image: "/city_sharjah.webp" },
    { flag: "AJM", name: "Ajman", cities: "Ajman healthcare & medical centers", href: "/search?city=Ajman", image: "/city_ajman.png" },
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
          <span className="hero-badge mb-4 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-caption font-medium uppercase tracking-[0.06em] text-blue-200 backdrop-blur-md">
            Dubai's leading doctor appointment booking platform
          </span>
          <h1 className="hero-title mb-6 text-display font-bold text-white">
            Find and Book the <span className="hero-title-delay text-blue-200">Best Doctors</span> Near You
          </h1>
          <p className="hero-subtitle mx-auto mb-8 max-w-2xl text-lg font-medium text-slate-200 md:text-xl lg:mx-0">
            Verified specialists in Dubai, Sharjah & Ajman. Book in under 2 minutes.
          </p>
        </div>
      </section>

      <AnimatedSection animation="reveal-scale" className="px-4 relative z-20">
        <SearchBar doctors={searchBarDoctors} hospitalGroups={hospitalGroups} />
      </AnimatedSection>

      <AnimatedSection animation="reveal" delay={100} className="mx-4 my-10 flex justify-center">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-blue-primary/15 bg-white/80 px-5 py-4 text-caption font-medium text-blue-primary shadow-sm backdrop-blur-md md:flex md:flex-wrap md:items-center md:justify-center md:gap-x-12 md:gap-y-3 md:rounded-full md:px-10 md:py-3.5">
          <div className="flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 md:justify-start">
            <BadgeCheck className="h-4 w-4 shrink-0" /> {totalActiveDoctors} verified doctors
          </div>
          <div className="flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 md:justify-start">
            <Globe className="h-4 w-4 shrink-0" /> Dubai, Sharjah & Ajman
          </div>
          <div className="flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 md:justify-start">
            <Zap className="h-4 w-4 shrink-0" /> Instant confirmation
          </div>
          <div className="flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 md:justify-start">
            <Star className="h-4 w-4 shrink-0" /> 4.8/5 patient rating
          </div>
        </div>
      </AnimatedSection>

      <section id="specialties" className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 -z-10 bg-[#0F172A]">
          <Image src="/specialties_bg.webp" alt="" fill sizes="100vw" className="hidden object-cover opacity-85 md:block" />
          <Image src="/specialties_bg_mob.webp" alt="" fill sizes="100vw" className="block object-cover opacity-85 md:hidden" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/35 to-slate-900/55" />
        </div>
        <AnimatedSection animation="reveal" className="relative z-10 mx-auto flex max-w-7xl flex-col items-center text-center">
          <div className="mb-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-caption font-bold uppercase tracking-[0.06em] text-blue-200 backdrop-blur-md">
            Browse by specialty
          </div>
          <h2 className="mb-3 text-heading font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            What are you looking for?
          </h2>
          <p className="mb-12 max-w-xl text-slate-200">
            Search doctors by specialty across Dubai, Sharjah and Ajman.
          </p>

          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 mb-10">
            {specialties.map((s, i) => (
              <div key={i} className="stagger-child">
                <SpecialtyCard {...s} />
              </div>
            ))}
          </div>

          <AnimatedSection animation="reveal" delay={300}>
            <Link href="/search" className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-xl border-2 border-white/20 bg-white/10 px-8 font-semibold text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-md hover:shadow-lg hover:-translate-y-0.5 transition-[background-color,box-shadow,transform,border-color] duration-300")}>
              View all specialties
            </Link>
          </AnimatedSection>
        </AnimatedSection>
      </section>

      <section className="bg-transparent px-4 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <AnimatedSection animation="reveal">
            <h2 className="mb-3 text-heading font-bold text-text-dark">
              Featured doctors
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-text-mid">
              A closer look at some of our highest-rated, verified specialists.
            </p>
          </AnimatedSection>

          <div className="mb-10 grid w-full grid-cols-1 gap-6 text-left md:grid-cols-2 lg:grid-cols-4">
            {featuredDoctors.map((d, i) => (
              <div key={i} className="stagger-child">
                <DoctorCard {...d} variant="grid" />
              </div>
            ))}
          </div>

          <AnimatedSection animation="reveal" delay={300}>
            <Link href="/search" className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-xl border-2 border-blue-primary bg-white/90 px-8 font-semibold text-blue-primary hover:bg-blue-light hover:shadow-lg hover:shadow-blue-primary/10 hover:-translate-y-0.5 transition-[background-color,box-shadow,transform] duration-300")}>
              View all doctors
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section id="hospitals" className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 -z-10 bg-[#0F172A]">
          <Image src="/hospitals_bg.webp" alt="" fill sizes="100vw" className="hidden object-cover opacity-85 md:block" />
          <Image src="/hospitals_bg_mob.webp" alt="" fill sizes="100vw" className="block object-cover opacity-85 md:hidden" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/35 to-slate-900/55" />
        </div>
        <AnimatedSection animation="reveal" className="relative z-10 mx-auto flex max-w-7xl flex-col items-center rounded-2xl px-6 py-14 text-center md:px-10">
          <h2 className="mb-3 text-heading font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            Top Hospital Groups & Healthcare Networks
          </h2>
          <p className="mb-12 max-w-xl text-slate-200">
            Trusted networks with multiple branches across the UAE.
          </p>

          <div className="grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {featuredHospitalGroups.map((h, i) => (
              <div key={h.id} className="stagger-child h-full">
                <Link
                  href={`/hospitals/${h.id}`}
                  className="bg-white/85 border border-gray-border/60 rounded-2xl flex flex-col hover:border-blue-primary/40 hover:shadow-xl hover:shadow-blue-primary/8 transition-[border-color,box-shadow,transform] duration-300 cursor-pointer overflow-hidden group h-full"
                >
                  <div className="relative w-full h-48 bg-gray-bg border-b border-gray-border">
                    <Image src={h.photoUrl} alt={h.name} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-text-dark text-lg hover:text-blue-primary transition-colors mb-3 line-clamp-2">
                      {h.name}
                    </h3>
                    <div className="mt-auto text-sm font-semibold text-text-mid flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-primary" />
                      <span>{h.branchCount} {h.branchCount === 1 ? "branch" : "branches"} • {h.doctorCount} {h.doctorCount === 1 ? "doctor" : "doctors"}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <AnimatedSection animation="reveal" delay={300}>
            <Link href="/hospitals">
              <Button variant="outline" className="h-12 rounded-xl border-2 border-white/20 bg-white/10 px-8 font-semibold text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-md hover:shadow-lg hover:-translate-y-0.5 transition-[background-color,box-shadow,transform,border-color] duration-300">
                View all hospitals
              </Button>
            </Link>
          </AnimatedSection>
        </AnimatedSection>
      </section>

      <section id="cities" className="border-t border-gray-border/50 bg-transparent px-4 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <AnimatedSection animation="reveal">
            <h2 className="mb-12 text-heading font-bold text-text-dark">
              Top Cities in the UAE
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="reveal" delay={150} className="w-full">
            <CitiesGrid areas={topCities} />
          </AnimatedSection>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 -z-10 bg-[#0F172A]">
          <Image src="/steps_bg.webp" alt="" fill sizes="100vw" className="hidden object-cover opacity-85 md:block" />
          <Image src="/steps_bg_mob.webp" alt="" fill sizes="100vw" className="block object-cover opacity-85 md:hidden" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/35 to-slate-900/55" />
        </div>
        <AnimatedSection animation="reveal" className="relative z-10 mx-auto flex max-w-7xl flex-col items-center text-center">
          <h2 className="mb-10 text-heading font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:mb-16">
            Book in 3 steps
          </h2>

          <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:gap-8 md:grid-cols-3">
            <div className="stagger-child flex items-center gap-4 rounded-2xl border border-white/40 bg-white/45 p-5 text-left backdrop-blur-md transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-lg hover:shadow-blue-primary/8 md:flex-col md:items-stretch md:p-8 md:text-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-primary text-xl font-bold text-white transition-transform duration-300 hover:scale-105 md:mx-auto md:mb-6 md:h-16 md:w-16 md:text-2xl">
                1
              </div>
              <div>
                <h3 className="mb-1 text-xl font-bold text-text-dark md:mb-3">Search</h3>
                <p className="text-text-mid">Find the right doctor by specialty, location, or spoken languages.</p>
              </div>
            </div>
            <div className="stagger-child flex items-center gap-4 rounded-2xl border border-white/40 bg-white/45 p-5 text-left backdrop-blur-md transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-lg hover:shadow-blue-primary/8 md:flex-col md:items-stretch md:p-8 md:text-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-primary text-xl font-bold text-white transition-transform duration-300 hover:scale-105 md:mx-auto md:mb-6 md:h-16 md:w-16 md:text-2xl">
                2
              </div>
              <div>
                <h3 className="mb-1 text-xl font-bold text-text-dark md:mb-3">Choose a slot</h3>
                <p className="text-text-mid">View real-time availability and select a time that works best for you.</p>
              </div>
            </div>
            <div className="stagger-child flex items-center gap-4 rounded-2xl border border-white/40 bg-white/45 p-5 text-left backdrop-blur-md transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-lg hover:shadow-blue-primary/8 md:flex-col md:items-stretch md:p-8 md:text-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-primary text-xl font-bold text-white transition-transform duration-300 hover:scale-105 md:mx-auto md:mb-6 md:h-16 md:w-16 md:text-2xl">
                3
              </div>
              <div>
                <h3 className="mb-1 text-xl font-bold text-text-dark md:mb-3">Confirm</h3>
                <p className="text-text-mid">Enter your details and instantly receive your booking confirmation.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link href="/search" className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-xl border-2 border-white/20 bg-white/10 px-8 font-semibold text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-md hover:shadow-lg hover:-translate-y-0.5 transition-[background-color,box-shadow,transform,border-color] duration-300")}>
              Book Now
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <section className="px-4 py-20">
        <AnimatedSection animation="reveal-scale">
          <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-8 shadow-[0_12px_32px_rgba(26,18,100,0.18)] md:p-16 lg:py-32">
            <Image src="/cta_doctors_bg.webp" alt="" fill sizes="100vw" className="object-cover object-top opacity-70 lg:object-[center_25%]" />
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(235,235,224,0.12),transparent_28%)]" />
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
              <div className="flex max-w-xl flex-col text-center md:text-left">
                <h2 className="mb-4 text-heading font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
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
