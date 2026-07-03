"use client";

import { Check, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import CustomDropdown from "./ui/CustomDropdown";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentSpecialty = searchParams.get("specialty") || "";
  const currentGender = searchParams.get("gender") || "Any";
  const currentInsurances = searchParams.getAll("insurance");
  const currentLanguages = searchParams.getAll("language");

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
        <CustomDropdown
          value={currentSpecialty}
          onChange={(val) => updateParam("specialty", val)}
          options={specialties}
          placeholder="All Specialties"
        />
      </div>

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
