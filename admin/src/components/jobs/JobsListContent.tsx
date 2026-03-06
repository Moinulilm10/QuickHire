"use client";

import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import type { JobsAction, JobsState } from "@/reducers/jobs.reducer";
import { Briefcase, MapPin, Trash2 } from "lucide-react";
import { use } from "react";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  expired: "bg-danger/10 text-danger",
  draft: "bg-accent/10 text-accent",
};

interface JobsResponse {
  success: boolean;
  jobs: any[];
  pagination: { total: number; totalPages: number };
  message?: string;
}

export function JobsListContent({
  dataPromise,
  isPending,
  state,
  dispatch,
  onDelete,
}: {
  dataPromise: Promise<JobsResponse>;
  isPending: boolean;
  state: JobsState;
  dispatch: React.Dispatch<JobsAction>;
  onDelete: (job: any) => void;
}) {
  const data = use(dataPromise);
  const jobs = data.jobs || [];
  const totalPages = data.pagination?.totalPages || 1;

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-opacity duration-200"
        style={{ opacity: isPending ? 0.6 : 1 }}
      >
        {jobs.map((job) => (
          <Card
            key={job.id}
            hover
            onClick={() => dispatch({ type: "SELECT_JOB", payload: job })}
            className="animate-fade-in-up group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden"
                style={{
                  backgroundColor: job.logoUrl ? "transparent" : job.logoColor,
                }}
              >
                {job.logo ? (
                  <img
                    src={job.logo}
                    className="w-full h-full object-cover"
                    alt={job.company?.name || "Company"}
                  />
                ) : (
                  (job.company?.name || "C").charAt(0)
                )}
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusColors[job.status] || "bg-surface-border text-foreground"}`}
              >
                {job.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
              {job.title}
            </h3>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
              <Briefcase size={12} /> {job.company?.name || "Company"}
            </p>
            <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
              <MapPin size={12} /> {job.location}
            </p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-border">
              <span className="text-[10px] text-text-muted">
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(job);
                }}
                className="text-text-muted hover:text-danger transition-all duration-200 cursor-pointer transform hover:scale-110"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-text-muted text-lg">No jobs found</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={state.currentPage}
            totalPages={totalPages}
            onPageChange={(page) =>
              dispatch({ type: "SET_PAGE", payload: page })
            }
          />
        </div>
      )}
    </>
  );
}

export function JobsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-surface rounded-2xl p-6 border border-surface-border animate-pulse h-48"
        />
      ))}
    </div>
  );
}

export { statusColors };
