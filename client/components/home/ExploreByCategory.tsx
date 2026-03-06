"use client";

import { CategoryCard, CategoryData } from "@/components/ui/CategoryCard";
import {
  exploreCategoryInitialState,
  exploreCategoryReducer,
} from "@/reducers/exploreCategoryReducer";
import { categoryService } from "@/services/category.service";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense, use, useEffect, useReducer, useRef } from "react";

// ─── Data Fetcher ────────────────────────────────────────
function fetchTopCategories(): Promise<CategoryData[]> {
  return categoryService.getTopCategories(8).catch((err) => {
    console.error("Failed to fetch categories:", err);
    return [];
  });
}

// ─── Inner Content ───────────────────────────────────────
function ExploreCategoryContent({
  dataPromise,
  isVisible,
}: {
  dataPromise: Promise<CategoryData[]>;
  isVisible: boolean;
}) {
  const categories = use(dataPromise);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          index={index}
          isVisible={isVisible}
        />
      ))}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────
function ExploreCategorySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-[200px] bg-slate-100 animate-pulse rounded-lg border border-surface-border"
        ></div>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────
export default function ExploreByCategory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(
    exploreCategoryReducer,
    exploreCategoryInitialState,
  );
  const promiseRef = useRef(fetchTopCategories());

  // IntersectionObserver — kept as useEffect (DOM side-effect)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch({ type: "SET_VISIBLE" });
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 lg:mb-12 gap-3 ${
            state.isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-text-dark leading-tight">
            Explore by <span className="text-brand-primary">category</span>
          </h2>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 text-brand-primary font-semibold text-sm sm:text-base hover:gap-3"
          >
            Show all Categories
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Category Grid */}
        <Suspense fallback={<ExploreCategorySkeleton />}>
          <ExploreCategoryContent
            dataPromise={promiseRef.current}
            isVisible={state.isVisible}
          />
        </Suspense>
      </div>
    </section>
  );
}
