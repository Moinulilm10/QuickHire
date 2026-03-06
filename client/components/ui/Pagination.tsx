"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers, adding ellipsis for many pages
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-md border border-surface-border text-text-muted hover:border-brand-primary hover:text-brand-primary disabled:opacity-50 disabled:hover:border-surface-border disabled:hover:text-text-muted transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft size={20} />
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${
            page === currentPage
              ? "bg-brand-primary text-white border-brand-primary"
              : page === "..."
                ? "text-text-muted cursor-default"
                : "border border-surface-border text-text-dark hover:border-brand-primary hover:text-brand-primary"
          }`}
          aria-label={page === "..." ? "Ellipsis" : `Page ${page}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-md border border-surface-border text-text-muted hover:border-brand-primary hover:text-brand-primary disabled:opacity-50 disabled:hover:border-surface-border disabled:hover:text-text-muted transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
