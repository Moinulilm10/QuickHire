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

function CategoryCard({
  category,
  index,
  isVisible,
}: {
  category: Category;
  index: number;
  isVisible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = category.icon;
  const delay = index * 80;

  return (
    <Link
      key={category.name}
      href={`/jobs?category=${category.name.toLowerCase().replace(" ", "-")}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        group relative flex flex-col p-5 sm:p-6 lg:p-7 border
        ${isVisible ? "animate-fade-in-up" : "opacity-0"}
      `}
      style={{
        animationDelay: isVisible ? `${delay}ms` : undefined,
        backgroundColor: hovered ? "var(--brand-primary)" : "#ffffff",
        borderColor: hovered ? "var(--brand-primary)" : "var(--surface-border)",
        boxShadow: hovered ? "0 12px 32px rgba(70, 64, 222, 0.25)" : "none",
        transform: hovered
          ? "translateY(-6px) scale(1.01)"
          : "translateY(0) scale(1)",
        transition:
          "background-color 400ms cubic-bezier(0.16, 1, 0.3, 1), border-color 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg mb-4 sm:mb-5"
        style={{
          backgroundColor: hovered
            ? "rgba(255, 255, 255, 0.15)"
            : "var(--brand-primary-light)",
          transform: hovered ? "scale(1.1)" : "scale(1)",
          transition:
            "background-color 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Icon
          size={22}
          strokeWidth={1.8}
          style={{
            color: hovered ? "#ffffff" : "var(--brand-primary)",
            transition: "color 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* Category Name */}
      <h3
        className="text-base sm:text-lg font-bold mb-1.5 leading-snug"
        style={{
          color: hovered ? "#ffffff" : "var(--text-dark)",
          transition: "color 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {category.name}
      </h3>

      {/* Jobs Count + Arrow */}
      <div className="flex items-center gap-2">
        <span
          className="text-sm"
          style={{
            color: hovered ? "rgba(255, 255, 255, 0.8)" : "var(--text-body)",
            transition: "color 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {category.jobs} jobs available
        </span>
        <ArrowRight
          size={16}
          style={{
            color: hovered ? "rgba(255, 255, 255, 0.8)" : "var(--text-body)",
            transform: hovered ? "translateX(4px)" : "translateX(0)",
            transition:
              "color 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </Link>
  );
}

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
          {categories.map((category, index) => (
            <CategoryCard
              key={category.name}
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
