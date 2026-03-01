"use client";

import { ImagePlus, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface LogoUploadProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

export default function LogoUpload({ value, onChange }: LogoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const pct = Math.round((event.loaded / event.total) * 100);
        setProgress(pct);
      }
    };

    reader.onload = (event) => {
      // Simulate a brief upload delay for UX polish
      let simulated = 0;
      const interval = setInterval(() => {
        simulated += 15;
        setProgress(Math.min(simulated, 100));
        if (simulated >= 100) {
          clearInterval(interval);
          setUploading(false);
          onChange(event.target?.result as string);
        }
      }, 40);
    };

    reader.onerror = () => {
      setUploading(false);
      setProgress(0);
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    setProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-foreground mb-1.5">
        Company Logo
      </label>

      {/* Preview / Upload Area */}
      <div
        onClick={() => !value && fileRef.current?.click()}
        className={`
          relative w-full h-36 rounded-xl border-2 border-dashed
          flex items-center justify-center overflow-hidden
          transition-all duration-300
          ${
            value
              ? "border-primary/30 bg-primary/5"
              : "border-surface-border bg-surface hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
          }
        `}
      >
        {/* Uploading state */}
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 z-10 animate-fade-in">
            <div className="w-32 h-2 bg-surface-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-primary font-semibold mt-2">
              {progress}%
            </span>
          </div>
        )}

        {/* Preview */}
        {value && !uploading && (
          <div className="relative w-full h-full group">
            <img
              src={value}
              alt="Logo preview"
              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            />
            {/* Remove & Replace overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-lg bg-white text-foreground text-xs font-semibold cursor-pointer
                           hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-105"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="p-1.5 rounded-lg bg-danger text-white cursor-pointer
                           hover:bg-danger-hover transition-all duration-200 transform hover:scale-105"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!value && !uploading && (
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <ImagePlus size={20} className="text-primary" />
            </div>
            <span className="text-xs font-medium">Click to upload logo</span>
            <span className="text-[10px]">PNG, JPG up to 2MB</span>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
