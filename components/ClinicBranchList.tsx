"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import ClinicBranchCard, { ClinicBranch } from "./ClinicBranchCard";

export default function ClinicBranchList({
  clinics,
  hospitalName,
}: {
  clinics: ClinicBranch[];
  hospitalName: string;
}) {
  const [query, setQuery] = useState("");

  const filteredClinics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clinics;
    return clinics.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(q) ||
        clinic.city.toLowerCase().includes(q)
    );
  }, [clinics, query]);

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative w-full max-w-md"
      >
        <Search className="w-4 h-4 absolute left-3 top-3.5 text-text-light pointer-events-none" />
        <input
          type="text"
          placeholder="Search branches by name or city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white border border-gray-border rounded-xl h-11 pl-9 pr-8 text-sm font-medium focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary shadow-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-3.5 text-text-light hover:text-text-dark"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {clinics.length === 0 ? (
        <div className="bg-white border border-gray-border rounded-3xl p-8 text-center text-text-mid font-semibold">
          No medical branches found under this group.
        </div>
      ) : filteredClinics.length === 0 ? (
        <div className="bg-white border border-gray-border rounded-3xl p-8 text-center text-text-mid font-semibold">
          No branches match your search.
        </div>
      ) : (
        filteredClinics.map((clinic) => (
          <ClinicBranchCard key={clinic.id} clinic={clinic} hospitalName={hospitalName} />
        ))
      )}
    </div>
  );
}
