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
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  expired: "bg-danger/10 text-danger",
  draft: "bg-accent/10 text-accent",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchJobs = async (page: number) => {
    setLoading(true);
    try {
      const data = await jobService.getJobs(page);

      if (data.success) {
        setJobs(data.jobs);
        setTotalPages(data.pagination.totalPages);
        setTotalJobs(data.pagination.total);
        setCurrentPage(page);
      } else {
        alertService.error("Error", data.message || "Could not fetch jobs");
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      alertService.error("Error", "An error occurred while fetching jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);

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
          fetchJobs(currentPage);
          if (selectedJob?.id === job.id) setSelectedJob(null);
        } else {
          alertService.error("Error", data.message || "Failed to delete job");
        }
      } catch (err) {
        alertService.error("Error", "Connection error");
      }
    }
  };

  const handleSaveJob = async (data: AddJobFormData) => {
    try {
      const resData = selectedJob
        ? await jobService.updateJob(selectedJob.id, data)
        : await jobService.createJob(data);

      if (resData.success) {
        alertService.success(
          selectedJob ? "Updated!" : "Success!",
          selectedJob
            ? "Job listing has been updated."
            : "New job listing has been added.",
        );
        fetchJobs(currentPage);
        setShowAddForm(false);
        if (selectedJob) setSelectedJob(resData.data);
      } else {
        alertService.error("Error", resData.message || "Failed to save job");
      }
    } catch (err) {
      alertService.error("Error", "Connection error");
    }
  };

  return (
    <>
      {selectedJob ? (
        <div className="space-y-6 animate-fade-in-up">
          <button
            onClick={() => setSelectedJob(null)}
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
                  backgroundColor: selectedJob.logo
                    ? "transparent"
                    : selectedJob.logoColor,
                }}
              >
                {selectedJob.logo ? (
                  <img
                    src={selectedJob.logo}
                    className="w-full h-full object-cover"
                    alt={selectedJob.company?.name || "Company"}
                  />
                ) : (
                  (selectedJob.company?.name || "C").charAt(0)
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedJob.title}
                </h2>
                <p className="text-text-muted text-sm">
                  {selectedJob.company?.name || "Company"} •{" "}
                  {selectedJob.location}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {selectedJob.type}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[selectedJob.status]}`}
                  >
                    {selectedJob.status}
                  </span>
                  {selectedJob.salary && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                      {selectedJob.salary}
                    </span>
                  )}
                  {selectedJob.experience && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                      Exp: {selectedJob.experience}
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
                {selectedJob.description}
              </p>
            </div>

            <div className="border-t border-surface-border pt-4 mb-6">
              <h3 className="text-sm font-bold text-foreground mb-2">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {(selectedJob.categories || []).map((cat: any) => {
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

            {/* PDF Viewer */}
            {selectedJob.pdfUrl && (
              <div className="border-t border-surface-border pt-4 mb-6">
                <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <FileText size={16} /> Attached PDF
                </h3>
                <div className="w-full h-[500px] border border-surface-border rounded-lg overflow-hidden">
                  <iframe
                    src={selectedJob.pdfUrl}
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
                onClick={() => setShowAddForm(true)}
              >
                Update Details
              </Button>
              <Button
                variant="danger"
                icon={<Trash2 size={16} />}
                onClick={() => handleDelete(selectedJob)}
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
              <p className="text-text-muted text-sm mt-1">
                {jobs.length} total jobs
              </p>
            </div>
            <Button
              icon={<Plus size={16} />}
              onClick={() => setShowAddForm(true)}
            >
              Add New Job
            </Button>
          </div>

          {/* Search */}
          <div className="max-w-md animate-fade-in-up">
            <SearchInput
              placeholder="Search by title..."
              value={search}
              onChange={setSearch}
            />
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-surface rounded-2xl p-6 border border-surface-border animate-pulse h-48"
                  />
                ))
              : jobs.map((job) => (
                  <Card
                    key={job.id}
                    hover
                    onClick={() => setSelectedJob(job)}
                    className="animate-fade-in-up group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden`}
                        style={{
                          backgroundColor: job.logoUrl
                            ? "transparent"
                            : job.logoColor,
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
                          handleDelete(job);
                        }}
                        className="text-text-muted hover:text-danger transition-all duration-200 cursor-pointer transform hover:scale-110"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Card>
                ))}
          </div>

          {jobs.length === 0 && !loading && (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-text-muted text-lg">No jobs found</p>
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchJobs(page)}
              />
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Job Modal */}
      {showAddForm && (
        <AddJobForm
          onSubmit={handleSaveJob}
          onCancel={() => setShowAddForm(false)}
          initialData={
            selectedJob
              ? {
                  title: selectedJob.title,
                  company: selectedJob.company?.name || "",
                  location: selectedJob.location,
                  type: selectedJob.type,
                  description: selectedJob.description,
                  logo: selectedJob.logo || null,
                  experience: selectedJob.experience || "",
                  salary: selectedJob.salary || "",
                  categories: (selectedJob.categories || []).map((cat: any) =>
                    typeof cat === "string" ? cat : cat.name,
                  ),
                }
              : undefined
          }
        />
      )}
    </>
  );
}
