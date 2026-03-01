"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LogoUpload from "@/components/ui/LogoUpload";
import { X } from "lucide-react";
import { useState } from "react";

export interface AddJobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  logoUrl: string | null;
}

interface AddJobFormProps {
  onSubmit: (data: AddJobFormData) => void;
  onCancel: () => void;
}

export default function AddJobForm({ onSubmit, onCancel }: AddJobFormProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Job title is required";
    if (!company.trim()) newErrors.company = "Company name is required";
    if (!location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      type: type.trim() || "Full Time",
      description: description.trim(),
      logoUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 cursor-pointer"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-surface-border overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="text-lg font-bold text-foreground">Add New Job</h2>
          <button
            onClick={onCancel}
            className="text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <LogoUpload value={logoUrl} onChange={setLogoUrl} />

          <Input
            label="Job Title"
            placeholder="e.g. Senior Designer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />

          <Input
            label="Company"
            placeholder="e.g. Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            error={errors.company}
          />

          <Input
            label="Location"
            placeholder="e.g. New York, US"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={errors.location}
          />

          <Input
            label="Type"
            placeholder="e.g. Full Time"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />

          <div className="w-full">
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Job description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="
                w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5
                text-sm text-foreground placeholder:text-text-muted
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                transition-all duration-200 resize-none
              "
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Job</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
