"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Stethoscope, MapPin, User, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import CustomDropdown from "./ui/CustomDropdown";
import { normalizeSearchText } from "@/lib/utils";

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

interface SearchBarProps {
  doctors?: DoctorData[];
  hospitalGroups?: HospitalGroupData[];
}

export default function SearchBar({ doctors = [], hospitalGroups = [] }: SearchBarProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cities = [
    "Dubai",
    "Sharjah",
    "Ajman"
  ];

  const specialtyOptions = useMemo(() => {
    const availableDoctors = selectedCity
      ? doctors.filter(d => d.city.toLowerCase() === selectedCity.toLowerCase())
      : doctors;
    const uniqueSpecialties = Array.from(new Set(availableDoctors.map(d => d.specialty).filter(Boolean)));
    return uniqueSpecialties.map(specialty => ({
      type: 'specialty',
      id: specialty,
      name: specialty,
      specialty: 'Specialty',
      city: '',
      url: `/search?specialty=${encodeURIComponent(specialty)}${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ''}`,
      icon: Stethoscope
    }));
  }, [doctors, selectedCity]);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) {
      return specialtyOptions.slice(0, 10);
    }
    const lowerQuery = normalizeSearchText(query);

    const suggestions: any[] = [];
    const addedIds = new Set();

    // Matching specialties first — searching "cardiology" should offer the whole
    // specialty before it starts listing individual cardiologists.
    for (const s of specialtyOptions) {
      if (normalizeSearchText(s.name).includes(lowerQuery)) {
        suggestions.push(s);
      }
    }

    // Add matching doctors
    for (const d of doctors) {
      if (selectedCity && d.city.toLowerCase() !== selectedCity.toLowerCase()) continue;
      if (normalizeSearchText(d.name).includes(lowerQuery) || 
          normalizeSearchText(d.specialty).includes(lowerQuery) ||
          normalizeSearchText(d.city).includes(lowerQuery)) {
        if (!addedIds.has(d.slug)) {
          suggestions.push({
            type: 'doctor',
            id: d.slug,
            name: d.name,
            specialty: d.specialty,
            city: d.city,
            url: `/doctors/${d.slug}`,
            icon: User
          });
          addedIds.add(d.slug);
        }
      }
    }

    // Add matching hospitals and clinics
    for (const h of hospitalGroups) {
      let hospitalHasValidClinic = false;
      
      if (h.clinics) {
        for (const c of h.clinics) {
          if (selectedCity && c.city.toLowerCase() !== selectedCity.toLowerCase()) continue;
          hospitalHasValidClinic = true;
          
          if (normalizeSearchText(c.name).includes(lowerQuery) || normalizeSearchText(c.city).includes(lowerQuery)) {
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

      if (normalizeSearchText(h.name).includes(lowerQuery)) {
        if (!selectedCity || hospitalHasValidClinic) {
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
      }
    }
    
    return suggestions;
  }, [query, selectedCity, doctors, hospitalGroups, specialtyOptions]);

  const specialtyResults = filteredSuggestions.filter(s => s.type === 'specialty');
  const otherResults = filteredSuggestions.filter(s => s.type !== 'specialty');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (query.trim()) {
      const isSpecialty = doctors.some(d => d.specialty && d.specialty.toLowerCase() === query.trim().toLowerCase());
      if (isSpecialty) {
        const exactSpecialty = doctors.find(d => d.specialty && d.specialty.toLowerCase() === query.trim().toLowerCase())?.specialty || query.trim();
        params.set("specialty", exactSpecialty);
      } else {
        params.set("query", query.trim());
      }
    }

    if (selectedCity) params.set("city", selectedCity);
    setShowSuggestions(false);
    router.push(`/search?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.name);
    // With an empty box the specialty list is only a browse aid, so clicking one
    // fills the input and lets the search be refined. Once something has been
    // typed, a specialty hit is a real result and goes straight to its listing.
    if (suggestion.type === 'specialty' && !query.trim()) {
      setShowSuggestions(true);
      return;
    }
    setShowSuggestions(false);
    router.push(suggestion.url);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 rounded-3xl p-5 md:p-6 shadow-[0_12px_40px_rgba(26,18,100,0.06)] border border-gray-border/60 w-full max-w-4xl mx-auto -mt-16 md:-mt-24 relative z-50">
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-5">
        <div className="flex-1 relative flex items-center" ref={wrapperRef}>
          <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search doctors, hospitals, clinics..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="bg-gray-100/60 border border-gray-border/40 rounded-xl h-[50px] pl-11 pr-4 w-full text-sm font-semibold focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/30 placeholder:text-text-light"
            autoComplete="off"
          />
          
          {/* Autocomplete Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="py-2 max-h-[60vh] overflow-y-auto">
                {[
                  {
                    label: query.trim() ? "Specialties" : "Popular Specialties",
                    items: specialtyResults
                  },
                  { label: "Doctors, Hospitals & Clinics", items: otherResults }
                ]
                  .filter(group => group.items.length > 0)
                  .map(group => (
                    <div key={group.label}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {group.label}
                      </div>
                      {group.items.map((suggestion, idx) => (
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
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="sm:w-56">
          <CustomDropdown
            value={selectedCity}
            onChange={setSelectedCity}
            options={cities}
            placeholder="All Locations"
            icon={<MapPin className="w-4 h-4" />}
            labelPrefix="City"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-primary hover:bg-blue-hover text-white rounded-xl h-12 text-base font-bold shadow-md shadow-blue-primary/10 transition-[background-color,box-shadow] flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        {query.trim() || selectedCity ? "Search" : "Browse All"}
      </Button>
    </form>
  );
}
