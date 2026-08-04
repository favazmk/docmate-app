"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, Star, Users } from "lucide-react";
import PhotoGallery from "./PhotoGallery";
import ExpandableText from "./ExpandableText";

export interface ClinicDoctor {
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  languages: string[];
  photoUrl: string;
  isVerified: boolean;
  fee?: number;
}

export interface ClinicBranch {
  id: string;
  name: string;
  city: string;
  email: string;
  photoUrls: string[];
  aboutUs: string | null;
  rating: number | null;
  reviewCount: number;
  doctors: ClinicDoctor[];
}

export default function ClinicBranchCard({
  clinic,
  hospitalName,
}: {
  clinic: ClinicBranch;
  hospitalName: string;
}) {
  const avatarUrl = clinic.photoUrls[0];

  return (
    <div className="bg-white border border-gray-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-6 pb-6 border-b border-gray-border">
        {/* Left column - branch info */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-border bg-gray-50 flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={clinic.name} fill className="object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-blue-primary uppercase tracking-wide">
                {clinic.city} Branch
              </span>
              <h3 className="text-lg font-extrabold text-text-dark leading-tight">
                {clinic.name}
              </h3>
            </div>
          </div>

          <p className="text-xs font-medium text-text-mid">
            Part of {hospitalName} healthcare network
          </p>

          {clinic.rating !== null && (
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-star-color fill-star-color" />
              <span className="text-sm font-bold text-text-dark">{clinic.rating.toFixed(1)}</span>
              <span className="text-xs text-text-light">({clinic.reviewCount} reviews)</span>
            </div>
          )}
          
          <div className="mt-2">
            <Link
              href={`/search?clinicId=${clinic.id}`}
              className="inline-flex items-center justify-center gap-2 bg-blue-primary hover:bg-blue-hover text-white h-11 px-6 rounded-xl font-bold shadow-md shadow-blue-primary/20 transition-all w-full lg:w-auto"
            >
              <Users className="w-5 h-5" /> View Doctors
            </Link>
          </div>

        </div>

        {/* Right column - photo gallery */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-center lg:justify-start">
            <PhotoGallery
              photoUrls={clinic.photoUrls}
              name={clinic.name}
              size="branch"
              fallbackIcon={<Building2 className="w-12 h-12 text-gray-400" />}
            />
          </div>
          
          {/* Embedded Map */}
          <div className="w-full h-32 md:h-40 bg-gray-200 rounded-xl overflow-hidden border border-gray-border">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(hospitalName + ' ' + clinic.name + ', ' + clinic.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>
        </div>
      </div>

      {/* About Us */}
      {clinic.aboutUs && (
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-border lg:border-none lg:pt-0">
          <h4 className="text-xs font-extrabold text-text-light uppercase tracking-wider">About This Branch</h4>
          <ExpandableText text={clinic.aboutUs} maxLength={200} />
        </div>
      )}
    </div>
  );
}
