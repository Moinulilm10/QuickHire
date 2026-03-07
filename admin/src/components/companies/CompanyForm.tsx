"use client";

import { CompanyPayload } from "@/services/company.service";
import React from "react";
import Input from "../ui/Input";
import LogoUpload from "../ui/LogoUpload";

interface CompanyFormProps {
  formData: CompanyPayload;
  onChange: (field: keyof CompanyPayload, value: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CompanyForm({
  formData,
  onChange,
  onSubmit,
}: CompanyFormProps) {
  return (
    <form id="company-form" onSubmit={onSubmit} className="space-y-5">
      <Input
        label="Company Name *"
        placeholder="Enter company name"
        required
        value={formData.name}
        onChange={(e) => onChange("name", e.target.value)}
      />

      <Input
        label="Location *"
        placeholder="e.g. New York, Berlin, Remote"
        required
        value={formData.location}
        onChange={(e) => onChange("location", e.target.value)}
      />

      <LogoUpload
        value={formData.logo}
        onChange={(dataUrl) => onChange("logo", dataUrl)}
      />
    </form>
  );
}
