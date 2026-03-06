"use client";

import AddJobForm, { AddJobFormData } from "@/components/jobs/AddJobForm";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import { jobService } from "@/services/job.service";
import { alertService } from "@/utils/alertService";
import {
  ArrowLeft,
  Briefcase,
  FileText,
  Loader2,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { Suspense, use, useReducer, useState, useTransition } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── Reducer ─────────────────────────────────────────────────────────────────
interface JobsState {
  search: string;
  currentPage: number;
  selectedJob: any | null;
  showAddForm: boolean;
}

type JobsAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SELECT_JOB"; payload: any | null }
  | { type: "TOGGLE_ADD_FORM"; payload: boolean }
  | { type: "UPDATE_SELECTED_JOB"; payload: any };

const initialJobsState: JobsState = {
  search: "",
  currentPage: 1,
  selectedJob: null,
  showAddForm: false,
};

function jobsReducer(state: JobsState, action: JobsAction): JobsState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SELECT_JOB":
      return { ...state, selectedJob: action.payload };
    case "TOGGLE_ADD_FORM":
      return { ...state, showAddForm: action.payload };
    case "UPDATE_SELECTED_JOB":
      return { ...state, selectedJob: action.payload };
    default:
      return state;
  }
}

// ─── Jobs List (uses use()) ──────────────────────────────────────────────────
function JobsListContent({
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
      {/* Job Cards Grid */}
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
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden`}
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

// ─── Loading Skeleton ────────────────────────────────────────────────────────
function JobsLoadingSkeleton() {
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

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function JobsPage() {
  const [state, dispatch] = useReducer(jobsReducer, initialJobsState);
  const [isPending, startTransition] = useTransition();
  const [dataPromise, setDataPromise] = useState(() => jobService.getJobs(1));

  const refetch = (page?: number) => {
    const p = page ?? state.currentPage;
    startTransition(() => {
      setDataPromise(jobService.getJobs(p));
    });
  };

  // Sync page changes with refetch
  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
    refetch(page);
  };

  const handleDelete = async (job: any) => {
    const confirmed = await alertService.confirm(
      "Are you sure?",
      `Confirm deleting ${job.title} at ${job.company?.name || "the company"}.`,
      "Delete",
      true,
    );

    if (confirmed.isConfirmed) {
      try {
        const data = await jobService.deleteJob(job.id);
        if (data.success) {
          alertService.success("Deleted!", "Job listing has been removed.");
          refetch();
          if (state.selectedJob?.id === job.id)
            dispatch({ type: "SELECT_JOB", payload: null });
        } else {
          alertService.error("Error", data.message || "Failed to delete job");
        }
      } catch (err) {
        alertService.error("Error", "Connection error");
      }
    }
  };

  const handleSaveJob = async (formData: AddJobFormData) => {
    try {
      const resData = state.selectedJob
        ? await jobService.updateJob(state.selectedJob.id, formData)
        : await jobService.createJob(formData);

      if (resData.success) {
        alertService.success(
          state.selectedJob ? "Updated!" : "Success!",
          state.selectedJob
            ? "Job listing has been updated."
            : "New job listing has been added.",
        );
        refetch();
        dispatch({ type: "TOGGLE_ADD_FORM", payload: false });
        if (state.selectedJob)
          dispatch({ type: "UPDATE_SELECTED_JOB", payload: resData.data });
      } else {
        alertService.error("Error", resData.message || "Failed to save job");
      }
    } catch (err) {
      alertService.error("Error", "Connection error");
    }
  };

  return (
    <>
      {state.selectedJob ? (
        <div className="space-y-6 animate-fade-in-up">
          <button
            onClick={() => dispatch({ type: "SELECT_JOB", payload: null })}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>

          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden`}
                style={{
                  backgroundColor: state.selectedJob.logo
                    ? "transparent"
                    : state.selectedJob.logoColor,
                }}
              >
                {state.selectedJob.logo ? (
                  <img
                    src={state.selectedJob.logo}
                    className="w-full h-full object-cover"
                    alt={state.selectedJob.company?.name || "Company"}
                  />
                ) : (
                  (state.selectedJob.company?.name || "C").charAt(0)
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {state.selectedJob.title}
                </h2>
                <p className="text-text-muted text-sm">
                  {state.selectedJob.company?.name || "Company"} •{" "}
                  {state.selectedJob.location}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {state.selectedJob.type}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[state.selectedJob.status]}`}
                  >
                    {state.selectedJob.status}
                  </span>
                  {state.selectedJob.salary && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                      {state.selectedJob.salary}
                    </span>
                  )}
                  {state.selectedJob.experience && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                      Exp: {state.selectedJob.experience}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-surface-border pt-4 mb-6">
              <h3 className="text-sm font-bold text-foreground mb-2">
                Description
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {state.selectedJob.description}
              </p>
            </div>

            <div className="border-t border-surface-border pt-4 mb-6">
              <h3 className="text-sm font-bold text-foreground mb-2">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {(state.selectedJob.categories || []).map((cat: any) => {
                  const name = typeof cat === "string" ? cat : cat.name;
                  return (
                    <span
                      key={typeof cat === "string" ? cat : cat.id}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-border text-foreground"
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>

            {state.selectedJob.pdfUrl && (
              <div className="border-t border-surface-border pt-4 mb-6">
                <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <FileText size={16} /> Attached PDF
                </h3>
                <div className="w-full h-[500px] border border-surface-border rounded-lg overflow-hidden">
                  <iframe
                    src={state.selectedJob.pdfUrl}
                    className="w-full h-full"
                    title="Job PDF"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                icon={<Plus size={16} />}
                onClick={() =>
                  dispatch({ type: "TOGGLE_ADD_FORM", payload: true })
                }
              >
                Update Details
              </Button>
              <Button
                variant="danger"
                icon={<Trash2 size={16} />}
                onClick={() => handleDelete(state.selectedJob)}
              >
                Delete Job
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Job Listings
              </h1>
              <p className="text-text-muted text-sm mt-1">Manage all jobs</p>
            </div>
            <Button
              icon={<Plus size={16} />}
              onClick={() =>
                dispatch({ type: "TOGGLE_ADD_FORM", payload: true })
              }
            >
              Add New Job
            </Button>
          </div>

          {/* Search */}
          <div className="max-w-md animate-fade-in-up flex items-center gap-3">
            <SearchInput
              placeholder="Search by title..."
              value={state.search}
              onChange={(val) => dispatch({ type: "SET_SEARCH", payload: val })}
              className="flex-1"
            />
            {isPending && (
              <Loader2 size={18} className="animate-spin text-primary" />
            )}
          </div>

          <Suspense fallback={<JobsLoadingSkeleton />}>
            <JobsListContent
              dataPromise={dataPromise}
              isPending={isPending}
              state={state}
              dispatch={dispatch}
              onDelete={handleDelete}
            />
          </Suspense>
        </div>
      )}

      {/* Add/Edit Job Modal */}
      {state.showAddForm && (
        <AddJobForm
          onSubmit={handleSaveJob}
          onCancel={() => dispatch({ type: "TOGGLE_ADD_FORM", payload: false })}
          initialData={
            state.selectedJob
              ? {
                  title: state.selectedJob.title,
                  company: state.selectedJob.company?.name || "",
                  location: state.selectedJob.location,
                  type: state.selectedJob.type,
                  description: state.selectedJob.description,
                  logo: state.selectedJob.logo || null,
                  experience: state.selectedJob.experience || "",
                  salary: state.selectedJob.salary || "",
                  categories: (state.selectedJob.categories || []).map(
                    (cat: any) => (typeof cat === "string" ? cat : cat.name),
                  ),
                }
              : undefined
          }
        />
      )}
    </>
  );
}
