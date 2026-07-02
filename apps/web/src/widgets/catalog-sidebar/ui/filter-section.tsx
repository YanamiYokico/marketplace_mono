"use client";

import { useState } from "react";
import { cn } from "@/shared/lib";
import { CheckboxList } from "./checkbox-list";

export type FilterSectionProps = {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
  defaultExpanded?: boolean;
};

export function FilterSection({
  title,
  options,
  selected,
  onChange,
  defaultExpanded,
}: FilterSectionProps) {
  const [expanded, setExpanded] = useState(!!defaultExpanded);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200",
            expanded && "rotate-90",
          )}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span className="text-[22px] font-medium leading-none">{title}</span>
      </button>

      {/* Smooth height animation via CSS grid rows (0fr -> 1fr). */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <CheckboxList options={options} selected={selected} onToggle={onChange} />
        </div>
      </div>
    </div>
  );
}
