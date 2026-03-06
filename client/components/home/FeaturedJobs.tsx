"use client";

import { Job } from "@/data/jobsData";
import { jobService } from "@/services/job.service";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FeaturedJobCard from "./FeaturedJobCard";

export default function FeaturedJobs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const data = await jobService.getFeaturedJobs();
        if (data) {
          const formatted = data.map((job: any) => ({
            id: job.id.toString(),
            uuid: job.uuid,
            title: job.title,
            company: job.company?.name || "Unknown Company",
            location: job.location || "Remote",
            type: job.type || "Full Time",
            categories: job.categories?.map((c: any) => c.name) || [],
            logoColor: job.logoColor || "#0061FF",
            logoUrl: job.logo,
            description: job.description,
            createdAt: job.createdAt,
          }));
          setJobs(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch featured jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

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
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[380px] bg-white/50 animate-pulse rounded border border-surface-border shadow-sm"
                ></div>
              ))
            : jobs.map((job, index) => (
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
