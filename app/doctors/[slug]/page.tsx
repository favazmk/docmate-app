import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Star, MapPin, Globe, GraduationCap, ShieldCheck } from "lucide-react";
import BookingWidget from "@/components/BookingWidget";
import DoctorGallery from "@/components/DoctorGallery";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DoctorAboutSection from "@/components/DoctorAboutSection";
import DoctorReviews from "@/components/DoctorReviews";

export const dynamic = "force-dynamic";

export default async function DoctorProfilePage({ params }: { params: { slug: string } }) {
  const dbDoctor = await prisma.doctor.findUnique({
    where: { slug: params.slug },
    include: {
      reviewsList: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!dbDoctor || dbDoctor.status !== "Active") {
    notFound();
  }

  const doctor = {
    name: dbDoctor.name,
    specialty: dbDoctor.specialty,
    rating: dbDoctor.rating,
    reviews: dbDoctor.reviews,
    city: dbDoctor.city,
    languages: dbDoctor.languages.split(",").map(lang => lang.trim()),
    fee: dbDoctor.fee,
    currency: "AED",
    photoUrls: dbDoctor.photoUrl ? dbDoctor.photoUrl.split(",") : [],
    isVerified: true,
    experience: "15+ Years Experience",
    bio: dbDoctor.bio,
    qualifications: dbDoctor.qualifications
      ? dbDoctor.qualifications.split("\n").map(q => q.trim()).filter(Boolean)
      : [
          "MD, Board Certified Specialist",
          `Fellowship in Clinical ${dbDoctor.specialty}`,
          `Affiliated with ${dbDoctor.affiliation}`
        ],
    clinicName: dbDoctor.affiliation,
    insurances: ["Daman", "AXA", "Nextcare", "Oman Insurance", "MetLife"]
  };

  const initialReviews = dbDoctor.reviewsList.map(r => ({
    id: r.id,
    patientName: r.patientName,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt
  }));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm font-medium text-text-light mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/ae" className="hover:text-blue-primary transition-colors">UAE</Link>
          <span>/</span>
          <Link href="/ae/dubai" className="hover:text-blue-primary transition-colors">Dubai</Link>
          <span>/</span>
          <Link href="/ae/dubai/cardiologist" className="hover:text-blue-primary transition-colors">Cardiologist</Link>
          <span>/</span>
          <span className="text-text-dark">{doctor.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Header Card */}
            <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-sm">
              <DoctorGallery photoUrls={doctor.photoUrls} name={doctor.name} />
              
              <div className="flex flex-col flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-text-dark">{doctor.name}</h1>
                  {doctor.isVerified && (
                    <div className="flex items-center gap-1 bg-green-badge-bg text-green-badge px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </div>
                  )}
                </div>
                
                <h2 className="text-lg md:text-xl font-medium text-blue-primary mb-4">{doctor.specialty}</h2>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-text-mid mb-6">
                  <div className="flex items-center gap-1.5" title="Ratings are read-only placeholder">
                    <Star className="w-5 h-5 text-star-color fill-star-color" />
                    <span className="font-bold text-text-dark text-base">{doctor.rating.toFixed(1)}</span>
                    <span className="text-text-light underline cursor-help hover:text-blue-primary">({doctor.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-primary" />
                    <span className="font-semibold text-text-dark">{doctor.city}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium bg-blue-light text-blue-primary px-3 py-1 rounded-full">
                    {doctor.experience}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {doctor.languages.map(lang => (
                    <Badge key={lang} variant="secondary" className="bg-gray-bg text-text-mid font-semibold text-[11px] uppercase tracking-wider">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* About Section */}
            <DoctorAboutSection bio={doctor.bio} />

            {/* Qualifications */}
            <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-primary" />
                Education & Qualifications
              </h3>
              <ul className="flex flex-col gap-4">
                {doctor.qualifications.map((qual, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-mid">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-primary mt-2 shrink-0"></div>
                    <span className="leading-relaxed">{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Section */}
            <DoctorReviews 
              doctorId={dbDoctor.id} 
              doctorSlug={params.slug} 
              initialReviews={initialReviews} 
            />

            {/* Clinic Location */}
            <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 shadow-sm mb-12">
              <h3 className="text-xl font-bold text-text-dark mb-2 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-primary" />
                Clinic Location
              </h3>
              <p className="text-text-mid mb-6 font-medium">{doctor.clinicName}</p>
              
              <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-border overflow-hidden relative">
                {/* Placeholder for Google Maps iframe */}
                <div className="absolute inset-0 bg-[#E5E3DF] flex items-center justify-center">
                  <div className="flex flex-col items-center text-text-light gap-2">
                    <MapPin className="w-8 h-8 text-blue-primary/50" />
                    <span className="text-sm font-semibold">Map View Loading...</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Booking Widget (Right) */}
          <div className="lg:col-span-1">
            <BookingWidget slug={params.slug} doctorName={doctor.name} clinicName={doctor.clinicName} />
          </div>

        </div>
      </div>
    </div>
  );
}
