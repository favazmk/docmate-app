"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import CustomDropdown from "./ui/CustomDropdown";

/**
 * Order options for the doctor results list. Every value must have a matching
 * branch in the `orderByClause` switch in app/search/page.tsx — anything else
 * silently falls back to "recommended".
 */
export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "highest-rated", label: "Highest Rated" },
  { value: "most-reviewed", label: "Most Reviewed" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "fee-low", label: "Fee: Low to High" },
  { value: "fee-high", label: "Fee: High to Low" },
];

export const DEFAULT_SORT = "recommended";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const rawSort = searchParams.get("sort") || DEFAULT_SORT;
  const currentSort = SORT_OPTIONS.some(o => o.value === rawSort) ? rawSort : DEFAULT_SORT;

  const handleSortChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", val || DEFAULT_SORT);
    // Re-ordering the whole result set makes the old page number meaningless.
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative flex-1 md:flex-none md:w-64">
      <CustomDropdown
        value={currentSort}
        onChange={handleSortChange}
        options={SORT_OPTIONS}
        placeholder="Recommended"
        labelPrefix="Sort by"
        icon={<ArrowUpDown className="w-4 h-4" />}
      />
    </div>
  );
}
