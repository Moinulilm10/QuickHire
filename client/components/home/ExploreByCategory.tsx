"use client";

import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Camera,
  Code,
  Megaphone,
  Monitor,
  PenTool,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Category {
  name: string;
  jobs: number;
  icon: React.ElementType;
  highlighted?: boolean;
}

const categories: Category[] = [
  { name: "Design", jobs: 235, icon: PenTool },
  { name: "Sales", jobs: 756, icon: BarChart3 },
  { name: "Marketing", jobs: 140, icon: Megaphone },
  { name: "Finance", jobs: 325, icon: Camera },
  { name: "Technology", jobs: 436, icon: Monitor },
  { name: "Engineering", jobs: 542, icon: Code },
  { name: "Business", jobs: 211, icon: Briefcase },
  { name: "Human Resource", jobs: 346, icon: Users },
];

export default function ExploreByCategory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
            href="/jobs"
            className="group inline-flex items-center gap-2 text-brand-primary font-semibold text-sm sm:text-base hover:gap-3 transition-all duration-[var(--transition-base)]"
          >
            Show all jobs
            <ArrowRight
              size={18}
              className="transition-transform duration-[var(--transition-base)] group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const delay = index * 80;

            return (
              <Link
                key={category.name}
                href={`/jobs?category=${category.name.toLowerCase().replace(" ", "-")}`}
                className={`
                  group relative flex flex-col p-5 sm:p-6 lg:p-7
                  border transition-all duration-[var(--transition-base)]
                  ${
                    category.highlighted
                      ? "bg-brand-primary border-brand-primary text-white shadow-lg"
                      : "bg-white border-surface-border text-text-dark hover:border-brand-primary hover:shadow-[var(--shadow-card)]"
                  }
                  transform hover:-translate-y-1 active:scale-[0.98]
                  ${isVisible ? "animate-fade-in-up" : "opacity-0"}
                `}
                style={{
                  animationDelay: isVisible ? `${delay}ms` : undefined,
                }}
              >
                {/* Icon */}
                <div
                  className={`
                    w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg mb-4 sm:mb-5
                    transition-transform duration-[var(--transition-base)] group-hover:scale-110
                    ${
                      category.highlighted
                        ? "bg-white/15"
                        : "bg-brand-primary-light"
                    }
                  `}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.8}
                    className={
                      category.highlighted ? "text-white" : "text-brand-primary"
                    }
                  />
                </div>

                {/* Category Name */}
                <h3
                  className={`text-base sm:text-lg font-bold mb-1.5 leading-snug ${
                    category.highlighted ? "text-white" : "text-text-dark"
                  }`}
                >
                  {category.name}
                </h3>

                {/* Jobs Count + Arrow */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      category.highlighted ? "text-white/80" : "text-text-body"
                    }`}
                  >
                    {category.jobs} jobs available
                  </span>
                  <ArrowRight
                    size={16}
                    className={`transition-transform duration-[var(--transition-base)] group-hover:translate-x-1 ${
                      category.highlighted ? "text-white/80" : "text-text-body"
                    }`}
                  />
                </div>

                {/* Hover glow effect for highlighted card */}
                {category.highlighted && (
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--transition-base)] pointer-events-none" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
