"use client";

import { Job } from "@/data/jobsData";
import { MapPin } from "lucide-react";

interface JobCardProps {
  job: Job;
  index: number;
}

export default function JobCard({ job, index }: JobCardProps) {
  return (
    <div
      className="bg-white border border-surface-border p-6 hover:shadow-card transition-all duration-[var(--transition-base)] group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col gap-4">
        {/* Top: Logo & Type */}
        <div className="flex justify-between items-start">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-lg text-white font-bold text-xl"
            style={{ backgroundColor: job.logoColor }}
          >
            {job.company.charAt(0)}
          </div>
          <span className="px-3 py-1 border border-brand-primary text-brand-primary text-xs font-semibold">
            {job.type}
          </span>
        </div>

        {/* Middle: Title & Company */}
        <div>
          <h3 className="text-text-dark font-bold text-lg group-hover:text-brand-primary transition-colors duration-[var(--transition-fast)] line-clamp-1">
            {job.title}
          </h3>
          <p className="text-text-muted text-sm mt-1">{job.company}</p>
        </div>

        {/* Bottom: Location & Categories */}
        <div className="mt-2">
          <div className="flex items-center gap-1.5 text-text-muted text-xs mb-3">
            <MapPin size={14} />
            <span>{job.location}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.categories.map((cat) => (
              <span
                key={cat}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  cat === "Marketing" || cat === "Design"
                    ? "bg-orange-50 text-orange-600"
                    : "bg-brand-primary-light text-brand-primary"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
