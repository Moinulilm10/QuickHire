"use client";

import JobCard from "@/components/jobs/JobCard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { jobsData } from "@/data/jobsData";
import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredJobs = jobsData.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      job.location.toLowerCase().includes(locationTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[72px]">
        {/* Header Section */}
        <section className="bg-surface-light py-12 lg:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[800px] mb-10">
              <h1 className="text-[32px] sm:text-[44px] lg:text-[48px] font-bold text-text-dark leading-tight mb-4 tracking-tight">
                Find your <span className="text-brand-primary">dream job</span>
              </h1>
              <p className="text-text-body text-base sm:text-lg">
                Browse through thousands of job openings from top companies
                worldwide.
              </p>
            </div>

            {/* Simple Search/Filter UI */}
            <div className="bg-white p-2 border border-surface-border shadow-md flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
              <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-surface-border py-4 md:py-0">
                <Search size={20} className="text-brand-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="w-full px-3 py-2 focus:outline-none text-text-dark placeholder:text-text-muted"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-4 md:py-0">
                <MapPin size={20} className="text-brand-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full px-3 py-2 focus:outline-none text-text-dark placeholder:text-text-muted"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                />
              </div>
              <button className="bg-brand-primary text-white font-bold px-8 py-4 hover:bg-brand-primary-hover transition-all duration-300">
                Search Jobs
              </button>
            </div>
          </div>
        </section>

        {/* Jobs Grid Section */}
        <section className="py-12 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-[24px] sm:text-[28px] font-bold text-text-dark">
                All Jobs
                <span className="text-text-muted font-normal text-base ml-2">
                  Showing {filteredJobs.length} jobs
                </span>
              </h2>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 tracking-tight">
                {filteredJobs.map((job, index) => (
                  <JobCard key={job.id} job={job} index={index} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-surface-border rounded-lg">
                <p className="text-text-muted text-lg">
                  No jobs found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
