import Link from "next/link";
import FilterSidebar from "@/components/FilterSidebar";
import DoctorCard from "@/components/DoctorCard";
import { SearchX } from "lucide-react";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Pagination from "@/components/Pagination";
import MobileFilterSheet from "@/components/MobileFilterSheet";
import { notFound } from "next/navigation";
import {
  EMIRATES,
  LANDING_SPECIALTIES,
  isEmirateSlug,
  slugifySpecialty,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Resolves a URL slug back to the specialty name stored on Doctor.specialty.
 *
 * Doctor.specialty is free text, so the authoritative list is whatever active
 * doctors actually carry — the Specialty table can drift from it. The promoted
 * landing specialties are accepted too, so those pages still render (empty, with
 * the "No Doctors Found" state) when nobody is listed under them yet.
 *
 * Returns null for anything else, which is what stops /dubai/<anything> from
 * serving a thin page for a specialty that does not exist.
 */
async function resolveSpecialty(slug: string): Promise<string | null> {
  const normalized = slugifySpecialty(slug);

  const active = await prisma.doctor.findMany({
    where: { status: "Active" },
    select: { specialty: true },
    distinct: ["specialty"],
  });

  const fromDoctors = active.find(
    (d) => slugifySpecialty(d.specialty) === normalized
  )?.specialty;
  if (fromDoctors) return fromDoctors;

  return (
    LANDING_SPECIALTIES.find((s) => slugifySpecialty(s) === normalized) ?? null
  );
}

export async function generateMetadata({ params }: { params: { emirate: string, specialty: string } }): Promise<Metadata> {
  const emirateFormatted = EMIRATES[params.emirate.toLowerCase()];
  if (!emirateFormatted) {
    return { title: "Page not found" };
  }

  const specialtyName = await resolveSpecialty(params.specialty);
  if (!specialtyName) {
    return { title: "Page not found" };
  }

  return {
    title: `Top ${specialtyName} Doctors in ${emirateFormatted} | Book Online`,
    description: `Find and book verified ${specialtyName} specialists in ${emirateFormatted}. View profiles, check insurance, and book appointments instantly.`,
    alternates: {
      canonical: `/${params.emirate.toLowerCase()}/${slugifySpecialty(params.specialty)}`,
    },
  };
}

export default async function SpecialtyCityPage({ 
  params,
  searchParams
}: { 
  params: { emirate: string, specialty: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Both segments are wildcards, so they are checked before anything is queried.
  if (!isEmirateSlug(params.emirate)) {
    notFound();
  }

  const emirateFormatted = EMIRATES[params.emirate.toLowerCase()];

  const specialtyName = await resolveSpecialty(params.specialty);
  if (!specialtyName) {
    notFound();
  }

  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const PAGE_SIZE = 15;

  const gender = typeof searchParams.gender === "string" ? searchParams.gender : undefined;
  const languages = typeof searchParams.language === "string" ? [searchParams.language] : (searchParams.language || []);

  // Matched on the resolved name rather than the raw slug — "internal-medicine"
  // never matched "Internal Medicine" before, so multi-word specialties always
  // came back empty.
  const whereClause: any = {
    status: "Active",
    clinics: { some: { city: { contains: emirateFormatted } } },
    specialty: { contains: specialtyName }
  };

  if (gender && gender !== "Any") {
    whereClause.gender = gender;
  }

  if (languages.length > 0) {
    whereClause.OR = languages.map(lang => ({
      languages: { contains: lang }
    }));
  }

  const totalCount = await prisma.doctor.count({ where: whereClause });

  const dbDoctors = await prisma.doctor.findMany({
    where: whereClause,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      clinics: {
        include: {
          hospitalGroup: true
        }
      }
    }
  });

  const featuredDoctors = dbDoctors.map(d => ({
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    type: d.type,
    rating: d.rating,
    reviews: d.reviews,
    languages: d.languages.split(",").map((lang: string) => lang.trim()),
    photoUrl: d.photoUrl || `https://ui-avatars.com/api/?format=png&name=${encodeURIComponent(d.name)}&background=2200CC&color=fff`,
    isVerified: true,
    clinics: d.clinics,
    fee: d.fee,
    experience: d.experience,
    availableDays: d.availableDays || undefined,
    availableTime: d.availableTime || undefined
  }));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm font-medium text-text-light mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${params.emirate.toLowerCase()}`} className="hover:text-blue-primary transition-colors">{emirateFormatted}</Link>
          <span>/</span>
          <span className="text-text-dark">{specialtyName}</span>
        </div>

        {/* SEO Header */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
            Best {specialtyName} Doctors in {emirateFormatted}
          </h1>
          <p className="text-text-mid text-lg leading-relaxed">
            Need to see a {specialtyName.toLowerCase()} specialist in {emirateFormatted}? We&apos;ve curated a list of the top-rated specialists near you. 
            Compare verified patient reviews and book an appointment online instantly.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-text-dark">{totalCount} doctors available</h2>
          
          <MobileFilterSheet
            resultCount={totalCount}
            triggerClassName="md:hidden w-full bg-white border border-gray-border rounded-xl h-11 flex items-center justify-center gap-2 text-sm font-medium text-text-dark shadow-sm"
          />
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block w-72 shrink-0">
            <div className="sticky top-[72px]">
              <FilterSidebar className="max-h-[calc(100vh-88px)]" />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {featuredDoctors.length === 0 ? (
              <div className="bg-white border border-gray-border rounded-xl p-12 text-center flex flex-col items-center gap-4">
                <SearchX className="w-10 h-10 text-text-light" />
                <h3 className="font-bold text-text-dark text-lg">No Doctors Found</h3>
                <p className="text-text-mid max-w-sm text-sm">We couldn&apos;t find any active {specialtyName.toLowerCase()} doctors in {emirateFormatted} right now. Try searching in other cities or specialties!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {featuredDoctors.map((doc, i) => (
                  <DoctorCard key={i} {...doc} variant="row" />
                ))}
              </div>
            )}

            {totalCount > 0 && (
              <Pagination currentPage={page} totalPages={Math.ceil(totalCount / PAGE_SIZE)} />
            )}
          </div>
        </div>



      </div>
    </div>
  );
}
