"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import ClinicBranchList from "./ClinicBranchList";
import DoctorCard from "./DoctorCard";
import { Users, Building2, Search, MapPin } from "lucide-react";
import CustomDropdown from "./ui/CustomDropdown";
import { normalizeSearchText } from "@/lib/utils";

interface DoctorData {
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  languages: string[];
  photoUrl: string;
  isVerified: boolean;
  fee: number;
  clinics?: { name: string; city: string; hospitalGroup?: { name: string } }[];
}

interface ClinicData {
  id: string;
  name: string;
  city: string;
  email: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;
  const [selectedBranch, setSelectedBranch] = useState("");
  const doctorsTopRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef(false);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedBranch, searchQuery]);

  // Paging swaps the list in place, so scroll back to its heading — otherwise the
  // viewport stays parked on the pagination row and the new page looks like nothing loaded.
  const goToPage = (page: number) => {
    pendingScrollRef.current = true;
    setCurrentPage(page);
  };

  // Measure and scroll only after the new page has been committed to the DOM.
  // Doing it inside the click handler measured the outgoing layout, and a smooth
  // scroll started there gets cancelled the moment the swapped-in cards settle —
  // which is why stepping back to a page whose images were already cached failed
  // while stepping forward to an uncached one appeared to work.
  useEffect(() => {
    if (!pendingScrollRef.current) return;
    pendingScrollRef.current = false;

    const frame = requestAnimationFrame(() => {
      const top = doctorsTopRef.current;
      if (!top) return;
      // 56px sticky navbar + a little breathing room
      const y = top.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(y, 0), behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [currentPage]);

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(doc => {
      const normQuery = normalizeSearchText(searchQuery);
      const matchesSearch = normalizeSearchText(doc.name).includes(normQuery) || 
        normalizeSearchText(doc.specialty).includes(normQuery) ||
        (doc.clinics?.some(c => normalizeSearchText(c.name).includes(normQuery)));
      
      const matchesBranch = selectedBranch === "" || doc.clinics?.some(c => `${hospitalName} - ${c.name}` === selectedBranch);

      return matchesSearch && matchesBranch;
    });
  }, [allDoctors, searchQuery, selectedBranch, hospitalName]);
  const branchOptions = clinics.map(clinic => ({
    value: `${hospitalName} - ${clinic.name}`,
    label: (
      <div className="flex flex-col">
        <span className="font-semibold">{clinic.name}</span>
        <span className="text-xs text-text-light flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3" /> {clinic.city}
        </span>
      </div>
    )
  }));

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
            <div ref={doctorsTopRef} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-border pb-3 mb-6 gap-4">
              <h2 className="text-2xl font-bold text-text-dark">
                All Doctors at {hospitalName}
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="w-full sm:w-64">
                  <CustomDropdown
                    value={selectedBranch}
                    onChange={setSelectedBranch}
                    options={branchOptions}
                    placeholder="All Branches"
                    icon={<Building2 className="w-4 h-4" />}
                  />
                </div>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-text-light" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search doctors or specialties..."
                    className="w-full pl-9 pr-3 py-3 bg-white border border-gray-border rounded-xl text-sm text-text-dark placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-blue-primary/50 focus:border-blue-primary transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-border/60">
                <p className="text-text-mid font-medium">No doctors found matching your criteria.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 [overflow-anchor:none]">
                {filteredDoctors.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((doc, idx) => (
                  <DoctorCard key={`${doc.slug}-${idx}`} {...doc} variant="row" />
                ))}

                {filteredDoctors.length > PAGE_SIZE && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => goToPage(currentPage - 1)}
                      className="flex items-center gap-1 border border-gray-border text-text-dark px-3 py-1.5 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium text-text-mid px-4">
                      Page {currentPage} of {Math.ceil(filteredDoctors.length / PAGE_SIZE)}
                    </span>
                    <button
                      disabled={currentPage >= Math.ceil(filteredDoctors.length / PAGE_SIZE)}
                      onClick={() => goToPage(currentPage + 1)}
                      className="flex items-center gap-1 border border-gray-border text-text-dark px-3 py-1.5 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
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
                  className="w-full pl-9 pr-3 py-3 bg-white border border-gray-border rounded-xl text-sm text-text-dark placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-blue-primary/50 focus:border-blue-primary transition-colors"
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
