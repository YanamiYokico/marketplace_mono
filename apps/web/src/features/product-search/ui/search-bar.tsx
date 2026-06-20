"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib";

type SearchBarProps = {
  className?: string;
};

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex h-11 items-center gap-2 rounded-full bg-[#5A8A02] pl-4 pr-1 transition-colors hover:bg-[#6BA003] focus-within:bg-[#6BA003]",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-5 w-5 shrink-0 text-white"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>

      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        aria-label="Search products"
        className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/90 [&::-webkit-search-cancel-button]:appearance-none"
      />

      <button
        type="submit"
        className="h-9 shrink-0 rounded-full bg-[#D4C4A0] px-5 text-[13px] font-semibold text-[#1f2a10] transition-colors hover:bg-[#DFCFA5]"
      >
        Find
      </button>
    </form>
  );
}
