"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, User, Stethoscope, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import CustomDropdown from "./ui/CustomDropdown";

interface DoctorData {
  slug: string;
  name: string;
  specialty: string;
  city: string;
}

interface ClinicData {
  id: string;
  name: string;
  city: string;
}

interface HospitalGroupData {
  id: string;
  name: string;
  clinics: ClinicData[];
}

interface SearchBarProps {
  doctors?: DoctorData[];
  hospitalGroups?: HospitalGroupData[];
}

export default function SearchBar({ doctors = [], hospitalGroups = [] }: SearchBarProps) {
  const router = useRouter();
  
  // Tab selector: cascading, hospital, keyword
  const [activeTab, setActiveTab] = useState<"cascading" | "hospital" | "keyword">("cascading");

  // Cascading fields
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDoctorSlug, setSelectedDoctorSlug] = useState("");

  // Hospital Cascading fields
  const [selectedHospitalGroupId, setSelectedHospitalGroupId] = useState("");
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [selectedHospitalSpecialty, setSelectedHospitalSpecialty] = useState("");

  // Keyword fields
  const [keywordQuery, setKeywordQuery] = useState("");
  const [keywordCity, setKeywordCity] = useState("");

  // Get unique specialties from all doctors
  const specialties = useMemo(() => {
    const list = doctors.map(d => d.specialty);
    return Array.from(new Set(list)).sort();
  }, [doctors]);

  // Get unique locations based on selected specialty
  const locations = useMemo(() => {
    if (!selectedSpecialty) return [];
    const filtered = doctors.filter(d => d.specialty === selectedSpecialty);
    const list = filtered.map(d => d.city);
    const unique = Array.from(new Set(list)).sort();
    return ["All Cities", ...unique];
  }, [selectedSpecialty, doctors]);

  // Get doctors based on selected specialty and location
  const availableDoctors = useMemo(() => {
    if (!selectedSpecialty || !selectedLocation) return [];
    return doctors.filter(d => {
      const matchesSpecialty = d.specialty === selectedSpecialty;
      if (selectedLocation === "All Cities") return matchesSpecialty;
      return matchesSpecialty && d.city === selectedLocation;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedSpecialty, selectedLocation, doctors]);

  // Hospital Group options list
  const hospitalGroupsList = useMemo(() => {
    return hospitalGroups.map(h => ({ value: h.id, label: h.name }));
  }, [hospitalGroups]);

  // Clinics options list based on selected Hospital Group
  const clinicsList = useMemo(() => {
    if (!selectedHospitalGroupId) return [];
    const hg = hospitalGroups.find(h => h.id === selectedHospitalGroupId);
    if (!hg) return [];
    const list = hg.clinics.map(c => ({ value: c.id, label: `${c.name} (${c.city})` }));
    return [{ value: "all", label: "All Clinic Branches" }, ...list];
  }, [selectedHospitalGroupId, hospitalGroups]);

  // Handle cascading resets
  const handleSpecialtyChange = (val: string) => {
    setSelectedSpecialty(val);
    setSelectedLocation("");
    setSelectedDoctorSlug("");
  };

  const handleLocationChange = (val: string) => {
    setSelectedLocation(val);
    setSelectedDoctorSlug("");
  };

  const handleHospitalGroupChange = (val: string) => {
    setSelectedHospitalGroupId(val);
    setSelectedClinicId("");
    setSelectedHospitalSpecialty("");
  };

  const handleClinicChange = (val: string) => {
    setSelectedClinicId(val);
    setSelectedHospitalSpecialty("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "cascading") {
      if (selectedDoctorSlug) {
        router.push(`/doctors/${selectedDoctorSlug}`);
      } else {
        const params = new URLSearchParams();
        if (selectedSpecialty) params.set("specialty", selectedSpecialty);
        if (selectedLocation && selectedLocation !== "All Cities") {
          params.set("city", selectedLocation);
        }
        router.push(`/search?${params.toString()}`);
      }
    } else if (activeTab === "hospital") {
      const params = new URLSearchParams();
      if (selectedHospitalGroupId) params.set("hospitalGroupId", selectedHospitalGroupId);
      if (selectedClinicId && selectedClinicId !== "all") params.set("clinicId", selectedClinicId);
      if (selectedHospitalSpecialty) params.set("specialty", selectedHospitalSpecialty);
      router.push(`/search?${params.toString()}`);
    } else {
      const params = new URLSearchParams();
      if (keywordQuery.trim()) {
        params.set("query", keywordQuery.trim());
      }
      if (keywordCity) {
        params.set("city", keywordCity);
      }
      router.push(`/search?${params.toString()}`);
    }
  };

  // Determine dynamic CTA button text
  const getButtonText = () => {
    if (activeTab === "cascading") {
      if (selectedDoctorSlug) {
        const doc = doctors.find(d => d.slug === selectedDoctorSlug);
        return `Book Appointment with ${doc ? doc.name : "Doctor"}`;
      }
      if (selectedSpecialty && selectedLocation) {
        return `Search ${selectedSpecialty} in ${selectedLocation}`;
      }
      if (selectedSpecialty) {
        return `Search ${selectedSpecialty} Doctors`;
      }
      return "Search All Doctors";
    } else if (activeTab === "hospital") {
      if (selectedHospitalGroupId) {
        const hg = hospitalGroups.find(h => h.id === selectedHospitalGroupId);
        const clinic = hg?.clinics.find(c => c.id === selectedClinicId);
        
        let targetText = hg?.name || "Hospital Group";
        if (clinic && selectedClinicId !== "all") {
          targetText = clinic.name;
        }
        
        if (selectedHospitalSpecialty) {
          return `Search ${selectedHospitalSpecialty} in ${targetText}`;
        }
        return `Search Doctors in ${targetText}`;
      }
      return "Search by Hospital & Clinic";
    } else {
      const cleanKeyword = keywordQuery.trim();
      if (cleanKeyword && keywordCity) {
        return `Search "${cleanKeyword}" in ${keywordCity}`;
      }
      if (cleanKeyword) {
        return `Search "${cleanKeyword}"`;
      }
      if (keywordCity) {
        return `Search Doctors in ${keywordCity}`;
      }
      return "Search All Doctors";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-gray-border w-full max-w-4xl mx-auto -mt-16 md:-mt-24 relative z-10">
      
      {/* Centered Switch Tabs */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-border/20 w-fit gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("cascading")}
            className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
              activeTab === "cascading" 
                ? "bg-white text-blue-primary shadow-sm font-extrabold" 
                : "text-text-mid hover:text-text-dark"
            }`}
          >
            Quick Booking Wizard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hospital")}
            className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
              activeTab === "hospital" 
                ? "bg-white text-blue-primary shadow-sm font-extrabold" 
                : "text-text-mid hover:text-text-dark"
            }`}
          >
            Find by Hospital & Clinic
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("keyword")}
            className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
              activeTab === "keyword" 
                ? "bg-white text-blue-primary shadow-sm font-extrabold" 
                : "text-text-mid hover:text-text-dark"
            }`}
          >
            Search by Name
          </button>
        </div>
      </div>

      {activeTab === "cascading" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-5">
          {/* Dropdown 1: Specialties */}
          <CustomDropdown
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
            options={specialties}
            placeholder="Select Specialty"
            icon={<Stethoscope className="w-4 h-4" />}
            labelPrefix="Specialty"
          />

          {/* Dropdown 2: Locations */}
          <CustomDropdown
            value={selectedLocation}
            onChange={handleLocationChange}
            options={locations}
            placeholder="Select City / Area"
            disabled={!selectedSpecialty}
            icon={<MapPin className="w-4 h-4" />}
            labelPrefix="City / Area"
          />

          {/* Dropdown 3: Available Doctors */}
          <CustomDropdown
            value={selectedDoctorSlug}
            onChange={setSelectedDoctorSlug}
            options={availableDoctors.map(d => ({ value: d.slug, label: d.name }))}
            placeholder="Select Doctor"
            disabled={!selectedSpecialty || !selectedLocation}
            icon={<User className="w-4 h-4" />}
            labelPrefix="Available Doctor"
          />
        </div>
      ) : activeTab === "hospital" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-5">
          {/* Dropdown 1: Hospital Group */}
          <CustomDropdown
            value={selectedHospitalGroupId}
            onChange={handleHospitalGroupChange}
            options={hospitalGroupsList}
            placeholder="Select Hospital Group"
            icon={<Building2 className="w-4 h-4" />}
            labelPrefix="Hospital Group"
          />

          {/* Dropdown 2: Clinic Branch */}
          <CustomDropdown
            value={selectedClinicId}
            onChange={handleClinicChange}
            options={clinicsList}
            placeholder="Select Clinic Branch"
            disabled={!selectedHospitalGroupId}
            icon={<MapPin className="w-4 h-4" />}
            labelPrefix="Clinic Branch"
          />

          {/* Dropdown 3: Specialty */}
          <CustomDropdown
            value={selectedHospitalSpecialty}
            onChange={setSelectedHospitalSpecialty}
            options={specialties}
            placeholder="Select Specialty"
            disabled={!selectedHospitalGroupId}
            icon={<Stethoscope className="w-4 h-4" />}
            labelPrefix="Specialty"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-5">
          {/* Keyword Search Input */}
          <div className="md:col-span-2 relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, clinic..."
              value={keywordQuery}
              onChange={(e) => setKeywordQuery(e.target.value)}
              className="bg-gray-bg border border-gray-border rounded-xl h-[50px] pl-11 pr-4 w-full text-sm font-semibold focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30"
            />
          </div>

          {/* UAE Cities Filter */}
          <div className="md:col-span-2">
            <CustomDropdown
              value={keywordCity}
              onChange={setKeywordCity}
              options={["Dubai", "Sharjah", "Abu Dhabi"]}
              placeholder="All Cities"
              icon={<MapPin className="w-4 h-4" />}
              labelPrefix="Location / City"
            />
          </div>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-blue-primary hover:bg-blue-hover text-white rounded-xl h-12 text-base font-bold shadow-md shadow-blue-primary/10 transition-all flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        {getButtonText()}
      </Button>
    </form>
  );
}
