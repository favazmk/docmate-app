"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import CustomDropdown from "./ui/CustomDropdown";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSort = searchParams.get("sort") || "recommended";

  const handleSortChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("sort", val);
    } else {
      params.set("sort", "recommended");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const options = [
    { value: "recommended", label: "Sort by: Recommended" },
    { value: "highest-rated", label: "Sort by: Highest Rated" },
    { value: "most-reviewed", label: "Sort by: Most Reviewed" }
  ];

  return (
    <div className="relative flex-1 md:w-64 hidden md:block">
      <CustomDropdown
        value={currentSort}
        onChange={handleSortChange}
        options={options}
        placeholder="Sort by: Recommended"
      />
    </div>
  );
}
