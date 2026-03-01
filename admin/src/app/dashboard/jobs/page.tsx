"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Job, mockJobs } from "@/data/mockJobs";
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
import Swal from "sweetalert2";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  expired: "bg-danger/10 text-danger",
  draft: "bg-accent/10 text-accent",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (job: Job) => {
    const result = await Swal.fire({
      title: "Delete Job?",
      text: `Are you sure you want to delete "${job.title}" at ${job.company}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      Swal.fire({
        title: "Deleted!",
        text: "Job listing has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleAddJob = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Job",
      html: `
        <div style="text-align:left;display:flex;flex-direction:column;gap:12px;">
          <div>
            <label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px;">Job Title</label>
            <input id="swal-title" class="swal2-input" placeholder="e.g. Senior Designer" style="margin:0;width:100%;">
          </div>
          <div>
            <label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px;">Company</label>
            <input id="swal-company" class="swal2-input" placeholder="e.g. Google" style="margin:0;width:100%;">
          </div>
          <div>
            <label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px;">Location</label>
            <input id="swal-location" class="swal2-input" placeholder="e.g. New York, US" style="margin:0;width:100%;">
          </div>
          <div>
            <label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px;">Type</label>
            <input id="swal-type" class="swal2-input" placeholder="e.g. Full Time" style="margin:0;width:100%;">
          </div>
          <div>
            <label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px;">Description</label>
            <textarea id="swal-desc" class="swal2-textarea" placeholder="Job description..." style="margin:0;width:100%;min-height:80px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#4640DE",
      confirmButtonText: "Add Job",
      preConfirm: () => {
        const title = (
          document.getElementById("swal-title") as HTMLInputElement
        )?.value;
        const company = (
          document.getElementById("swal-company") as HTMLInputElement
        )?.value;
        const location = (
          document.getElementById("swal-location") as HTMLInputElement
        )?.value;
        const type = (document.getElementById("swal-type") as HTMLInputElement)
          ?.value;
        const description = (
          document.getElementById("swal-desc") as HTMLTextAreaElement
        )?.value;

        if (!title || !company || !location) {
          Swal.showValidationMessage(
            "Title, Company, and Location are required",
          );
          return;
        }
        return {
          title,
          company,
          location,
          type: type || "Full Time",
          description: description || "",
        };
      },
    });

    if (formValues) {
      const newJob: Job = {
        id: Date.now().toString(),
        title: formValues.title,
        company: formValues.company,
        location: formValues.location,
        type: formValues.type,
        categories: ["General"],
        description: formValues.description,
        logoColor: "#4640DE",
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      };
      setJobs((prev) => [newJob, ...prev]);
      Swal.fire({
        title: "Success!",
        text: "New job listing has been added.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Detail View
  if (selectedJob) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <button
          onClick={() => setSelectedJob(null)}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </button>

        <Card>
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ backgroundColor: selectedJob.logoColor }}
            >
              {selectedJob.company.charAt(0)}
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
              variant="danger"
              icon={<Trash2 size={16} />}
              onClick={() => {
                handleDelete(selectedJob);
                setSelectedJob(null);
              }}
            >
              Delete Job
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Listings</h1>
          <p className="text-text-muted text-sm mt-1">
            {jobs.length} total jobs
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={handleAddJob}>
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
        {filteredJobs.map((job, i) => (
          <Card
            key={job.id}
            hover
            onClick={() => setSelectedJob(job)}
            className="animate-fade-in-up group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ backgroundColor: job.logoColor }}
              >
                {job.company.charAt(0)}
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
                className="text-text-muted hover:text-danger transition-colors duration-200"
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
  );
}
