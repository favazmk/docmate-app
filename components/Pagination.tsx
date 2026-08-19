"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /**
   * Controlled mode. When supplied, the component reports the requested page
   * instead of pushing a `?page=` query param — used by lists that page in
   * client state (e.g. the hospital page doctor list).
   */
  onPageChange?: (page: number) => void;
  className?: string;
}

/**
 * Builds the page list with a sliding window around the current page, always
 * keeping the first and last page reachable in one click. `"…"` marks a gap.
 *
 * 12 pages, on page 7 -> [1, …, 5, 6, 7, 8, 9, …, 12]
 * 12 pages, on page 2 -> [1, 2, 3, 4, 5, …, 12]
 */
export function buildPageItems(
  currentPage: number,
  totalPages: number,
  siblings = 2
): (number | "…")[] {
  // Enough room to show everything without any gaps: first + last + window + 2 ellipses
  const maxSlots = siblings * 2 + 5;
  if (totalPages <= maxSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(currentPage - siblings, 1);
  const right = Math.min(currentPage + siblings, totalPages);
  const showLeftGap = left > 2;
  const showRightGap = right < totalPages - 1;

  const items: (number | "…")[] = [];

  if (showLeftGap && !showRightGap) {
    // Near the end — show the last `maxSlots - 2` pages
    items.push(1, "…");
    for (let p = totalPages - (maxSlots - 3); p <= totalPages; p++) items.push(p);
    return items;
  }

  if (!showLeftGap && showRightGap) {
    // Near the start — show the first `maxSlots - 2` pages
    for (let p = 1; p <= maxSlots - 2; p++) items.push(p);
    items.push("…", totalPages);
    return items;
  }

  // Somewhere in the middle — gaps on both sides
  items.push(1, "…");
  for (let p = left; p <= right; p++) items.push(p);
  items.push("…", totalPages);
  return items;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  // Guard against a hand-typed ?page=999 leaving every number unhighlighted.
  const page = Math.min(Math.max(currentPage, 1), totalPages);

  const handlePageChange = (target: number) => {
    if (target === page || target < 1 || target > totalPages) return;

    if (onPageChange) {
      onPageChange(target);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", target.toString());
    router.push(`?${params.toString()}`);
  };

  const items = buildPageItems(page, totalPages);

  const arrowClass =
    "h-9 min-w-9 px-2.5 inline-flex items-center justify-center gap-1 rounded-lg border border-gray-border bg-white text-sm font-semibold text-text-dark transition-colors hover:border-blue-primary/50 hover:text-blue-primary disabled:opacity-40 disabled:pointer-events-none";

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-1.5 mt-8 ${className}`}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
        className={arrowClass}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {items.map((item, idx) =>
        item === "…" ? (
          <span
            key={`gap-${idx}`}
            aria-hidden="true"
            className="h-9 w-9 inline-flex items-end justify-center pb-2 text-sm font-semibold text-text-light select-none"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => handlePageChange(item)}
            className={`h-9 min-w-9 px-2.5 inline-flex items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
              item === page
                ? "bg-blue-primary border-blue-primary text-white shadow-sm shadow-blue-primary/20"
                : "bg-white border-gray-border text-text-dark hover:border-blue-primary/50 hover:text-blue-primary"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => handlePageChange(page + 1)}
        className={arrowClass}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
