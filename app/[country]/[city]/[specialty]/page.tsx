import Link from "next/link";
import FilterSidebar from "@/components/FilterSidebar";
import DoctorCard from "@/components/DoctorCard";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { country: string, city: string, specialty: string } }): Promise<Metadata> {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
  const specialty = params.specialty.charAt(0).toUpperCase() + params.specialty.slice(1);
  
  return {
    title: `Top ${specialty} Doctors in ${city} | Book Online`,
    description: `Find and book verified ${specialty} specialists in ${city}. View profiles, check insurance, and book appointments instantly.`
  };
}

export default function SpecialtyCityPage({ params }: { params: { country: string, city: string, specialty: string } }) {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
  const specialty = params.specialty.charAt(0).toUpperCase() + params.specialty.slice(1);
  const country = params.country.toUpperCase();

  const featuredDoctors = [
    {
      slug: "dr-sara-johnson",
      name: "Dr. Sara Johnson",
      specialty: specialty,
      rating: 4.8,
      reviews: 89,
      city: city,
      countryFlag: "🇦🇪",
      languages: ["English", "French"],
      fee: 300,
      currency: "AED",
      photoUrl: "https://ui-avatars.com/api/?name=Sara+Johnson&background=059669&color=fff",
      isVerified: true,
    },
    {
      slug: "dr-ahmed-al-mansouri",
      name: "Dr. Ahmed Al Mansouri",
      specialty: specialty,
      rating: 4.9,
      reviews: 124,
      city: city,
      countryFlag: "🇦🇪",
      languages: ["Arabic", "English"],
      fee: 450,
      currency: "AED",
      photoUrl: "https://ui-avatars.com/api/?name=Ahmed+Al+Mansouri&background=2200CC&color=fff",
      isVerified: true,
    }
  ];

  return (
    <div className="bg-gray-bg min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm font-medium text-text-light mb-8 flex items-center gap-2 capitalize">
          <Link href="/" className="hover:text-blue-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${params.country}`} className="hover:text-blue-primary transition-colors uppercase">{country}</Link>
          <span>/</span>
          <Link href={`/${params.country}/${params.city}`} className="hover:text-blue-primary transition-colors">{city}</Link>
          <span>/</span>
          <span className="text-text-dark">{specialty}</span>
        </div>

        {/* SEO Header */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
            Best {specialty} Doctors in {city}, {country}
          </h1>
          <p className="text-text-mid text-lg leading-relaxed">
            Need to see a {specialty.toLowerCase()} in {city}? We've curated a list of the top-rated specialists near you. 
            Compare verified patient reviews, check accepted insurance plans, and book an appointment online instantly.
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredDoctors.map((doc, i) => (
                <DoctorCard key={i} {...doc} />
              ))}
            </div>
          </div>
        </div>

        {/* SEO FAQ Section */}
        <div className="mt-20 bg-white border border-gray-border rounded-2xl p-8 shadow-sm max-w-4xl">
          <h3 className="text-2xl font-bold text-text-dark mb-6">Frequently Asked Questions</h3>
          
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="font-bold text-text-dark text-lg mb-2">How do I book a {specialty.toLowerCase()} in {city}?</h4>
              <p className="text-text-mid">You can easily book a {specialty.toLowerCase()} in {city} by selecting an available time slot on any of the doctor profiles listed above. The booking is confirmed instantly.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-text-dark text-lg mb-2">What is the average consultation fee for a {specialty.toLowerCase()} in {city}?</h4>
              <p className="text-text-mid">The average consultation fee for a {specialty.toLowerCase()} in {city} ranges from AED 250 to AED 600, depending on the doctor's experience and the clinic's location.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-text-dark text-lg mb-2">Which insurance plans are accepted by {specialty.toLowerCase()} doctors in {city}?</h4>
              <p className="text-text-mid">Most clinics accept major insurance providers such as Daman, AXA, Nextcare, and MetLife. You can use our filter sidebar to find doctors who specifically accept your insurance plan.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
