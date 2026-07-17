"use client";

import { useState, useMemo } from "react";
import { Search, Stethoscope } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import CustomDropdown from "./ui/CustomDropdown";

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

  const [query, setQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const specialties = useMemo(() => {
    const list = doctors.map(d => d.specialty);
    return Array.from(new Set(list)).sort();
  }, [doctors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (selectedSpecialty) params.set("specialty", selectedSpecialty);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 rounded-3xl p-5 md:p-6 shadow-[0_12px_40px_rgba(26,18,100,0.06)] border border-gray-border/60 w-full max-w-4xl mx-auto -mt-16 md:-mt-24 relative z-10">
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-5">
        <div className="flex-1 relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search doctors, clinics, specialties..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-gray-100/60 border border-gray-border/40 rounded-xl h-[50px] pl-11 pr-4 w-full text-sm font-semibold focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 placeholder:text-text-light"
          />
        </div>
        <div className="sm:w-56">
          <CustomDropdown
            value={selectedSpecialty}
            onChange={setSelectedSpecialty}
            options={specialties}
            placeholder="All Specialties"
            icon={<Stethoscope className="w-4 h-4" />}
            labelPrefix="Specialty"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-primary hover:bg-blue-hover text-white rounded-xl h-12 text-base font-bold shadow-md shadow-blue-primary/10 transition-[background-color,box-shadow] flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        {query.trim() || selectedSpecialty ? "Search" : "Browse All Doctors"}
      </Button>
    </form>
  );
}
