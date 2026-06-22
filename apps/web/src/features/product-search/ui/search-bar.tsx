"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Image } from "@/shared/ui";
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
        "flex h-11 items-center gap-2 rounded-full border border-[#8AA64C] bg-[#6B8E3A] pl-4 pr-1 transition-colors hover:bg-[#7A9B3D] focus-within:bg-[#7A9B3D]",
        className,
      )}
    >
      <Image
        src="/images/icons/search_btn.png"
        alt=""
        aria-hidden
        className="shrink-0"
      />

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
        className="h-9 shrink-0 rounded-full bg-[#C5DD98] px-5 text-[13px] font-semibold text-[#1f2a10] transition-colors hover:bg-[#DFCFA5]"
      >
        Find
      </button>
    </form>
  );
}
