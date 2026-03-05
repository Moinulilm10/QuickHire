"use client";

import { alertService } from "@/utils/alertService";
import { Check, ChevronDown, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface CategorySelectProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  error?: string;
}

export default function CategorySelect({
  selectedCategories,
  onChange,
  error,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Categories
  const fetchCategories = async (
    currentPage: number,
    search: string,
    isNewSearch: boolean = false,
  ) => {
    if (!hasMore && !isNewSearch) return;

    try {
      setLoading(true);
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(
        `${apiUrl}/categories?page=${currentPage}&limit=10&search=${encodeURIComponent(search)}`,
      );
      const data = await res.json();

      if (data.success) {
        setCategories((prev) => {
          if (isNewSearch) return data.data;
          // Filter out existing categories to prevent any duplicate key errors
          const newItems = data.data.filter(
            (newItem: Category) =>
              !prev.some((oldItem) => oldItem.id === newItem.id),
          );
          return [...prev, ...newItems];
        });
        setHasMore(data.pagination.page < data.pagination.totalPages);
      } else {
        alertService.error(
          "Error",
          data.message || "Failed to load categories.",
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      if (isOpen) {
        fetchCategories(1, searchTerm, true);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  // Infinite Scroll Observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchCategories(nextPage, searchTerm, false);
          return nextPage;
        });
      }
    },
    [hasMore, loading, searchTerm],
  );

  useEffect(() => {
    if (!isOpen) return;

    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observerRef.current = new IntersectionObserver(handleObserver, option);
    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver, isOpen, categories]);

  const toggleCategory = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      onChange(selectedCategories.filter((cat) => cat !== categoryName));
    } else {
      onChange([...selectedCategories, categoryName]);
    }
  };

  const removeCategory = (e: React.MouseEvent, categoryName: string) => {
    e.stopPropagation();
    onChange(selectedCategories.filter((cat) => cat !== categoryName));
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-foreground mb-1.5">
        Categories
      </label>

      {/* Main Selection Area */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full min-h-[44px] rounded-lg border bg-surface px-3 py-2
          cursor-pointer flex flex-wrap items-center gap-2 transition-all duration-200
          ${error ? "border-danger focus:ring-danger/20" : "border-surface-border hover:border-text-muted"}
          ${isOpen ? "ring-2 ring-primary/30 border-primary" : ""}
        `}
      >
        {selectedCategories.length === 0 && (
          <span className="text-text-muted text-sm ml-1">
            Select Categories...
          </span>
        )}

        {selectedCategories.map((cat) => (
          <span
            key={cat}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold animate-fade-in"
          >
            {cat}
            <button
              onClick={(e) => removeCategory(e, cat)}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <div className="flex-1 min-w-[50px] flex justify-end">
          <ChevronDown
            size={18}
            className={`text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-danger">{error}</p>}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-surface-border rounded-xl shadow-xl overflow-hidden animate-fade-in-up origin-top">
          {/* Search Input */}
          <div className="p-3 border-b border-surface-border sticky top-0 bg-surface z-10 flex items-center gap-2">
            <Search size={16} className="text-text-muted" />
            <input
              type="text"
              autoFocus
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-sm text-foreground placeholder:text-text-muted"
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-2">
            {categories.length === 0 && !loading && (
              <div className="p-4 text-center text-sm text-text-muted">
                No categories found.
              </div>
            )}

            {categories.map((category, index) => {
              const isSelected = selectedCategories.includes(category.name);
              const isLast = index === categories.length - 1;

              return (
                <div
                  key={category.id}
                  ref={isLast ? lastElementRef : null}
                  onClick={() => toggleCategory(category.name)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                    ${isSelected ? "bg-primary/5" : "hover:bg-black/5"}
                  `}
                >
                  <div
                    className={`
                    w-4 h-4 rounded-sm border flex items-center justify-center transition-colors
                    ${isSelected ? "bg-primary border-primary text-white" : "border-text-muted bg-transparent"}
                  `}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span
                    className={`text-sm ${isSelected ? "text-foreground font-medium" : "text-text-muted"}`}
                  >
                    {category.name}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="p-3 text-center text-sm text-text-muted flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                Loading...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
