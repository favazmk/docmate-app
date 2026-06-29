import Link from "next/link";
import { Stethoscope, Star } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { country: string, city: string } }): Promise<Metadata> {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
  const country = params.country.toUpperCase();
  
  return {
    title: `Best Doctors & Clinics in ${city} | Book Online`,
    description: `Find top-rated doctors in ${city}, ${country}. Browse specialties, compare reviews, and book an appointment instantly.`
  };
}

export default function CityLandingPage({ params }: { params: { country: string, city: string } }) {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
  const country = params.country.toUpperCase();

  const specialties = [
    { name: "Cardiologist", icon: "❤️", doctors: 45 },
    { name: "Dermatologist", icon: "✨", doctors: 82 },
    { name: "Dentist", icon: "🦷", doctors: 156 },
    { name: "Pediatrician", icon: "👶", doctors: 67 },
    { name: "Gynecologist", icon: "🩺", doctors: 94 },
    { name: "Neurologist", icon: "🧠", doctors: 28 },
    { name: "Orthopedist", icon: "🦴", doctors: 51 },
    { name: "Ophthalmologist", icon: "👁️", doctors: 39 },
  ];

  return (
    <div className="bg-gray-bg min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm font-medium text-text-light mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${params.country}`} className="hover:text-blue-primary transition-colors uppercase">{country}</Link>
          <span>/</span>
          <span className="text-text-dark capitalize">{city}</span>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
            Healthcare in {city}
          </h1>
          <p className="text-lg text-text-mid leading-relaxed">
            Find the perfect doctor for your needs in {city}. Browse by specialty, read verified patient reviews, and book online in seconds.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">Browse by Specialty</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specialties.map((spec) => (
              <Link key={spec.name} href={`/${params.country}/${params.city}/${spec.name.toLowerCase()}`} className="bg-white border border-gray-border rounded-2xl p-6 shadow-sm hover:border-blue-primary hover:shadow-md transition-all group flex flex-col items-center text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{spec.icon}</div>
                <h3 className="text-lg font-bold text-text-dark mb-1 group-hover:text-blue-primary transition-colors">{spec.name}</h3>
                <span className="text-xs font-semibold text-text-light">{spec.doctors} Doctors</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
