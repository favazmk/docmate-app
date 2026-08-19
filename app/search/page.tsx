import FilterSidebar from "@/components/FilterSidebar";
import DoctorCard from "@/components/DoctorCard";
import SortDropdown from "@/components/SortDropdown";
import { SearchX } from "lucide-react";
import prisma from "@/lib/prisma";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import MobileFilterSheet from "@/components/MobileFilterSheet";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const PAGE_SIZE = 15;
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
      clinics: {
        some: {
          city: { contains: city.trim() }
        }
      }
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
      clinics: {
        some: {
          hospitalGroupId: hospitalGroupId.trim()
        }
      }
    });
  }

  if (clinicId && clinicId.trim() !== "") {
    andClauses.push({
      clinics: {
        some: {
          id: clinicId.trim()
        }
      }
    });
  }

  if (query && query.trim() !== "") {
    const cleanQuery = query.trim();
    // Try to handle missing or extra apostrophes (e.g. kings -> king's, king's -> kings)
    const queryWithApostropheS = cleanQuery.replace(/s$/i, "'s");
    const queryWithoutApostrophe = cleanQuery.replace(/'/g, "");

    andClauses.push({
      OR: [
        { name: { contains: cleanQuery } },
        { specialty: { contains: cleanQuery } },
        { clinics: { some: { OR: [{ name: { contains: cleanQuery } }, { hospitalGroup: { name: { contains: cleanQuery } } }] } } },
        { name: { contains: queryWithApostropheS } },
        { name: { contains: queryWithoutApostrophe } },
        { clinics: { some: { OR: [{ name: { contains: queryWithApostropheS } }, { hospitalGroup: { name: { contains: queryWithApostropheS } } }] } } },
        { clinics: { some: { OR: [{ name: { contains: queryWithoutApostrophe } }, { hospitalGroup: { name: { contains: queryWithoutApostrophe } } }] } } }
      ]
    });
  }

  const whereClause = { AND: andClauses };

  // Sort logic. Values come from SORT_OPTIONS in components/SortDropdown.tsx —
  // keep the two in step. Each clause ends with a unique tie-breaker (name, then
  // id) so equal ratings keep a stable order across pages instead of shuffling
  // rows between page 1 and page 2.
  //
  // "recommended" is the default the vast majority of visitors see, and it leads
  // with the admin's own running order (Doctor.displayOrder — 1 pins a doctor to
  // the top). Unpositioned doctors carry 9999 and fall in behind, newest first.
  // The explicit sorts deliberately ignore displayOrder: someone who asked for
  // A-to-Z wants A-to-Z, not the admin's pins jumping the queue.
  const SORT_CLAUSES: Record<string, any[]> = {
    "highest-rated": [{ rating: "desc" }, { reviews: "desc" }, { name: "asc" }],
    "most-reviewed": [{ reviews: "desc" }, { rating: "desc" }, { name: "asc" }],
    "name-asc": [{ name: "asc" }],
    "name-desc": [{ name: "desc" }],
    recommended: [{ displayOrder: "asc" }, { createdAt: "desc" }, { name: "asc" }],
  };

  const orderByClause = [...(SORT_CLAUSES[sort] || SORT_CLAUSES.recommended), { id: "asc" }];

  const totalCount = await prisma.doctor.count({ where: whereClause });

  const dbDoctors = await prisma.doctor.findMany({
    where: whereClause,
    orderBy: orderByClause,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      clinics: {
        select: {
          name: true,
          city: true,
          hospitalGroup: { select: { name: true } }
        }
      }
    }
  });

  const allHospitalGroups = await prisma.hospitalGroup.findMany({
    select: { 
      id: true, 
      name: true,
      clinics: {
        select: {
          id: true,
          name: true,
          city: true,
          hospitalGroup: {
            select: { name: true }
          }
        }
      }
    }
  });

  const allClinics = await prisma.clinic.findMany({
    select: { id: true, name: true, city: true }
  });

  const doctors = dbDoctors.map(d => ({
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    type: d.type,
    rating: d.rating,
    reviews: d.reviews,
    city: d.clinics.length > 0 ? d.clinics[0].city : "",
    isVerified: true,
    languages: d.languages.split(",").map((lang: string) => lang.trim()),
    photoUrl: d.photoUrl || `https://ui-avatars.com/api/?format=png&name=${encodeURIComponent(d.name)}&background=2200CC&color=fff`,
    clinics: d.clinics,
    fee: d.fee,
    experience: d.experience,
    availableDays: d.availableDays || undefined,
    availableTime: d.availableTime || undefined
  }));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-dark mb-1">{totalCount} doctors found</h1>
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
            <SearchInput initialValue={query} doctors={doctors} hospitalGroups={allHospitalGroups} />
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SortDropdown />

              {/* Mobile Filter Button */}
              <MobileFilterSheet
                hospitalGroups={allHospitalGroups}
                clinics={allClinics}
                resultCount={totalCount}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-72 shrink-0">
            <div className="sticky top-[72px]">
              <FilterSidebar
                hospitalGroups={allHospitalGroups}
                clinics={allClinics}
                className="max-h-[calc(100vh-88px)]"
              />
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

            {totalCount > 0 && (
              <Pagination currentPage={page} totalPages={Math.ceil(totalCount / PAGE_SIZE)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
