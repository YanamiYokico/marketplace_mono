"use client";

import type { Product } from "@/entities/product";
import { Image } from "@/shared/ui";
import { AddToCartButton } from "@/features/cart";

type ProductCardProps = {
  product: Product;
  isOwner?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
};

export function ProductCard({ product, isOwner, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/[0.04]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground/90">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold tabular-nums tracking-tight">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.rating !== null && product.rating !== undefined ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
              <span aria-hidden>★</span>
              {Number(product.rating).toFixed(1)}
            </span>
          ) : (
            <span className="text-xs text-foreground/40">No rating</span>
          )}
        </div>
        {isOwner ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(product)}
              className="flex h-9 flex-1 items-center justify-center rounded-lg border border-foreground/20 text-sm font-semibold transition hover:border-blue-500 hover:text-blue-500"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(product)}
              className="flex h-9 flex-1 items-center justify-center rounded-lg border border-foreground/20 text-sm font-semibold transition hover:border-red-500 hover:text-red-500"
            >
              Delete
            </button>
          </div>
        ) : (
          <AddToCartButton product={product} className="mt-3 w-full justify-center" />
        )}
      </div>
    </div>
  );
}
