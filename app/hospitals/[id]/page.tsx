import Image from "next/image";
import Link from "next/link";
import { Building2, Phone, Mail, Star, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

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

  return (
    <div className="bg-gray-bg min-h-screen pb-20">
      {/* Header / Hero Section */}
      <div className="bg-white border-b border-gray-border py-8 md:py-12 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          
          {/* Logo container */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border border-gray-border bg-gray-50 flex items-center justify-center shadow-inner shrink-0">
            {hospital.photoUrl ? (
              <Image src={hospital.photoUrl} alt={hospital.name} fill className="object-cover" />
            ) : (
              <Building2 className="w-12 h-12 text-gray-400" />
            )}
          </div>

          <div className="flex-1 text-center md:text-left flex flex-col justify-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-primary hover:underline mb-3 uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-dark tracking-tight mb-2">
              {hospital.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-text-mid font-medium">
              <span className="flex items-center gap-1.5 bg-blue-light text-blue-primary px-3.5 py-1.5 rounded-full text-xs font-bold">
                🏢 {hospital.clinics.length} {hospital.clinics.length === 1 ? "Branch" : "Branches"}
              </span>
              <span className="flex items-center gap-1.5 bg-green-badge-bg text-green-badge px-3.5 py-1.5 rounded-full text-xs font-bold">
                👨‍⚕️ {totalDoctors} Affiliated {totalDoctors === 1 ? "Doctor" : "Doctors"}
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

        {hospital.clinics.length === 0 ? (
          <div className="bg-white border border-gray-border rounded-3xl p-8 text-center text-text-mid font-semibold">
            No medical branches found under this group.
          </div>
        ) : (
          hospital.clinics.map((clinic) => (
            <div key={clinic.id} className="bg-white border border-gray-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
              
              {/* Branch Details Row */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-gray-border w-full">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-border bg-gray-50 flex items-center justify-center shrink-0">
                    {clinic.photoUrl ? (
                      <Image src={clinic.photoUrl} alt={clinic.name} fill className="object-cover" />
                    ) : (
                      <Building2 className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-blue-primary uppercase tracking-wide mb-1">
                      {clinic.city} Branch
                    </span>
                    <h3 className="text-xl font-extrabold text-text-dark">
                      {clinic.name}
                    </h3>
                    <p className="text-xs font-medium text-text-mid mt-1">
                      Part of {hospital.name} healthcare network
                    </p>
                  </div>
                </div>

                {/* Contact Columns */}
                <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-text-dark font-semibold w-full lg:w-auto">
                  <div className="flex items-center gap-2 bg-gray-bg border border-gray-border px-4 py-2 rounded-xl flex-1 sm:flex-none justify-center">
                    <Phone className="w-4 h-4 text-blue-primary shrink-0" />
                    <span>{clinic.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-bg border border-gray-border px-4 py-2 rounded-xl flex-1 sm:flex-none justify-center">
                    <Mail className="w-4 h-4 text-blue-primary shrink-0" />
                    <span>{clinic.email}</span>
                  </div>
                </div>
              </div>

              {/* Doctors at this Branch */}
              <div>
                <h4 className="text-xs font-extrabold text-text-light uppercase tracking-wider mb-5">
                  Doctors at this branch ({clinic.doctors.length})
                </h4>

                {clinic.doctors.length === 0 ? (
                  <p className="text-sm text-text-light font-medium italic">
                    No active doctors registered under this clinic branch.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {clinic.doctors.map((doc) => (
                      <div 
                        key={doc.id}
                        className="bg-white border border-gray-border hover:border-blue-primary hover:shadow-md rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 relative group"
                      >
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-border bg-gray-bg mb-3 shrink-0">
                          <Image 
                            src={doc.photoUrl ? doc.photoUrl.split(',')[0] : `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=2200CC&color=fff`} 
                            alt={doc.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <h5 className="font-bold text-text-dark text-sm truncate w-full group-hover:text-blue-primary transition-colors">
                          {doc.name}
                        </h5>
                        <span className="text-xs text-blue-primary font-bold uppercase tracking-wide mt-0.5 truncate w-full">
                          {doc.specialty}
                        </span>
                        
                        <div className="flex items-center gap-1 mt-2 mb-4 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-[11px] font-bold text-yellow-700">{doc.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-yellow-600">({doc.reviews})</span>
                        </div>

                        <Link href={`/doctors/${doc.slug}`} className="w-full mt-auto">
                          <button className="w-full bg-blue-light hover:bg-blue-primary hover:text-white text-blue-primary text-xs font-bold py-2.5 px-3 rounded-xl transition-all duration-200">
                            Book Appointment
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
