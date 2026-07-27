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
        "flex h-[31px] items-center gap-2 rounded-full border border-white bg-transparent pl-2 font-[family-name:var(--font-poppins)] focus-within:bg-white/10",
        className,
      )}
    >
      <Image
        src="/images/icons/search_btn.png"
        alt=""
        aria-hidden
        className="h-4 w-4 shrink-0 object-contain"
      />

      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        aria-label="Search products"
        className="h-full min-w-0 flex-1 bg-transparent text-[18px] font-normal text-white outline-none placeholder:text-white [&::-webkit-search-cancel-button]:appearance-none"
      />

      <button
        type="submit"
        className="h-[29px] w-[77px] shrink-0 rounded-full bg-[#C5DD98] text-[16px] font-normal text-black transition-colors hover:bg-[#d5e9b1]"
      >
        Find
      </button>
    </form>
  );
}
