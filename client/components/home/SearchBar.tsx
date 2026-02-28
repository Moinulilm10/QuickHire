"use client";

export default function SearchBar() {
  return (
    <div className="animate-fade-in-up delay-500">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-[var(--radius-sm)] shadow-[var(--shadow-card)] border border-surface-border/50 p-2 sm:p-2.5 gap-2 sm:gap-0">
        {/* Job title input */}
        <div className="flex items-center gap-3 flex-1 px-3 py-2 sm:py-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Job title or keyword"
            className="w-full bg-transparent text-text-dark placeholder:text-text-muted text-base focus:outline-none"
          />
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-surface-border mx-2" />

        {/* Location */}
        <div className="flex items-center gap-3 flex-1 px-3 py-2 sm:py-0 border-t sm:border-t-0 border-surface-border/50">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted shrink-0"
          >
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-text-dark text-base flex-1">
            Florence, Italy
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Search button */}
        <button className="bg-brand-primary text-white font-bold px-6 py-3 sm:py-3.5 rounded-[var(--radius-sm)] hover:bg-brand-primary-hover transition-all duration-[var(--transition-base)] transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap">
          Search my job
        </button>
      </div>
    </div>
  );
}
