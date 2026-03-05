"use client";

import { CategoryCard, CategoryData } from "@/components/ui/CategoryCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ExploreByCategory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch top 8 categories sorted by jobs
  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/categories?limit=8&sort=jobs`);
        const data = await res.json();

        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCategories();
  }, []);

  // Intersection Observer for section animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
            isVisible ? "animate-fade-in-up" : "opacity-0"
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
            <ArrowRight
              size={18}
              // className="transition-transform duration-[var(--transition-base)] group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[200px] bg-slate-100 animate-pulse rounded-lg border border-surface-border"
                ></div>
              ))
            : categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
