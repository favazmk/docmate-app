"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, Phone, Mail, Star } from "lucide-react";
import DoctorCard from "./DoctorCard";
import PhotoGallery from "./PhotoGallery";
import { DOCMATE_PHONE } from "@/lib/constants";

export interface ClinicDoctor {
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  city: string;
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
  phone: string;
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
  const [activeTab, setActiveTab] = useState<"doctors" | "about">("doctors");
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

          <div className="flex flex-col gap-2 text-xs md:text-sm text-text-dark font-semibold">
            <div className="flex items-center gap-2 bg-gray-bg border border-gray-border px-4 py-2 rounded-xl">
              <Phone className="w-4 h-4 text-blue-primary shrink-0" />
              <span>{DOCMATE_PHONE}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-bg border border-gray-border px-4 py-2 rounded-xl">
              <Mail className="w-4 h-4 text-blue-primary shrink-0" />
              <span>{clinic.email}</span>
            </div>
          </div>
        </div>

        {/* Right column - photo gallery */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <PhotoGallery
            photoUrls={clinic.photoUrls}
            name={clinic.name}
            size="branch"
            fallbackIcon={<Building2 className="w-12 h-12 text-gray-400" />}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-5">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("doctors")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              activeTab === "doctors" ? "bg-blue-primary text-white" : "bg-gray-bg text-text-mid hover:bg-gray-200"
            }`}
          >
            Doctors
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              activeTab === "about" ? "bg-blue-primary text-white" : "bg-gray-bg text-text-mid hover:bg-gray-200"
            }`}
          >
            About Us
          </button>
        </div>

        {activeTab === "doctors" ? (
          <div>
            <h4 className="text-xs font-extrabold text-text-light uppercase tracking-wider mb-5">
              Doctors at this branch ({clinic.doctors.length})
            </h4>

            {clinic.doctors.length === 0 ? (
              <p className="text-sm text-text-light font-medium italic">
                No active doctors registered under this clinic branch.
              </p>
            ) : (
              <div className="flex flex-col gap-5">
                {clinic.doctors.map((doc) => (
                  <DoctorCard key={doc.slug} {...doc} variant="row" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {clinic.aboutUs ? (
              <p className="text-sm text-text-dark leading-relaxed whitespace-pre-line">{clinic.aboutUs}</p>
            ) : (
              <p className="text-sm text-text-light font-medium italic">
                No description added yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
