"use client";

import { featuredJobs } from "@/data/jobsData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FeaturedJobCard from "./FeaturedJobCard";

export default function FeaturedJobs() {
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
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-white"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 lg:mb-14 gap-4 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <h2 className="text-[32px] sm:text-[40px] font-bold text-text-dark leading-tight tracking-tight">
            Featured <span className="text-brand-accent">jobs</span>
          </h2>
          <Link
            href="/jobs"
            className="group inline-flex items-center gap-2 text-brand-primary font-bold text-base hover:gap-3 transition-all duration-300"
          >
            Show all jobs
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 tracking-tight">
          {featuredJobs.map((job, index) => (
            <FeaturedJobCard
              key={job.id}
              job={job}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
