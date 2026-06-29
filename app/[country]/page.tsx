import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const country = params.country.toUpperCase();
  
  return {
    title: `Find the Best Doctors in ${country} | Book Online`,
    description: `Find and book verified doctors, dentists, and specialists across the ${country}. View profiles, check insurance, and book appointments instantly.`
  };
}

export default function CountryLandingPage({ params }: { params: { country: string } }) {
  const country = params.country.toUpperCase();
  
  // Mock data for cities
  const cities = [
    { name: "Dubai", slug: "dubai", doctors: 1240 },
    { name: "Abu Dhabi", slug: "abu-dhabi", doctors: 850 },
    { name: "Sharjah", slug: "sharjah", doctors: 420 },
    { name: "Al Ain", slug: "al-ain", doctors: 210 },
  ];

  const specialties = ["Cardiologist", "Dermatologist", "Dentist", "Pediatrician", "Gynecologist", "Neurologist"];

  return (
    <div className="bg-gray-bg min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm font-medium text-text-light mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-dark uppercase">{country}</span>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
            Find Top Doctors in the {country}
          </h1>
          <p className="text-lg text-text-mid leading-relaxed">
            Select a city to find the best healthcare providers near you. Book appointments instantly with top-rated specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {cities.map((city) => (
            <Link key={city.slug} href={`/${params.country}/${city.slug}`} className="bg-white border border-gray-border rounded-2xl p-6 shadow-sm hover:border-blue-primary hover:shadow-md transition-all group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-light rounded-full flex items-center justify-center text-blue-primary mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-text-dark mb-2 group-hover:text-blue-primary transition-colors">{city.name}</h2>
              <span className="text-sm font-medium text-text-mid bg-gray-bg px-3 py-1 rounded-full">{city.doctors} Doctors</span>
            </Link>
          ))}
        </div>

        <div className="bg-white border border-gray-border rounded-3xl p-8 md:p-12 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-text-dark mb-8">Popular Specialties in the {country}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {specialties.map((specialty) => (
              <Link key={specialty} href={`/${params.country}/dubai/${specialty.toLowerCase()}`} className="border border-gray-border hover:border-blue-primary hover:text-blue-primary text-text-dark font-medium px-6 py-3 rounded-xl transition-colors">
                {specialty}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
