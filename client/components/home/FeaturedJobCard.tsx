"use client";

import { Job } from "@/data/jobsData";
import Image from "next/image";
import { useState } from "react";

interface FeaturedJobCardProps {
  job: Job;
  index: number;
  isVisible: boolean;
}

const getTagStyles = (tag: string) => {
  switch (tag.toLowerCase()) {
    case "marketing":
      return "bg-[#FFB836]/10 text-[#FFB836] border-[#FFB836]/20";
    case "design":
      return "bg-[#56CDAD]/10 text-[#56CDAD] border-[#56CDAD]/20";
    case "business":
      return "bg-[#4640DE]/10 text-[#4640DE] border-[#4640DE]/20";
    case "technology":
      return "bg-[#FF6550]/10 text-[#FF6550] border-[#FF6550]/20";
    default:
      return "bg-brand-primary-light text-brand-primary border-brand-primary/10";
  }
};

export default function FeaturedJobCard({
  job,
  index,
  isVisible,
}: FeaturedJobCardProps) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 100;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative p-6 bg-white border border-surface-border transition-all duration-300
        ${isVisible ? "animate-fade-in-up" : "opacity-0"}
      `}
      style={{
        animationDelay: isVisible ? `${delay}ms` : undefined,
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.08)" : "none",
        borderColor: hovered ? "var(--brand-primary)" : "var(--surface-border)",
      }}
    >
      {/* Header: Logo & Type */}
      <div className="flex justify-between items-start mb-4">
        <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden">
          {job.logoUrl ? (
            <Image
              src={job.logoUrl}
              alt={job.company}
              width={48}
              height={48}
              className="object-contain"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-bold text-xl rounded-sm"
              style={{
                backgroundColor: job.logoColor || "var(--brand-primary-light)",
                color: job.logoColor === "#000000" ? "#ffffff" : "#ffffff",
              }}
            >
              {job.company.charAt(0)}
            </div>
          )}
        </div>
        <span className="px-3 py-1 border border-brand-primary text-brand-primary text-xs font-semibold">
          {job.type}
        </span>
      </div>

      {/* Body: Title & Meta */}
      <div className="mb-4">
        <h3 className="text-[18px] font-bold text-text-dark leading-snug mb-1 group-hover:text-brand-primary transition-colors duration-300">
          {job.title}
        </h3>
        <div className="flex items-center text-text-muted text-sm gap-1.5 font-medium">
          <span>{job.company}</span>
          <span className="text-text-light">•</span>
          <span>{job.location}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-2">
        {job.description}
      </p>

      {/* Footer: Tags */}
      <div className="flex flex-wrap gap-2">
        {job.categories.map((cat) => (
          <span
            key={cat}
            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border ${getTagStyles(
              cat,
            )}`}
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
