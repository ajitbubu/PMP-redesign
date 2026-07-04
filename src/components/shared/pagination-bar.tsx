"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Static presentational pagination footer matching the Figma tables. */
export function PaginationBar({
  rangeStart,
  rangeEnd,
  total,
  className,
  showRowsPerPage = true,
}: {
  rangeStart: number;
  rangeEnd: number;
  total: number;
  className?: string;
  showRowsPerPage?: boolean;
}) {
  const btn =
    "flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4 px-1 py-4", className)}>
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {rangeStart}-{rangeEnd}
        </span>{" "}
        of <span className="font-semibold text-foreground">{total}</span>
        {showRowsPerPage ? (
          <span className="ml-4 hidden sm:inline">
            Rows{" "}
            <span className="ml-1 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground">
              10 <ChevronRight className="size-3 rotate-90" />
            </span>
          </span>
        ) : null}
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <button type="button" className={btn} aria-label="First page" disabled>
          <ChevronsLeft className="size-4" />
        </button>
        <button type="button" className={btn} aria-label="Previous page" disabled>
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-current="page"
          className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
        >
          1
        </button>
        <button type="button" className={btn} aria-label="Next page">
          <ChevronRight className="size-4" />
        </button>
        <button type="button" className={btn} aria-label="Last page">
          <ChevronsRight className="size-4" />
        </button>
      </nav>
    </div>
  );
}
