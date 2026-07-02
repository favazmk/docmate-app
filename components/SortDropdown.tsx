"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSort = searchParams.get("sort") || "recommended";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative flex-1 md:w-64 hidden md:block">
      <select 
        value={currentSort}
        onChange={handleSortChange}
        className="w-full appearance-none bg-white border border-gray-border rounded-xl h-11 pl-4 pr-10 text-sm font-medium text-text-dark focus:outline-none focus:border-blue-primary shadow-sm"
      >
        <option value="recommended">Sort by: Recommended</option>
        <option value="highest-rated">Sort by: Highest Rated</option>
        <option value="most-reviewed">Sort by: Most Reviewed</option>
      </select>
      <ChevronDown className="w-4 h-4 absolute right-4 top-3.5 text-text-light pointer-events-none" />
    </div>
  );
}
