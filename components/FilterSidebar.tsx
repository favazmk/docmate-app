"use client";

import { Check, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentSpecialty = searchParams.get("specialty") || "";

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    
    if (val && val !== "All Specialties") {
      params.set("specialty", val);
    } else {
      params.delete("specialty");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const specialties = ["Dermatology", "Cardiology", "Orthopedics", "Pediatrics", "Neurology", "Dentistry"];
  const insurances = ["Daman", "AXA", "Bupa", "Tawuniya", "MetLife"];
  const languages = ["English", "Arabic", "French", "Hindi", "Urdu"];

  return (
    <div className="w-full bg-white border border-gray-border rounded-xl p-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-text-dark text-lg">Filters</h3>
        <button onClick={handleReset} className="text-sm font-medium text-blue-primary hover:underline">Reset</button>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Specialty</h4>
        <div className="relative">
          <select 
            value={currentSpecialty || "All Specialties"} 
            onChange={handleSpecialtyChange}
            className="w-full appearance-none bg-gray-bg border border-gray-border rounded-lg h-10 px-3 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary"
          >
            <option value="All Specialties">All Specialties</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-text-light pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Gender</h4>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-blue-light border-blue-primary text-blue-primary">Any</Button>
          <Button variant="outline" size="sm" className="flex-1 text-text-mid border-gray-border">Male</Button>
          <Button variant="outline" size="sm" className="flex-1 text-text-mid border-gray-border">Female</Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Insurance</h4>
        <div className="flex flex-col gap-2">
          {insurances.map(ins => (
            <label key={ins} className="flex items-center gap-2 cursor-pointer group">
              <div className="w-4 h-4 rounded border border-gray-border flex items-center justify-center group-hover:border-blue-primary">
                {/* Check icon would go here if checked */}
              </div>
              <span className="text-sm text-text-mid group-hover:text-text-dark">{ins}</span>
            </label>
          ))}
          <button className="text-sm text-blue-primary text-left font-medium mt-1">+ View more</button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Languages</h4>
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <div key={lang} className="px-3 py-1.5 rounded-full border border-gray-border text-xs font-medium text-text-mid cursor-pointer hover:border-blue-primary hover:text-blue-primary">
              {lang}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Consultation Fee (AED)</h4>
        <input type="range" className="w-full accent-blue-primary" min="0" max="1000" />
        <div className="flex items-center justify-between text-xs font-medium text-text-light">
          <span>0</span>
          <span>1000+</span>
        </div>
      </div>
    </div>
  );
}
