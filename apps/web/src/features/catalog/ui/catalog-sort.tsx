"use client";

import type { SortOption } from "../model/use-catalog";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rating_desc", label: "Best match" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

type CatalogSortProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export function CatalogSort({ value, onChange }: CatalogSortProps) {
  const index = SORT_OPTIONS.findIndex((option) => option.value === value);
  const current = SORT_OPTIONS[index] ?? SORT_OPTIONS[0]!;

  const cycle = () => {
    const next = SORT_OPTIONS[(index + 1) % SORT_OPTIONS.length]!;
    onChange(next.value);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Sorting: ${current.label}. Click to change.`}
      className="inline-flex cursor-pointer items-center gap-2 font-[family-name:var(--font-poppins)]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-5 w-5 shrink-0 text-foreground/70"
      >
        {value === "price_asc" ? (
          <path d="M12 19V5M8 9l4-4 4 4" />
        ) : value === "price_desc" ? (
          <path d="M12 5v14M8 15l4 4 4-4" />
        ) : (
          <>
            <path d="M7 4v16M7 4 4 7M7 4l3 3" />
            <path d="M17 20V4M17 20l-3-3M17 20l3-3" />
          </>
        )}
      </svg>

      <span className="flex w-[100px] flex-col text-left">
        <span className="text-[14px] font-normal leading-none">Sorting</span>
        <span className="mt-0.5 truncate text-[10px] font-light leading-none text-foreground/60">
          {current.label}
        </span>
      </span>
    </button>
  );
}
