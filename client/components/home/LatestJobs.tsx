"use client";

import { Job } from "@/data/jobsData";
import {
  latestJobsInitialState,
  latestJobsReducer,
} from "@/reducers/latestJobsReducer";
import { jobService } from "@/services/job.service";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense, use, useEffect, useReducer, useRef } from "react";
import LatestJobCard from "./LatestJobCard";

// ─── Data Fetcher ────────────────────────────────────────
function fetchLatestJobs(): Promise<Job[]> {
  return jobService
    .getLatestJobs()
    .then((jobsData) => {
      if (jobsData) {
        return jobsData.map((job: any) => ({
          id: job.id.toString(),
          uuid: job.uuid,
          title: job.title,
          company: job.company?.name,
          location: job.location,
          type: job.type,
          categories: job.categories?.map((c: any) => c.name) || [],
          logoColor: job.logoColor || "#0061FF",
          logoUrl: job.logo,
          salary: job.salary,
          createdAt: job.createdAt,
        }));
      }
      return [];
    })
    .catch((err) => {
      console.error("Failed to fetch latest jobs:", err);
      return [];
    });
}

// ─── Inner Content ───────────────────────────────────────
function LatestJobsContent({
  dataPromise,
  isVisible,
}: {
  dataPromise: Promise<Job[]>;
  isVisible: boolean;
}) {
  const jobs = use(dataPromise);
  console.log("🚀 ~ LatestJobsContent ~ jobs:", jobs);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {jobs.map((job, index) => (
        <LatestJobCard
          key={job.id}
          job={job}
          index={index}
          isVisible={isVisible}
        />
      ))}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────
function LatestJobsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-[120px] bg-white/50 animate-pulse rounded border border-surface-border shadow-sm"
        ></div>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────
export default function LatestJobs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(
    latestJobsReducer,
    latestJobsInitialState,
  );
  const promiseRef = useRef(fetchLatestJobs());

  // IntersectionObserver — kept as useEffect (DOM side-effect)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch({ type: "SET_VISIBLE" });
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
      className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24 overflow-hidden"
      style={{
        backgroundColor: "#3a35c4",
        backgroundImage: "url('/assets/lattest-job-pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Semi-transparent overlay to ensure readability */}
      <div className="absolute inset-0 bg-white/90 pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 lg:mb-14 gap-4 ${
            state.isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <h2 className="text-[32px] sm:text-[40px] font-bold text-text-dark leading-tight tracking-tight">
            Latest <span className="text-brand-accent">jobs open</span>
          </h2>
          <Link
            href="/jobs"
            className="group inline-flex items-center gap-2 text-brand-primary font-bold text-base hover:gap-3 transition-all duration-300 cursor-pointer"
          >
            Show all jobs
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Jobs Grid */}
        <Suspense fallback={<LatestJobsSkeleton />}>
          <LatestJobsContent
            dataPromise={promiseRef.current}
            isVisible={state.isVisible}
          />
        </Suspense>
      </div>
    </section>
  );
}
