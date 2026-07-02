"use client";

import Link from "next/link";
import type { Product } from "@/entities/product";
import { Image } from "@/shared/ui";
import { AddToCartButton } from "@/features/cart";

type ProductCardProps = {
  product: Product;
  isOwner?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
};

function StarRating({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <div
      className="flex items-center justify-center gap-1 text-[16px]"
      aria-label={`Rating: ${value} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? "text-[#5A8A02]" : "text-black/20"}>
          ★
        </span>
      ))}
      <span className="ml-1 text-sm font-medium text-[#5A8A02]">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export function ProductCard({ product, isOwner, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="flex h-[521px] w-full max-w-[361px] flex-col rounded-2xl bg-[#C5DD98] font-[family-name:var(--font-poppins)] transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Image 327px tall (width fills card minus margins); like icon pinned bottom-right */}
      <div className="relative" style={{ margin: "32px 38px 14px 32px" }}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="h-[327px] w-full rounded-xl bg-black/[0.04] object-cover"
        />
        <button
          type="button"
          aria-label="Add to favorites"
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 transition hover:bg-white"
        >
          <Image
            src="/images/icons/like_icon.svg"
            alt=""
            aria-hidden
            className="h-5 w-5"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
        <div className="flex h-[60px] items-center justify-center">
          <h3 className="line-clamp-2 text-center text-[20px] font-normal leading-none text-black/90">
            {product.name}
          </h3>
        </div>

        <StarRating value={Number(product.rating ?? 0)} />

        <div className="mt-1 flex items-center justify-between gap-[18px]">
          <span className="text-lg font-bold tabular-nums text-black/90">
            ${Number(product.price).toFixed(2)}
          </span>
          {isOwner ? (
            onEdit || onDelete ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit?.(product)}
                aria-label="Edit product"
                title="Edit"
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/10 hover:text-blue-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(product)}
                aria-label="Delete product"
                title="Delete"
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/10 hover:text-red-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                  <path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
            ) : (
              <Link
                href="/dashboard"
                className="rounded-full bg-black/10 px-3 py-1.5 text-xs font-medium text-black/70 transition hover:bg-black/20"
              >
                Manage
              </Link>
            )
          ) : (
            <AddToCartButton product={product} variant="icon" />
          )}
        </div>
      </div>
    </div>
  );
}
