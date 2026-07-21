import Link from "next/link";
import FilterSidebar from "@/components/FilterSidebar";
import DoctorCard from "@/components/DoctorCard";
import { SlidersHorizontal, SearchX } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Metadata } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { emirate: string, specialty: string } }): Promise<Metadata> {
  const emirate = params.emirate.replace("-", " ");
  const emirateFormatted = emirate.charAt(0).toUpperCase() + emirate.slice(1);
  const specialtyFormatted = params.specialty.charAt(0).toUpperCase() + params.specialty.slice(1);
  
  return {
    title: `Top ${specialtyFormatted} Doctors in ${emirateFormatted} | Book Online`,
    description: `Find and book verified ${specialtyFormatted} specialists in ${emirateFormatted}. View profiles, check insurance, and book appointments instantly.`
  };
}

export default async function SpecialtyCityPage({ 
  params,
  searchParams
}: { 
  params: { emirate: string, specialty: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const emirate = params.emirate.replace("-", " ");
  const emirateFormatted = emirate.charAt(0).toUpperCase() + emirate.slice(1);
  const specialtyFormatted = params.specialty.charAt(0).toUpperCase() + params.specialty.slice(1);

  const gender = typeof searchParams.gender === "string" ? searchParams.gender : undefined;
  const languages = typeof searchParams.language === "string" ? [searchParams.language] : (searchParams.language || []);

  const whereClause: any = {
    status: "Active",
    city: { contains: emirateFormatted },
    specialty: { contains: params.specialty }
  };

  if (gender && gender !== "Any") {
    whereClause.gender = gender;
  }

  if (languages.length > 0) {
    whereClause.OR = languages.map(lang => ({
      languages: { contains: lang }
    }));
  }

  const dbDoctors = await prisma.doctor.findMany({
    where: whereClause,
    include: {
      clinic: {
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
    rating: d.rating,
    reviews: d.reviews,
    city: d.city,
    languages: d.languages.split(",").map(lang => lang.trim()),
    photoUrl: d.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2200CC&color=fff`,
    isVerified: true,
    clinicName: d.clinic ? `${d.clinic.hospitalGroup.name} - ${d.clinic.name}` : d.affiliation,
    fee: d.fee,
    availableDays: d.availableDays || undefined,
    availableTime: d.availableTime || undefined
  }));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm font-medium text-text-light mb-8 flex items-center gap-2 capitalize">
          <Link href="/" className="hover:text-blue-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${params.emirate}`} className="hover:text-blue-primary transition-colors">{emirateFormatted}</Link>
          <span>/</span>
          <span className="text-text-dark">{specialtyFormatted}</span>
        </div>

        {/* SEO Header */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-4 capitalize">
            Best {specialtyFormatted} Doctors in {emirateFormatted}
          </h1>
          <p className="text-text-mid text-lg leading-relaxed">
            Need to see a {specialtyFormatted.toLowerCase()} in {emirateFormatted}? We've curated a list of the top-rated specialists near you. 
            Compare verified patient reviews and book an appointment online instantly.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-text-dark">{featuredDoctors.length} doctors available</h2>
          
          <Sheet>
            <SheetTrigger className="md:hidden w-full bg-white border border-gray-border rounded-xl h-11 flex items-center justify-center gap-2 text-sm font-medium text-text-dark shadow-sm">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
              <div className="h-full overflow-y-auto p-4 pb-20">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block w-72 shrink-0">
            <div className="sticky top-8">
              <FilterSidebar />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {featuredDoctors.length === 0 ? (
              <div className="bg-white border border-gray-border rounded-xl p-12 text-center flex flex-col items-center gap-4">
                <SearchX className="w-10 h-10 text-text-light" />
                <h3 className="font-bold text-text-dark text-lg">No Doctors Found</h3>
                <p className="text-text-mid max-w-sm text-sm">We couldn't find any active {specialtyFormatted.toLowerCase()} doctors in {emirateFormatted} right now. Try searching in other cities or specialties!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {featuredDoctors.map((doc, i) => (
                  <DoctorCard key={i} {...doc} variant="row" />
                ))}
              </div>
            )}
          </div>
        </div>



      </div>
    </div>
  );
}
