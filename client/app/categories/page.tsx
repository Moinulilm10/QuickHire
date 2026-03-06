"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CategoryCard, CategoryData } from "@/components/ui/CategoryCard";
import {
  categoriesInitialState,
  categoriesReducer,
} from "@/reducers/categoriesReducer";
import { alertService } from "@/utils/alertService";
import { Suspense, use, useReducer, useRef, useTransition } from "react";

// ─── Data Fetcher ────────────────────────────────────────
function fetchCategories(page: number): Promise<{
  categories: CategoryData[];
  totalPages: number;
}> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
  return fetch(`${apiUrl}/categories?page=${page}&limit=16&sort=jobs`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        return {
          categories: data.data,
          totalPages: data.pagination.totalPages,
        };
      }
      alertService.error("Error", data.message || "Failed to load categories");
      return { categories: [], totalPages: 1 };
    })
    .catch((error) => {
      console.error("Failed to fetch categories:", error);
      return { categories: [], totalPages: 1 };
    });
}

// ─── Inner Content (uses use() inside Suspense) ──────────
function CategoriesContent({
  dataPromise,
  page,
  totalPages: fallbackTotalPages,
  onPageChange,
}: {
  dataPromise: Promise<{ categories: CategoryData[]; totalPages: number }>;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const data = use(dataPromise);
  const categories = data.categories;
  const totalPages = data.totalPages || fallbackTotalPages;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
            isVisible={true}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-surface-border rounded-lg text-text-dark hover:bg-surface-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                  page === i + 1
                    ? "bg-brand-primary text-white"
                    : "text-text-dark hover:bg-surface-light"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-surface-border rounded-lg text-text-dark hover:bg-surface-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────
function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="h-[200px] bg-slate-100 animate-pulse rounded-lg border border-surface-border"
        ></div>
      ))}
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────
export default function CategoriesPage() {
  const [state, dispatch] = useReducer(
    categoriesReducer,
    categoriesInitialState,
  );
  const [isPending, startTransition] = useTransition();
  const promiseRef = useRef<
    Promise<{ categories: CategoryData[]; totalPages: number }>
  >(fetchCategories(1));

  const handlePageChange = (newPage: number) => {
    dispatch({ type: "SET_PAGE", payload: newPage });
    startTransition(() => {
      promiseRef.current = fetchCategories(newPage);
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[72px]">
        {/* Header Section */}
        <section className="bg-surface-light py-12 lg:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[800px]">
              <h1 className="text-[32px] sm:text-[44px] lg:text-[48px] font-bold text-text-dark leading-tight mb-4 tracking-tight">
                All <span className="text-brand-primary">Categories</span>
              </h1>
              <p className="text-text-body text-base sm:text-lg">
                Explore a wide range of career fields and discover the perfect
                job opportunities that match your skills and passions.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className={isPending ? "opacity-60 transition-opacity" : ""}>
              <Suspense fallback={<CategoriesSkeleton />}>
                <CategoriesContent
                  dataPromise={promiseRef.current}
                  page={state.page}
                  totalPages={state.totalPages}
                  onPageChange={handlePageChange}
                />
              </Suspense>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
