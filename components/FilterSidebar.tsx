"use client";

import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import CustomDropdown from "./ui/CustomDropdown";

interface HospitalGroupOption {
  id: string;
  name: string;
}

interface ClinicOption {
  id: string;
  name: string;
  city: string;
  hospitalGroupId?: string;
}

interface FilterSidebarProps {
  hospitalGroups?: HospitalGroupOption[];
  clinics?: ClinicOption[];
}

export default function FilterSidebar({ hospitalGroups = [], clinics = [] }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentSpecialty = searchParams.get("specialty") || "";
  const currentArea = searchParams.get("city") || "";
  const currentGender = searchParams.get("gender") || "Any";
  const currentLanguages = searchParams.getAll("language");
  const currentHospitalGroupId = searchParams.get("hospitalGroupId") || "";
  const currentClinicId = searchParams.get("clinicId") || "";

  const updateParam = (key: string, value: string | null, isArray: boolean = false) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (isArray) {
      if (value) {
        const values = params.getAll(key);
        if (values.includes(value)) {
          params.delete(key);
          values.filter(v => v !== value).forEach(v => params.append(key, v));
        } else {
          params.append(key, value);
        }
      }
    } else {
      if (value && value !== "All Specialties" && value !== "Any") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleHospitalGroupChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("hospitalGroupId", val);
    } else {
      params.delete("hospitalGroupId");
    }
    params.delete("clinicId"); // Clear clinic branch when group changes
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Family Medicine",
    "Gastroenterology",
    "General Surgery",
    "Gynecology",
    "Nephrology",
    "Neurology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Pulmonology",
    "Rheumatology",
    "Urology"
  ];
  const areas = [
    "Dubai",
    "Ajman",
    "Sharjah"
  ];
  const languages = ["English", "Arabic", "French", "Hindi", "Urdu"];

  // Filter clinics belonging to selected hospital group
  const filteredClinics = clinics.filter(c => !currentHospitalGroupId || c.hospitalGroupId === currentHospitalGroupId);

  return (
    <div className="w-full bg-white border border-gray-border rounded-xl p-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-text-dark text-lg">Filters</h3>
        <button onClick={handleReset} className="text-sm font-medium text-blue-primary hover:underline">Reset</button>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Specialty</h4>
        <CustomDropdown
          value={currentSpecialty}
          onChange={(val) => updateParam("specialty", val)}
          options={specialties}
          placeholder="All Specialties"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Emirate</h4>
        <CustomDropdown
          value={currentArea}
          onChange={(val) => updateParam("city", val)}
          options={areas}
          placeholder="All Emirates"
        />
      </div>

      {hospitalGroups.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Hospital Group</h4>
          <CustomDropdown
            value={currentHospitalGroupId}
            onChange={handleHospitalGroupChange}
            options={hospitalGroups.map(h => ({ value: h.id, label: h.name }))}
            placeholder="All Hospital Groups"
          />
        </div>
      )}

      {filteredClinics.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Clinic Branch</h4>
          <CustomDropdown
            value={currentClinicId}
            onChange={(val) => updateParam("clinicId", val)}
            options={filteredClinics.map(c => ({ value: c.id, label: `${c.name} (${c.city})` }))}
            placeholder="All Branches"
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Gender</h4>
        <div className="flex gap-2">
          {["Any", "Male", "Female"].map(g => (
            <Button 
              key={g}
              onClick={() => updateParam("gender", g)}
              variant="outline" 
              size="sm" 
              className={`flex-1 ${currentGender === g ? "bg-blue-light border-blue-primary text-blue-primary" : "text-text-mid border-gray-border"}`}
            >
              {g}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wider">Languages</h4>
        <div className="flex flex-col gap-2">
          {languages.map(lang => {
            const isChecked = currentLanguages.includes(lang);
            return (
              <label key={lang} className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); updateParam("language", lang, true); }}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? "bg-blue-primary border-blue-primary" : "border-gray-border group-hover:border-blue-primary"}`}>
                  {isChecked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${isChecked ? "text-text-dark font-medium" : "text-text-mid group-hover:text-text-dark"}`}>{lang}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
