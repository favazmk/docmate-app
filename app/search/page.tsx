import FilterSidebar from "@/components/FilterSidebar";
import DoctorCard from "@/components/DoctorCard";
import SortDropdown from "@/components/SortDropdown";
import { SlidersHorizontal, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import prisma from "@/lib/prisma";
import SearchInput from "@/components/SearchInput";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const specialty = typeof searchParams.specialty === "string" ? searchParams.specialty : undefined;
  const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "recommended";
  const gender = typeof searchParams.gender === "string" ? searchParams.gender : undefined;
  const languages = typeof searchParams.language === "string" ? [searchParams.language] : (searchParams.language || []);
  const query = typeof searchParams.query === "string" ? searchParams.query : undefined;
  const hospitalGroupId = typeof searchParams.hospitalGroupId === "string" ? searchParams.hospitalGroupId : undefined;
  const clinicId = typeof searchParams.clinicId === "string" ? searchParams.clinicId : undefined;

  // Build query where filter dynamically using AND combinations
  const andClauses: any[] = [{ status: "Active" }];

  if (specialty && specialty.trim() !== "") {
    andClauses.push({
      specialty: { contains: specialty.trim() }
    });
  }

  if (city && city.trim() !== "") {
    andClauses.push({
      city: { contains: city.trim() }
    });
  }

  if (gender && gender !== "Any") {
    andClauses.push({
      gender: gender
    });
  }

  if (languages.length > 0) {
    andClauses.push({
      OR: languages.map(lang => ({
        languages: { contains: lang }
      }))
    });
  }

  if (hospitalGroupId && hospitalGroupId.trim() !== "") {
    andClauses.push({
      clinic: {
        hospitalGroupId: hospitalGroupId.trim()
      }
    });
  }

  if (clinicId && clinicId.trim() !== "") {
    andClauses.push({
      clinicId: clinicId.trim()
    });
  }

  if (query && query.trim() !== "") {
    andClauses.push({
      OR: [
        { name: { contains: query.trim() } },
        { specialty: { contains: query.trim() } },
        { affiliation: { contains: query.trim() } }
      ]
    });
  }

  const whereClause = { AND: andClauses };

  // Sort logic
  let orderByClause: any = {};
  if (sort === "highest-rated") {
    orderByClause = { rating: "desc" };
  } else if (sort === "most-reviewed") {
    orderByClause = { reviews: "desc" };
  } else {
    orderByClause = { createdAt: "desc" }; // Recommended fallback
  }

  const dbDoctors = await prisma.doctor.findMany({
    where: whereClause,
    orderBy: orderByClause,
    include: {
      clinic: {
        include: {
          hospitalGroup: true
        }
      }
    }
  });

  const allHospitalGroups = await prisma.hospitalGroup.findMany({
    select: { id: true, name: true }
  });

  const allClinics = await prisma.clinic.findMany({
    select: { id: true, name: true, city: true }
  });

  const doctors = dbDoctors.map(d => ({
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
    fee: d.fee
  }));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-dark mb-1">{doctors.length} doctors found</h1>
            <p className="text-sm text-text-mid">
              Showing results for{" "}
              <span className="font-semibold text-text-dark">
                {specialty || "All Specialties"}
              </span>{" "}
              {city && (
                <>
                  in <span className="font-semibold text-text-dark">{city}</span>
                </>
              )}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <SearchInput initialValue={query} />
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SortDropdown />

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger className="md:hidden flex-1 bg-white border border-gray-border rounded-xl h-11 flex items-center justify-center gap-2 text-sm font-medium text-text-dark shadow-sm">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
                <div className="h-full overflow-y-auto p-4 pb-20">
                  <FilterSidebar hospitalGroups={allHospitalGroups} clinics={allClinics} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-72 shrink-0">
            <div className="sticky top-8">
              <FilterSidebar hospitalGroups={allHospitalGroups} clinics={allClinics} />
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1 flex flex-col gap-6">
            {doctors.length === 0 ? (
              <div className="bg-white border border-gray-border rounded-xl p-12 text-center flex flex-col items-center gap-4">
                <SearchX className="w-10 h-10 text-text-light" />
                <h3 className="font-bold text-text-dark text-lg">No Doctors Found</h3>
                <p className="text-text-mid max-w-sm text-sm">We couldn't find any active doctors matching your search query. Try broadening your criteria or search parameters!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {doctors.map((doc, i) => (
                  <DoctorCard key={i} {...doc} variant="row" />
                ))}
              </div>
            )}

            {doctors.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" className="border-gray-border bg-white text-text-dark hover:bg-gray-bg hover:text-blue-primary font-semibold h-11 px-8 rounded-xl shadow-sm">
                  Load more doctors
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
