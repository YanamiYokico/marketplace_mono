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
    <Select
      options={SORT_OPTIONS}
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="w-52"
    />
  );
}
