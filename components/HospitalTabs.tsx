"use client";

import { useState } from "react";
import ClinicBranchList from "./ClinicBranchList";
import DoctorCard from "./DoctorCard";
import { Users, Building2, Search } from "lucide-react";

interface DoctorData {
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  city: string;
  languages: string[];
  photoUrl: string;
  isVerified: boolean;
  fee: number;
  clinicName?: string;
}

interface ClinicData {
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  photoUrls: string[];
  aboutUs: string | null;
  rating: number | null;
  reviewCount: number;
  doctors: DoctorData[];
}

interface HospitalTabsProps {
  clinics: ClinicData[];
  allDoctors: DoctorData[];
  hospitalName: string;
}

export default function HospitalTabs({ clinics, allDoctors, hospitalName }: HospitalTabsProps) {
  const [activeTab, setActiveTab] = useState<"doctors" | "branches">("doctors");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = allDoctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.clinicName && doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex bg-gray-bg p-1.5 rounded-xl border border-gray-border w-full md:w-fit self-start">
        <button
          onClick={() => { setActiveTab("doctors"); setSearchQuery(""); }}
          className={`flex-1 md:w-48 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-200 ${
            activeTab === "doctors"
              ? "bg-white text-blue-primary shadow-sm ring-1 ring-gray-border/50"
              : "text-text-mid hover:text-text-dark hover:bg-gray-100/50"
          }`}
        >
          <Users className="w-4 h-4" /> Our Doctors
        </button>
        <button
          onClick={() => { setActiveTab("branches"); setSearchQuery(""); }}
          className={`flex-1 md:w-48 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-200 ${
            activeTab === "branches"
              ? "bg-white text-blue-primary shadow-sm ring-1 ring-gray-border/50"
              : "text-text-mid hover:text-text-dark hover:bg-gray-100/50"
          }`}
        >
          <Building2 className="w-4 h-4" /> Our Branches
        </button>
      </div>

      <div className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "doctors" ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-border pb-3 mb-6 gap-4">
              <h2 className="text-2xl font-bold text-text-dark">
                All Doctors at {hospitalName}
              </h2>
              
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-text-light" />
                </div>
                <input
                  type="text"
                  placeholder="Search doctors or specialties..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-border rounded-lg text-sm text-text-dark placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-blue-primary/50 focus:border-blue-primary transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-border/60">
                <p className="text-text-mid font-medium">No doctors found matching "{searchQuery}".</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {filteredDoctors.map((doc, idx) => (
                  <DoctorCard key={`${doc.slug}-${idx}`} {...doc} variant="row" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-border pb-3 mb-6 gap-4">
              <h2 className="text-2xl font-bold text-text-dark">
                Our Clinics & Medical Branches
              </h2>
              
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-text-light" />
                </div>
                <input
                  type="text"
                  placeholder="Search branches by name or city..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-border rounded-lg text-sm text-text-dark placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-blue-primary/50 focus:border-blue-primary transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ClinicBranchList clinics={clinics} hospitalName={hospitalName} searchQuery={searchQuery} />
          </div>
        )}
      </div>
    </div>
  );
}
