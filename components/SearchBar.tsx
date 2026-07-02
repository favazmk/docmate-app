"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, User, Stethoscope } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface DoctorData {
  slug: string;
  name: string;
  specialty: string;
  city: string;
}

interface SearchBarProps {
  doctors?: DoctorData[];
}

export default function SearchBar({ doctors = [] }: SearchBarProps) {
  const router = useRouter();
  
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDoctorSlug, setSelectedDoctorSlug] = useState("");

  // 1. Get unique specialties from all doctors
  const specialties = useMemo(() => {
    const list = doctors.map(d => d.specialty);
    return Array.from(new Set(list)).sort();
  }, [doctors]);

  // 2. Get unique locations based on selected specialty
  const locations = useMemo(() => {
    if (!selectedSpecialty) return [];
    const filtered = doctors.filter(d => d.specialty === selectedSpecialty);
    const list = filtered.map(d => d.city);
    return Array.from(new Set(list)).sort();
  }, [selectedSpecialty, doctors]);

  // 3. Get doctors based on selected specialty and location
  const availableDoctors = useMemo(() => {
    if (!selectedSpecialty || !selectedLocation) return [];
    return doctors.filter(
      d => d.specialty === selectedSpecialty && d.city === selectedLocation
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedSpecialty, selectedLocation, doctors]);

  // Handle cascading reset
  const handleSpecialtyChange = (val: string) => {
    setSelectedSpecialty(val);
    setSelectedLocation("");
    setSelectedDoctorSlug("");
  };

  const handleLocationChange = (val: string) => {
    setSelectedLocation(val);
    setSelectedDoctorSlug("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDoctorSlug) {
      // Redirect to doctor profile page
      router.push(`/doctors/${selectedDoctorSlug}`);
    } else if (selectedSpecialty || selectedLocation) {
      // Redirect to search results page
      const params = new URLSearchParams();
      if (selectedSpecialty) params.set("specialty", selectedSpecialty);
      if (selectedLocation) params.set("city", selectedLocation);
      router.push(`/search?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-border w-full max-w-4xl mx-auto -mt-16 md:-mt-24 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4">
        
        {/* Dropdown 1: Specialties */}
        <div className="flex flex-col bg-gray-bg rounded-xl p-3 border border-gray-border focus-within:border-blue-primary transition-colors">
          <div className="flex items-center gap-1.5 mb-1 text-blue-primary">
            <Stethoscope className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">1. Specialty</span>
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => handleSpecialtyChange(e.target.value)}
            className="bg-transparent border-none outline-none text-text-dark font-medium w-full h-7 text-sm cursor-pointer"
          >
            <option value="">Select Specialty</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {/* Dropdown 2: Locations */}
        <div className={`flex flex-col bg-gray-bg rounded-xl p-3 border border-gray-border focus-within:border-blue-primary transition-colors ${!selectedSpecialty ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-1.5 mb-1 text-blue-primary">
            <MapPin className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">2. Area / Location</span>
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => handleLocationChange(e.target.value)}
            disabled={!selectedSpecialty}
            className="bg-transparent border-none outline-none text-text-dark font-medium w-full h-7 text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <option value="">Select Area</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Dropdown 3: Available Doctors */}
        <div className={`flex flex-col bg-gray-bg rounded-xl p-3 border border-gray-border focus-within:border-blue-primary transition-colors ${(!selectedSpecialty || !selectedLocation) ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-1.5 mb-1 text-blue-primary">
            <User className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">3. Available Doctor</span>
          </div>
          <select
            value={selectedDoctorSlug}
            onChange={(e) => setSelectedDoctorSlug(e.target.value)}
            disabled={!selectedSpecialty || !selectedLocation}
            className="bg-transparent border-none outline-none text-text-dark font-medium w-full h-7 text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <option value="">Select Doctor</option>
            {availableDoctors.map(doc => (
              <option key={doc.slug} value={doc.slug}>{doc.name}</option>
            ))}
          </select>
        </div>

      </div>
      
      <Button 
        type="submit" 
        disabled={!selectedSpecialty}
        className="w-full bg-blue-primary hover:bg-blue-hover text-white rounded-xl h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Search className="w-5 h-5 mr-2" />
        Search doctors
      </Button>
    </form>
  );
}
