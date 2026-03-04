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

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          onClick={() => onPageChange(1)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
            ${
              currentPage === 1
                ? "bg-brand-primary text-white shadow-md"
                : "bg-surface text-text-muted hover:bg-brand-primary/10 hover:text-brand-primary border border-surface-border"
            }`}
        >
          1
        </button>,
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2 text-text-muted">
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
            ${
              currentPage === i
                ? "bg-brand-primary text-white shadow-md scale-105"
                : "bg-surface text-text-muted hover:bg-brand-primary/10 hover:text-brand-primary border border-surface-border"
            }`}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-2 text-text-muted">
            ...
          </span>,
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
            ${
              currentPage === totalPages
                ? "bg-brand-primary text-white shadow-md"
                : "bg-surface text-text-muted hover:bg-brand-primary/10 hover:text-brand-primary border border-surface-border"
            }`}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 animate-fade-in">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface border border-surface-border text-text-muted hover:bg-brand-primary/10 hover:text-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface border border-surface-border text-text-muted hover:bg-brand-primary/10 hover:text-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
