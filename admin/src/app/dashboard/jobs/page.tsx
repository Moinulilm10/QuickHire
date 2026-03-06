"use client";

import AddJobForm, { AddJobFormData } from "@/components/jobs/AddJobForm";
import {
  JobsListContent,
  JobsLoadingSkeleton,
  statusColors,
} from "@/components/jobs/JobsListContent";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SearchInput from "@/components/ui/SearchInput";
import { useDebounce } from "@/hooks/useDebounce";
import { initialJobsState, jobsReducer } from "@/reducers/jobs.reducer";
import { jobService } from "@/services/job.service";
import { alertService } from "@/utils/alertService";
import { ArrowLeft, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import {
  Suspense,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from "react";

export default function JobsPage() {
  const [state, dispatch] = useReducer(jobsReducer, initialJobsState);
  const [isPending, startTransition] = useTransition();
  const debouncedSearch = useDebounce(state.search, 400);
  const [dataPromise, setDataPromise] = useState<Promise<any> | null>(null);

  const refetch = (page?: number, search?: string) => {
    const p = page ?? state.currentPage;
    const s = search ?? debouncedSearch;
    startTransition(() => {
      setDataPromise(jobService.getJobs(p, s));
    });
  };

  useEffect(() => {
    refetch(1, debouncedSearch);
  }, [debouncedSearch]);

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

  // ─── Selected Job Detail ────────────────────────────────────────────────
  if (state.selectedJob) {
    return (
      <>
        <div className="space-y-6 animate-fade-in-up">
          <button
            onClick={() => dispatch({ type: "SELECT_JOB", payload: null })}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Jobs
          </button>

          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden"
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

        {state.showAddForm && (
          <AddJobForm
            onSubmit={handleSaveJob}
            onCancel={() =>
              dispatch({ type: "TOGGLE_ADD_FORM", payload: false })
            }
            initialData={{
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
            }}
          />
        )}
      </>
    );
  }

  // ─── Jobs List View ─────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Job Listings</h1>
            <p className="text-text-muted text-sm mt-1">Manage all jobs</p>
          </div>
          <Button
            icon={<Plus size={16} />}
            onClick={() => dispatch({ type: "TOGGLE_ADD_FORM", payload: true })}
          >
            Add New Job
          </Button>
        </div>

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

        {!dataPromise ? (
          <JobsLoadingSkeleton />
        ) : (
          <Suspense fallback={<JobsLoadingSkeleton />}>
            <JobsListContent
              dataPromise={dataPromise}
              isPending={isPending}
              state={state}
              dispatch={dispatch}
              onDelete={handleDelete}
            />
          </Suspense>
        )}
      </div>

      {state.showAddForm && !state.selectedJob && (
        <AddJobForm
          onSubmit={handleSaveJob}
          onCancel={() => dispatch({ type: "TOGGLE_ADD_FORM", payload: false })}
        />
      )}
    </>
  );
}
