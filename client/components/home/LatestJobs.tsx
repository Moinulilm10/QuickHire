"use client";

import { latestJobs } from "@/data/jobsData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LatestJobCard from "./LatestJobCard";

export default function LatestJobs() {
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
      className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-white overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-[0.03]">
        <svg
          width="400"
          height="800"
          viewBox="0 0 400 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M400 0L0 400M400 400L0 800"
            stroke="var(--brand-primary)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 lg:mb-14 gap-4 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <h2 className="text-[32px] sm:text-[40px] font-bold text-text-dark leading-tight tracking-tight">
            Latest <span className="text-brand-accent">jobs open</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {latestJobs.map((job, index) => (
            <LatestJobCard
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
