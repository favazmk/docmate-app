"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import ClinicBranchCard, { ClinicBranch } from "./ClinicBranchCard";

export default function ClinicBranchList({
  clinics,
  hospitalName,
  searchQuery = "",
}: {
  clinics: ClinicBranch[];
  hospitalName: string;
  searchQuery?: string;
}) {
  const filteredClinics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clinics;
    return clinics.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(q) ||
        clinic.city.toLowerCase().includes(q)
    );
  }, [clinics, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
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
