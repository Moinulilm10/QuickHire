"use client";

import JobCard from "@/components/jobs/JobCard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Pagination from "@/components/ui/Pagination";
import { Job } from "@/data/jobsData";
import { useDebounce } from "@/hooks/useDebounce";
import { jobsInitialState, jobsReducer } from "@/reducers/jobsReducer";
import { MapPin, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, use, useReducer, useRef, useTransition } from "react";

const jobsPerPage = 8;

// ─── Data Fetcher ────────────────────────────────────────
function fetchJobs(): Promise<Job[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
  return fetch(`${apiUrl}/jobs?limit=100`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        return data.jobs.map((job: any) => ({
          id: job.id.toString(),
          uuid: job.uuid,
          title: job.title,
          company: job.company?.name || "Unknown Company",
          location: job.location || "Remote",
          type: job.type || "Full Time",
          categories: job.categories?.map((c: any) => c.name) || [],
          logoColor: job.company?.logoColor || "#0061FF",
          logoUrl: job.company?.logoUrl,
          description: job.description,
        }));
      }
      return [];
    })
    .catch((err) => {
      console.error("Failed to fetch jobs:", err);
      return [];
    });
}

// ─── Inner Content ───────────────────────────────────────
function JobsContent({
  dataPromise,
  searchTerm,
  locationTerm,
  debouncedSearch,
  debouncedLocation,
  categoryFilter,
  currentPage,
  onSearchChange,
  onLocationChange,
  onPageChange,
}: {
  dataPromise: Promise<Job[]>;
  searchTerm: string;
  locationTerm: string;
  debouncedSearch: string;
  debouncedLocation: string;
  categoryFilter: string | null;
  currentPage: number;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPageChange: (page: number) => void;
}) {
  const jobs = use(dataPromise);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    const matchesLocation = job.location
      .toLowerCase()
      .includes(debouncedLocation.toLowerCase());
    const matchesCategory = categoryFilter
      ? job.categories.some(
          (cat) =>
            cat.toLowerCase().replace(" ", "-") ===
            categoryFilter.toLowerCase(),
        )
      : true;

    return matchesSearch && matchesLocation && matchesCategory;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
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
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-4 md:py-0">
                <MapPin size={20} className="text-brand-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full px-3 py-2 focus:outline-none text-text-dark placeholder:text-text-muted"
                  value={locationTerm}
                  onChange={(e) => onLocationChange(e.target.value)}
                />
              </div>
              <button className="bg-brand-primary text-white font-bold px-8 py-4 hover:bg-brand-primary-hover transition-all duration-300 cursor-pointer">
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 tracking-tight">
                  {paginatedJobs.map((job, index) => (
                    <JobCard key={job.id} job={job} index={index} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 pt-8 border-t border-surface-border">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={onPageChange}
                    />
                  </div>
                )}
              </>
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

// ─── Skeleton ────────────────────────────────────────────
function JobsSkeleton() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin"></div>
    </div>
  );
}

// ─── Inner Wrapper (needs useSearchParams) ───────────────
function JobsPageContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [state, dispatch] = useReducer(jobsReducer, jobsInitialState);
  const [isPending, startTransition] = useTransition();
  const promiseRef = useRef(fetchJobs());

  const debouncedSearch = useDebounce(state.searchTerm, 400);
  const debouncedLocation = useDebounce(state.locationTerm, 400);

  return (
    <div className={isPending ? "opacity-60 transition-opacity" : ""}>
      <Suspense fallback={<JobsSkeleton />}>
        <JobsContent
          dataPromise={promiseRef.current}
          searchTerm={state.searchTerm}
          locationTerm={state.locationTerm}
          debouncedSearch={debouncedSearch}
          debouncedLocation={debouncedLocation}
          categoryFilter={categoryFilter}
          currentPage={state.currentPage}
          onSearchChange={(value) =>
            dispatch({ type: "SET_SEARCH", payload: value })
          }
          onLocationChange={(value) =>
            dispatch({ type: "SET_LOCATION", payload: value })
          }
          onPageChange={(page) => dispatch({ type: "SET_PAGE", payload: page })}
        />
      </Suspense>
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────
export default function JobsPage() {
  return (
    <Suspense fallback={<JobsSkeleton />}>
      <JobsPageContent />
    </Suspense>
  );
}
