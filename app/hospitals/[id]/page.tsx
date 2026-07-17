import Link from "next/link";
import { Building2, ArrowLeft, Stethoscope } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClinicBranchList from "@/components/ClinicBranchList";
import PhotoGallery from "@/components/PhotoGallery";

export const dynamic = "force-dynamic";

export default async function HospitalProfilePage({ params }: { params: { id: string } }) {
  const hospital = await prisma.hospitalGroup.findUnique({
    where: { id: params.id },
    include: {
      clinics: {
        include: {
          doctors: {
            where: { status: "Active" }
          }
        }
      }
    }
  });

  if (!hospital) {
    notFound();
  }

  // Calculate total doctors count
  const totalDoctors = hospital.clinics.reduce((sum, c) => sum + c.doctors.length, 0);

  const clinics = hospital.clinics.map((clinic) => {
    const rating = clinic.doctors.length
      ? clinic.doctors.reduce((sum, d) => sum + d.rating, 0) / clinic.doctors.length
      : null;
    const reviewCount = clinic.doctors.reduce((sum, d) => sum + d.reviews, 0);

    return {
      id: clinic.id,
      name: clinic.name,
      city: clinic.city,
      email: clinic.email,
      phone: clinic.phone,
      photoUrls: clinic.photoUrl ? clinic.photoUrl.split(",").map((s) => s.trim()).filter(Boolean) : [],
      aboutUs: clinic.aboutUs,
      rating,
      reviewCount,
      doctors: clinic.doctors.map((doc) => ({
        slug: doc.slug,
        name: doc.name,
        specialty: doc.specialty,
        rating: doc.rating,
        reviews: doc.reviews,
        city: doc.city,
        languages: doc.languages.split(",").map((lang) => lang.trim()),
        photoUrl: doc.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=2200CC&color=fff`,
        isVerified: true,
        fee: doc.fee,
      })),
    };
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Header / Hero Section */}
      <div className="bg-white border-b border-gray-border py-8 md:py-12 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          
          {/* Logo / photo gallery */}
          <PhotoGallery
            photoUrls={hospital.photoUrl ? hospital.photoUrl.split(",").map((s) => s.trim()).filter(Boolean) : []}
            name={hospital.name}
            size="hero"
            fallbackIcon={<Building2 className="w-12 h-12 text-gray-400" />}
          />

          <div className="flex-1 text-center md:text-left flex flex-col justify-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-primary hover:underline mb-3 uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-dark tracking-tight mb-2">
              {hospital.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-text-mid font-medium">
              <span className="flex items-center gap-1.5 bg-blue-light text-blue-primary px-3.5 py-1.5 rounded-full text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" /> {hospital.clinics.length} {hospital.clinics.length === 1 ? "Branch" : "Branches"}
              </span>
              <span className="flex items-center gap-1.5 bg-green-badge-bg text-green-badge px-3.5 py-1.5 rounded-full text-xs font-bold">
                <Stethoscope className="w-3.5 h-3.5" /> {totalDoctors} Affiliated {totalDoctors === 1 ? "Doctor" : "Doctors"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Branches Container */}
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-text-dark border-b border-gray-border pb-3">
          Our Clinics & Medical Branches
        </h2>

        <ClinicBranchList clinics={clinics} hospitalName={hospital.name} />
      </div>
    </div>
  );
}
