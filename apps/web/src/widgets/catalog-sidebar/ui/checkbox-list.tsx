"use client";

import { FilterCheckbox } from "./filter-checkbox";

type CheckboxListProps = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

export function CheckboxList({ options, selected, onToggle }: CheckboxListProps) {
  return (
    <div className="mt-3 flex flex-col gap-3 pl-6">
      {options.map((option) => (
        <FilterCheckbox
          key={option}
          label={option}
          checked={selected.includes(option)}
          onChange={() => onToggle(option)}
        />
      ))}
    </div>
  );
}
