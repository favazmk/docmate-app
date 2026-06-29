import FilterSidebar from "@/components/FilterSidebar";
import DoctorCard from "@/components/DoctorCard";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SearchResultsPage() {
  const featuredDoctors = [
    {
      slug: "dr-ahmed-al-mansouri",
      name: "Dr. Ahmed Al Mansouri",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 124,
      city: "Dubai",
      countryFlag: "🇦🇪",
      languages: ["Arabic", "English"],
      fee: 450,
      currency: "AED",
      photoUrl: "https://ui-avatars.com/api/?name=Ahmed+Al+Mansouri&background=2200CC&color=fff",
      isVerified: true,
    },
    {
      slug: "dr-sara-johnson",
      name: "Dr. Sara Johnson",
      specialty: "Dermatologist",
      rating: 4.8,
      reviews: 89,
      city: "Dubai",
      countryFlag: "🇦🇪",
      languages: ["English", "French"],
      fee: 300,
      currency: "AED",
      photoUrl: "https://ui-avatars.com/api/?name=Sara+Johnson&background=059669&color=fff",
      isVerified: true,
    },
    {
      slug: "dr-khalid-omar",
      name: "Dr. Khalid Omar",
      specialty: "Orthopedics",
      rating: 4.7,
      reviews: 210,
      city: "Abu Dhabi",
      countryFlag: "🇦🇪",
      languages: ["Arabic", "English"],
      fee: 400,
      currency: "AED",
      photoUrl: "https://ui-avatars.com/api/?name=Khalid+Omar&background=F59E0B&color=fff",
      isVerified: true,
    },
    {
      slug: "dr-maria-garcia",
      name: "Dr. Maria Garcia",
      specialty: "Pediatrician",
      rating: 5.0,
      reviews: 342,
      city: "Dubai",
      countryFlag: "🇦🇪",
      languages: ["English", "Spanish", "Arabic"],
      fee: 350,
      currency: "AED",
      photoUrl: "https://ui-avatars.com/api/?name=Maria+Garcia&background=EEF0FF&color=2200CC",
      isVerified: true,
    },
    {
      slug: "dr-fahad-al-otaibi",
      name: "Dr. Fahad Al Otaibi",
      specialty: "Cardiologist",
      rating: 4.6,
      reviews: 78,
      city: "Dubai",
      countryFlag: "🇦🇪",
      languages: ["Arabic", "English", "Urdu"],
      fee: 380,
      currency: "AED",
      photoUrl: "https://ui-avatars.com/api/?name=Fahad+Al+Otaibi&background=2200CC&color=fff",
      isVerified: false,
    },
  ];

  return (
    <div className="bg-gray-bg min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-dark mb-1">124 doctors found</h1>
            <p className="text-sm text-text-mid">Showing results for <span className="font-semibold text-text-dark">All Specialties</span> in <span className="font-semibold text-text-dark">UAE</span></p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 hidden md:block">
              <select className="w-full appearance-none bg-white border border-gray-border rounded-xl h-11 pl-4 pr-10 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary shadow-sm">
                <option>Sort by: Recommended</option>
                <option>Sort by: Highest Rated</option>
                <option>Sort by: Most Reviewed</option>
                <option>Sort by: Fee (Low to High)</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-4 top-3.5 text-text-light pointer-events-none" />
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger className="md:hidden flex-1 bg-white border border-gray-border rounded-xl h-11 flex items-center justify-center gap-2 text-sm font-medium text-text-dark shadow-sm">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
                <div className="h-full overflow-y-auto p-4 pb-20">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-72 shrink-0">
            <div className="sticky top-8">
              <FilterSidebar />
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDoctors.map((doc, i) => (
                <DoctorCard key={i} {...doc} />
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outline" className="border-gray-border bg-white text-text-dark hover:bg-gray-bg hover:text-blue-primary font-semibold h-11 px-8 rounded-xl shadow-sm">
                Load more doctors
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
