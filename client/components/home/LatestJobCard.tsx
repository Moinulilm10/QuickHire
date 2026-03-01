"use client";

import { Job } from "@/data/jobsData";
import Image from "next/image";
import { useState } from "react";

interface LatestJobCardProps {
  job: Job;
  index: number;
  isVisible: boolean;
}

const getTagStyles = (tag: string) => {
  switch (tag.toLowerCase()) {
    case "full-time":
      return "bg-[#56CDAD]/10 text-[#56CDAD] border-[#56CDAD]/20";
    case "marketing":
      return "bg-[#FFB836]/10 text-[#FFB836] border-[#FFB836]/20";
    case "design":
      return "bg-[#4640DE]/10 text-[#4640DE] border-[#4640DE]/20";
    default:
      return "bg-brand-primary-light text-brand-primary border-brand-primary/10";
  }
};

export default function LatestJobCard({
  job,
  index,
  isVisible,
}: LatestJobCardProps) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 100;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex items-start gap-4 p-6 bg-white border border-surface-border transition-all duration-300
        ${isVisible ? "animate-fade-in-up" : "opacity-0"}
      `}
      style={{
        animationDelay: isVisible ? `${delay}ms` : undefined,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 24px rgba(0,0,0,0.06)" : "none",
        borderColor: hovered ? "var(--brand-primary)" : "var(--surface-border)",
      }}
    >
      {/* Logo */}
      <div
        className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-sm overflow-hidden"
        style={{
          backgroundColor: job.logoColor || "var(--brand-primary-light)",
        }}
      >
        {job.logoUrl ? (
          <Image
            src={job.logoUrl}
            alt={job.company}
            width={48}
            height={48}
            className="object-contain"
          />
        ) : (
          <span className="text-white font-bold text-xl">
            {job.company.charAt(0)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-1 mb-3">
          <h3 className="text-[18px] font-bold text-text-dark leading-tight line-clamp-1 group-hover:text-brand-primary transition-colors duration-300">
            {job.title}
          </h3>
          <p className="text-text-muted text-sm font-medium">
            {job.company} <span className="text-text-light mx-1">•</span>{" "}
            {job.location}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[12px] font-semibold border ${getTagStyles(job.type)}`}
          >
            {job.type}
          </span>
          <div className="w-[1px] h-4 bg-surface-border self-center" />
          {job.categories.map((cat) => (
            <span
              key={cat}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold border ${getTagStyles(cat)}`}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
