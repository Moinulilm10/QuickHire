import React from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  required?: boolean;
}

export default function Input({
  label,
  placeholder,
  type = "text",
  icon,
  error,
  className = "",
  value,
  onChange,
  name,
  id,
  required = false,
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-text-dark">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors duration-[var(--transition-fast)] group-focus-within:text-brand-primary">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          required={required}
          className={`w-full rounded-[var(--radius-sm)] border border-surface-border bg-white px-4 py-3 text-text-dark placeholder:text-text-muted transition-all duration-[var(--transition-fast)] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 ${
            icon ? "pl-11" : ""
          } ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : ""}`}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-0.5 animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
}
