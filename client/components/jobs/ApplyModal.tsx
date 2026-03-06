"use client";

import { useAuth } from "@/context/AuthContext";
import { applicationService } from "@/services/application.service";
import { alertService } from "@/utils/alertService";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number;
  companyId: number;
  jobTitle: string;
}

export default function ApplyModal({
  isOpen,
  onClose,
  jobId,
  companyId,
  jobTitle,
}: ApplyModalProps) {
  const { token, user } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alertService.error("Invalid File", "Please upload a PDF file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alertService.error("File Too Large", "Maximum file size is 5MB.");
        return;
      }

      setResumeFile(file);

      // Create preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create synthetic event
      const event = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alertService.warning("Authentication Required", "Please login to apply.");
      return;
    }

    if (!resumeFile) {
      alertService.warning(
        "Resume Required",
        "Please upload your resume in PDF format.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("jobId", jobId.toString());
      formData.append("companyId", companyId.toString());
      formData.append("resume", resumeFile);
      if (coverLetter) {
        formData.append("coverLetter", coverLetter);
      }

      await applicationService.createApplication(formData, token);

      alertService.success(
        "Application Submitted!",
        "Your application has been sent successfully.",
      );
      closeAndClean();
    } catch (error: any) {
      alertService.error(
        "Application Failed",
        error.message || "An error occurred while submitting your application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAndClean = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setResumeFile(null);
    setCoverLetter("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-light">
          <div>
            <h2 className="text-xl font-bold text-text-dark">
              Apply for {jobTitle}
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Submit your resume and cover letter
            </p>
          </div>
          <button
            onClick={closeAndClean}
            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="apply-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Upload Area */}
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Resume (PDF only, max 5MB){" "}
                <span className="text-red-500">*</span>
              </label>

              {!resumeFile ? (
                <div
                  className="border-2 border-dashed border-surface-border rounded-xl p-8 hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-3"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                    <UploadCloud size={28} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-text-dark">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-text-muted mt-1">
                      PDF file only
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-green-600">
                          {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button" // Fix: Add type="button" to prevent form submission
                      onClick={() => {
                        setResumeFile(null);
                        setPreviewUrl(null);
                      }}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>

                  {/* PDF Preview */}
                  {previewUrl && (
                    <div className="border border-surface-border rounded-lg overflow-hidden h-80 bg-surface-muted">
                      <iframe
                        src={`${previewUrl}#toolbar=0`}
                        className="w-full h-full"
                        title="Resume Preview"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cover Letter Area */}
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-4 py-3 border border-surface-border rounded-lg focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all resize-y min-h-[120px]"
                placeholder="Why are you a great fit for this role? What makes you unique?"
              />
            </div>
          </form>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-surface-border bg-surface-light flex justify-end gap-3">
          <button
            type="button"
            onClick={closeAndClean}
            className="px-6 py-2.5 rounded-lg border border-surface-border text-text-dark font-medium hover:bg-surface-muted transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="apply-form"
            disabled={isSubmitting || !resumeFile}
            className="px-8 py-2.5 rounded-lg bg-brand-primary text-white font-bold hover:bg-brand-primary-hover hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
