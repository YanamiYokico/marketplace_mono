"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/shared/lib";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, options, placeholder, error, id, className, ...props }, ref) {
    const selectId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium opacity-85">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-11 w-full rounded-lg border border-foreground/20 bg-background px-3.5 text-[15px] outline-none transition focus:border-foreground focus:ring-2 focus:ring-foreground/15",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/15",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);
