"use client";

import { useCallback, useState } from "react";
import { FILTER_SECTIONS, type FilterState } from "../model/filter-config";
import { FilterSection } from "./filter-section";

type SidebarFiltersProps = {
  /** Called with the full selected-state object whenever a checkbox toggles. */
  onChange?: (state: FilterState) => void;
};

export function SidebarFilters({ onChange }: SidebarFiltersProps) {
  const [selected, setSelected] = useState<FilterState>({});

  const toggle = useCallback(
    (key: string, value: string) => {
      const current = selected[key] ?? [];
      const nextValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const next = { ...selected, [key]: nextValues };

      setSelected(next);
      onChange?.(next);
    },
    [onChange, selected],
  );

  return (
    <aside className="sticky top-0 h-fit max-h-screen w-[300px] shrink-0 self-start overflow-y-auto rounded-r-[32px] bg-[#5A8700] p-6">
      <div className="flex flex-col gap-8">
        {FILTER_SECTIONS.map((section) => (
          <FilterSection
            key={section.key}
            title={section.title}
            options={section.options}
            selected={selected[section.key] ?? []}
            onChange={(value) => toggle(section.key, value)}
            defaultExpanded={section.defaultExpanded}
          />
        ))}
      </div>
    </aside>
  );
}
