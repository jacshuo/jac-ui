import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "../../../lib/utils";

/* ── Types ────────────────────────────────────────────── */

export type PaginationProps = {
  /** Total number of pages. */
  totalPages: number;
  /** Current active page (1-based). */
  currentPage: number;
  /** Called when the user requests a page change. */
  onPageChange: (page: number) => void;
  /**
   * Number of page buttons shown around the current page.
   * @default 2
   */
  siblingCount?: number;
  /** Show First / Last jump buttons. @default true */
  showFirstLast?: boolean;
  /** Show the total page count label. @default false */
  showPageCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/* ── helpers ──────────────────────────────────────────── */

function buildRange(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

function buildPages(current: number, total: number, siblings: number): (number | "…")[] {
  const totalShown = siblings * 2 + 5; // siblings + 2 edges + 2 ellipses + current
  if (total <= totalShown) return buildRange(1, total);

  const leftSib = Math.max(current - siblings, 1);
  const rightSib = Math.min(current + siblings, total);
  const showLeft = leftSib > 2;
  const showRight = rightSib < total - 1;

  if (!showLeft && showRight) {
    return [...buildRange(1, 3 + siblings * 2), "…", total];
  }
  if (showLeft && !showRight) {
    return [1, "…", ...buildRange(total - (3 + siblings * 2) + 1, total)];
  }
  return [1, "…", ...buildRange(leftSib, rightSib), "…", total];
}

/* ── Size maps ────────────────────────────────────────── */

const btnSize: Record<NonNullable<PaginationProps["size"]>, string> = {
  sm: "h-7 min-w-7 px-1.5 text-xs",
  md: "h-9 min-w-9 px-2 text-sm",
  lg: "h-11 min-w-11 px-2.5 text-base",
};

const iconSize: Record<NonNullable<PaginationProps["size"]>, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

/* ── Sub-component: PaginationButton ─────────────────── */

type PaginationButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  size: NonNullable<PaginationProps["size"]>;
  "aria-label"?: string;
  children: React.ReactNode;
};

function PaginationButton({
  onClick,
  disabled,
  active,
  size,
  "aria-label": ariaLabel,
  children,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30",
        btnSize[size],
        active
          ? "bg-primary-600 text-white dark:bg-primary-500"
          : "border border-primary-200 bg-white text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {children}
    </button>
  );
}

/* ── Pagination ───────────────────────────────────────── */

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 2,
  showFirstLast = true,
  showPageCount = false,
  size = "md",
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages, siblingCount);

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      {/* First */}
      {showFirstLast && (
        <PaginationButton
          size={size}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <ChevronsLeft className={iconSize[size]} />
        </PaginationButton>
      )}

      {/* Prev */}
      <PaginationButton
        size={size}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className={iconSize[size]} />
      </PaginationButton>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className={cn(
              "inline-flex items-center justify-center text-secondary-400",
              btnSize[size],
            )}
            aria-hidden="true"
          >
            <MoreHorizontal className={iconSize[size]} />
          </span>
        ) : (
          <PaginationButton
            key={p}
            size={size}
            active={p === currentPage}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
          >
            {p}
          </PaginationButton>
        ),
      )}

      {/* Next */}
      <PaginationButton
        size={size}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className={iconSize[size]} />
      </PaginationButton>

      {/* Last */}
      {showFirstLast && (
        <PaginationButton
          size={size}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          <ChevronsRight className={iconSize[size]} />
        </PaginationButton>
      )}

      {/* Page count label */}
      {showPageCount && (
        <span className="ml-2 text-sm text-secondary-500 dark:text-secondary-400">
          Page {currentPage} of {totalPages}
        </span>
      )}
    </nav>
  );
}
