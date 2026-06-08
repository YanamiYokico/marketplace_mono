"use client";

import { Select } from "@/shared/ui/select";
import type { SortOption } from "../model/use-catalog";

const SORT_OPTIONS = [
  { value: "rating_desc", label: "Rating: high to low" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

type CatalogSortProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export function CatalogSort({ value, onChange }: CatalogSortProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.02] px-3 py-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-foreground/50">Sort</span>
      <Select
        options={SORT_OPTIONS}
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="w-52 border-0 bg-transparent shadow-none"
      />
    </div>
  );
}
