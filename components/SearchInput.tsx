"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, User, Stethoscope, MapPin, Building2 } from "lucide-react";

interface DoctorData {
  slug: string;
  name: string;
  specialty: string;
  city: string;
}

interface HospitalGroupData {
  id: string;
  name: string;
  clinics?: {
    id: string;
    name: string;
    city: string;
    hospitalGroupId?: string;
  }[];
}

interface SearchInputProps {
  initialValue?: string;
  doctors?: DoctorData[];
  hospitalGroups?: HospitalGroupData[];
}

export default function SearchInput({ initialValue = "", doctors = [], hospitalGroups = [] }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (!value.trim()) return [];
    const lowerQuery = value.toLowerCase();
    
    const suggestions: any[] = [];
    const addedIds = new Set();
    
    // Add matching doctors
    for (const d of doctors) {
      if (d.name.toLowerCase().includes(lowerQuery) || 
          d.specialty.toLowerCase().includes(lowerQuery) ||
          d.city.toLowerCase().includes(lowerQuery)) {
        if (!addedIds.has(d.slug)) {
          suggestions.push({
            type: 'doctor',
            id: d.slug,
            name: d.name,
            specialty: d.specialty,
            city: d.city,
            url: `/doctor/${d.slug}`,
            icon: User
          });
          addedIds.add(d.slug);
        }
      }
    }

    // Add matching hospitals and clinics
    for (const h of hospitalGroups) {
      if (h.name.toLowerCase().includes(lowerQuery)) {
        if (!addedIds.has(h.id)) {
          suggestions.push({
            type: 'hospital',
            id: h.id,
            name: h.name,
            specialty: 'Hospital Group',
            city: '',
            url: `/hospitals/${h.id}`,
            icon: Building2
          });
          addedIds.add(h.id);
        }
      }

      if (h.clinics) {
        for (const c of h.clinics) {
          if (c.name.toLowerCase().includes(lowerQuery) || c.city.toLowerCase().includes(lowerQuery)) {
            if (!addedIds.has(c.id)) {
              suggestions.push({
                type: 'clinic',
                id: c.id,
                name: `${h.name} - ${c.name}`,
                specialty: 'Clinic',
                city: c.city,
                url: `/hospitals/${h.id}`,
                icon: MapPin
              });
              addedIds.add(c.id);
            }
          }
        }
      }
    }
    
    return suggestions;
  }, [value, doctors, hospitalGroups]);

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("query", val);
    } else {
      params.delete("query");
    }
    setShowSuggestions(false);
    router.push(`/search?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setValue(suggestion.name);
    setShowSuggestions(false);
    router.push(suggestion.url);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(value);
      }}
      className="relative w-full max-w-md"
      ref={wrapperRef}
    >
      <Search className="w-4 h-4 absolute left-3 top-3.5 text-text-light pointer-events-none" />
      <input
        type="text"
        placeholder="Search doctors, hospitals, clinics..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        className="w-full bg-white border border-gray-border rounded-xl h-11 pl-9 pr-8 text-sm font-medium focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary shadow-sm"
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            handleSearch("");
          }}
          className="absolute right-3 top-3.5 text-text-light hover:text-text-dark"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Autocomplete Dropdown */}
      {showSuggestions && value.trim() && filteredSuggestions.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-2 max-h-[60vh] overflow-y-auto">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggestions</div>
            {filteredSuggestions.map((suggestion, idx) => (
              <button
                key={`${suggestion.type}-${suggestion.id}-${idx}`}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50/50 flex items-center gap-3 transition-colors group"
              >
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-primary group-hover:bg-blue-primary group-hover:text-white transition-colors">
                  <suggestion.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate text-sm">{suggestion.name}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      {suggestion.type === 'doctor' && <Stethoscope className="w-3 h-3" />}
                      {suggestion.specialty}
                    </span>
                    {suggestion.city && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {suggestion.city}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
