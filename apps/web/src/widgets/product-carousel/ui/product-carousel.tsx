"use client";

import { useRef } from "react";
import type { Product } from "@/entities/product";
import { ProductCard } from "@/features/products/ui/product-card";

type ProductCarouselProps = {
  title: string;
  products: Product[];
  isLoading?: boolean;
};

export function ProductCarousel({ title, products, isLoading }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    // Scroll roughly one card (card max-width + gap) per click.
    trackRef.current?.scrollBy({ left: direction * 385, behavior: "smooth" });
  };

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-[28px] font-normal font-[family-name:var(--font-poppins)]">
          {title}
        </h2>

        <div className="flex shrink-0 items-center gap-2">
          <CarouselArrow direction="left" onClick={() => scrollBy(-1)} />
          <CarouselArrow direction="right" onClick={() => scrollBy(1)} />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-foreground/50">Loading…</p>
      ) : (
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[361px] shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background transition hover:border-[#5A8A02] hover:text-[#5A8A02]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-5 w-5"
      >
        <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );
}
