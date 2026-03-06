"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { jobService } from "@/services/job.service";
import { formatDate } from "@/utils/dateUtils";
import { getInitials } from "@/utils/stringUtils";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = use(params);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobDetails(uuid);
        setJob(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchJob();
    }
  }, [uuid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-bold text-text-dark mb-4">
          Job Not Found
        </h2>
        <p className="text-text-muted mb-8">
          {error || "The job you are looking for does not exist."}
        </p>
        <Link
          href="/jobs"
          className="bg-brand-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-primary-hover transition"
        >
          Back to all jobs
        </Link>
      </div>
    );
  }

  // Format the date mapping
  const formattedDate = formatDate(job.createdAt);

  return (
    <div className="min-h-screen bg-surface-light">
      <Navbar />

      <main className="pt-[72px] pb-20">
        {/* Header / Banner area */}
        <div className="bg-white border-b border-surface-border">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              <span>Back to jobs</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-start gap-6 lg:gap-10">
              {/* Logo */}
              <div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg flex-shrink-0 flex items-center justify-center border border-surface-border shadow-sm bg-white"
                style={{
                  backgroundColor:
                    job.logoColor || "var(--brand-primary-light)",
                }}
              >
                {job.logo ? (
                  <Image
                    src={job.logo}
                    alt={job.company?.name || "Company Logo"}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-white font-bold text-4xl tracking-wider">
                    {getInitials(job.title)}
                  </span>
                )}
              </div>

              {/* Title & Core Info */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-text-dark mb-4">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-text-muted">
                  <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-brand-primary" />
                    <span className="font-medium text-text-dark">
                      {job.company?.name || "Unknown Company"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-brand-primary" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} className="text-brand-primary" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-brand-primary" />
                    <span>Posted {formattedDate}</span>
                  </div>
                </div>
              </div>

              {/* Apply Action */}
              <div className="md:self-center shrink-0 w-full md:w-auto mt-6 md:mt-0">
                <button className="w-full md:w-auto bg-brand-primary text-white font-bold px-8 py-4 rounded-md hover:bg-brand-primary-hover hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                  Apply for this job
                </button>
                <p className="text-center text-sm text-text-muted mt-3">
                  Status:{" "}
                  <span className="font-semibold capitalize text-brand-accent">
                    {job.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Wrapper */}
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Col - Descriptions */}
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-2xl font-bold text-text-dark mb-4">
                  Job Description
                </h2>
                <div className="prose prose-brand max-w-none text-text-body space-y-4">
                  {job.description ? (
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {job.description}
                    </p>
                  ) : (
                    <p className="italic text-text-muted">
                      No specific description provided for this job listing.
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Right Col - Metadata Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-surface-border p-6 shadow-sm rounded-lg sticky top-24">
                <h3 className="text-lg font-bold text-text-dark mb-6">
                  Job Overview
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary-light flex items-center justify-center shrink-0">
                      <Calendar size={18} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Date Posted</p>
                      <p className="font-semibold text-text-dark">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary-light flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Location</p>
                      <p className="font-semibold text-text-dark">
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary-light flex items-center justify-center shrink-0">
                      <DollarSign size={18} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Salary</p>
                      <p className="font-semibold text-text-dark">
                        {job.salary || "Not Disclosed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary-light flex items-center justify-center shrink-0">
                      <Briefcase size={18} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Experience</p>
                      <p className="font-semibold text-text-dark">
                        {job.experience || "Not Specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary-light flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Job Type</p>
                      <p className="font-semibold text-text-dark">{job.type}</p>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-surface-border" />

                <h3 className="text-lg font-bold text-text-dark mb-4">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.categories && job.categories.length > 0 ? (
                    job.categories.map((cat: any) => (
                      <Link
                        key={cat.id}
                        href={`/jobs?category=${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="bg-surface-light text-text-body px-3 py-1 rounded-full text-sm font-medium border border-surface-border hover:border-brand-primary hover:text-brand-primary transition-colors duration-200"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-text-muted text-sm italic">
                      No categories assigned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
