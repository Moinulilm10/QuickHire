"use client";

import AddJobForm, { AddJobFormData } from "@/components/jobs/AddJobForm";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Job, mockJobs } from "@/data/mockJobs";
import { alertService } from "@/utils/alertService";
import {
  ArrowLeft,
  Briefcase,
  FileText,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  expired: "bg-danger/10 text-danger",
  draft: "bg-accent/10 text-accent",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (job: Job) => {
    const confirmed = await alertService.confirmDelete(
      `${job.title} at ${job.company}`,
    );
    if (confirmed) {
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      if (selectedJob?.id === job.id) setSelectedJob(null);
      alertService.success("Deleted!", "Job listing has been removed.");
    }
  };

  const handleSaveJob = (data: AddJobFormData) => {
    if (selectedJob) {
      // Update existing job
      const updatedJobs = jobs.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              ...data,
              logoUrl: data.logoUrl ?? job.logoUrl,
            }
          : job,
      );
      setJobs(updatedJobs);
      // Update selectedJob to reflect changes in detail view
      setSelectedJob({
        ...selectedJob,
        ...data,
        logoUrl: data.logoUrl ?? selectedJob.logoUrl,
      });
      alertService.success("Updated!", "Job listing has been updated.");
    } else {
      // Add new job
      const newJob: Job = {
        id: Date.now().toString(),
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type,
        categories: ["General"],
        description: data.description,
        logoColor: "#4640DE",
        logoUrl: data.logoUrl ?? undefined,
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      };
      setJobs((prev) => [newJob, ...prev]);
      alertService.success("Success!", "New job listing has been added.");
    }
    setShowAddForm(false);
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
                  backgroundColor: selectedJob.logoUrl
                    ? "transparent"
                    : selectedJob.logoColor,
                }}
              >
                {selectedJob.logoUrl ? (
                  <img
                    src={selectedJob.logoUrl}
                    className="w-full h-full object-cover"
                    alt={selectedJob.company}
                  />
                ) : (
                  selectedJob.company.charAt(0)
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedJob.title}
                </h2>
                <p className="text-text-muted text-sm">
                  {selectedJob.company} • {selectedJob.location}
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
                {selectedJob.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-border text-foreground"
                  >
                    {cat}
                  </span>
                ))}
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
            <Input
              placeholder="Search by title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredJobs.map((job) => (
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
                    {job.logoUrl ? (
                      <img
                        src={job.logoUrl}
                        className="w-full h-full object-cover"
                        alt={job.company}
                      />
                    ) : (
                      job.company.charAt(0)
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusColors[job.status]}`}
                  >
                    {job.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
                  {job.title}
                </h3>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                  <Briefcase size={12} /> {job.company}
                </p>
                <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                  <MapPin size={12} /> {job.location}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-border">
                  <span className="text-[10px] text-text-muted">
                    {job.createdAt}
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

          {filteredJobs.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-text-muted text-lg">No jobs found</p>
              <p className="text-text-muted text-sm mt-1">
                Try a different search term
              </p>
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
                  company: selectedJob.company,
                  location: selectedJob.location,
                  type: selectedJob.type,
                  description: selectedJob.description,
                  logoUrl: selectedJob.logoUrl || null,
                }
              : undefined
          }
        />
      )}
    </>
  );
}
