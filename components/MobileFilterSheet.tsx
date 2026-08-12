"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import FilterSidebar from "./FilterSidebar";

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

interface MobileFilterSheetProps {
  hospitalGroups?: HospitalGroupOption[];
  clinics?: ClinicOption[];
  /** Number of results currently matching — shown on the apply button. */
  resultCount?: number;
  triggerClassName?: string;
}

export default function MobileFilterSheet({
  hospitalGroups = [],
  clinics = [],
  resultCount,
  triggerClassName = "md:hidden flex-1 bg-white border border-gray-border rounded-xl h-11 flex items-center justify-center gap-2 text-sm font-medium text-text-dark shadow-sm",
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleReset = () => {
    router.push(pathname);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={triggerClassName}>
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </SheetTrigger>

      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="h-[85vh] max-h-[85vh] p-0 gap-0 rounded-t-2xl flex flex-col"
      >
        {/* Sticky header: title, reset, close */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-border shrink-0">
          <SheetTitle className="font-bold text-text-dark text-lg">Filters</SheetTitle>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-medium text-blue-primary hover:underline px-2 py-1"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-text-mid hover:bg-gray-bg hover:text-text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable filter body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <FilterSidebar
            hospitalGroups={hospitalGroups}
            clinics={clinics}
            showHeader={false}
            bodyScroll={false}
            className="border-0 rounded-none overflow-visible"
          />
        </div>

        {/* Sticky footer: dismiss and see the filtered results */}
        <div className="shrink-0 border-t border-gray-border bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full h-12 rounded-xl bg-blue-primary hover:bg-blue-hover text-white font-bold text-base transition-colors"
          >
            {typeof resultCount === "number" ? `Show ${resultCount} results` : "Show results"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
