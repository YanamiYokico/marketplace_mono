"use client";

import { useState } from "react";
import type { Category } from "@/entities/category";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import type { CatalogFilters } from "../model/use-catalog";

type CatalogFiltersProps = {
  categories: Category[];
  filters: CatalogFilters;
  onApply: (filters: CatalogFilters) => void;
};

export function CatalogFiltersPanel({ categories, filters, onApply }: CatalogFiltersProps) {
  const [local, setLocal] = useState<CatalogFilters>(filters);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const handleReset = () => {
    const empty: CatalogFilters = { categoryId: "", minPrice: "", maxPrice: "" };
    setLocal(empty);
    onApply(empty);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">Filters</p>
        <span className="h-1 w-1 rounded-full bg-foreground/30" aria-hidden />
      </div>

      <Select
        label="Category"
        options={categoryOptions}
        placeholder="All categories"
        value={local.categoryId}
        onChange={(e) => setLocal((p) => ({ ...p, categoryId: e.target.value }))}
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">Price range</p>
          <span className="text-[10px] text-foreground/40">USD</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            label="From"
            type="number"
            min="0"
            placeholder="0"
            value={local.minPrice}
            onChange={(e) => setLocal((p) => ({ ...p, minPrice: e.target.value }))}
          />
          <Input
            label="To"
            type="number"
            min="0"
            placeholder="∞"
            value={local.maxPrice}
            onChange={(e) => setLocal((p) => ({ ...p, maxPrice: e.target.value }))}
          />
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <Button onClick={() => onApply(local)} className="w-full">Apply</Button>
        <Button variant="ghost" onClick={handleReset} className="w-full">Reset</Button>
      </div>
    </div>
  );
}
