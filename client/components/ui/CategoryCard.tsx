"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface CategoryData {
  id: number;
  name: string;
  _count?: { jobs: number };
}

interface CategoryCardProps {
  category: CategoryData;
  index: number;
  isVisible: boolean;
}

export function CategoryCard({
  category,
  index,
  isVisible,
}: CategoryCardProps) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 80;
  const jobsCount = category._count?.jobs || 0;

  const getInitials = (name: string) => {
    if (!name) return "";
    const safeName = name.replace(/&/g, "").trim();
    const words = safeName.split(/\s+/).filter(Boolean);

    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return safeName.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(category.name);

  return (
    <Link
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
      {/* Initials Wrapper */}
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
        <span
          className="text-lg sm:text-xl font-bold tracking-wide"
          style={{
            color: hovered ? "#ffffff" : "var(--brand-primary)",
            transition: "color 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {initials}
        </span>
      </div>

      {/* Category Name */}
      <h3
        className="text-base sm:text-lg font-bold mb-1.5 leading-snug line-clamp-2 min-h-[50px] sm:min-h-[56px]"
        style={{
          color: hovered ? "#ffffff" : "var(--text-dark)",
          transition: "color 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {category.name}
      </h3>

      {/* Jobs Count + Arrow */}
      <div className="flex items-center gap-2 mt-auto">
        <span
          className="text-sm font-medium"
          style={{
            color: hovered ? "rgba(255, 255, 255, 0.8)" : "var(--text-body)",
            transition: "color 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {jobsCount} {jobsCount === 1 ? "job" : "jobs"} available
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
