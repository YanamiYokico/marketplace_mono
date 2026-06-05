"use client";

import type { Product } from "@/entities/product";
import { Image } from "@/shared/ui";
import { AddToCartButton } from "@/features/cart";

type ProductCardProps = {
  product: Product;
};

function StarRating({ value }: { value: number }) {
  return (
    <span className="text-amber-400" aria-label={`Rating: ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.round(value) ? "★" : "☆"}</span>
      ))}
      <span className="ml-1 text-xs text-foreground/50">{value.toFixed(1)}</span>
    </span>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-foreground/10 bg-background transition hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-foreground/5">
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-snug">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.rating !== null && product.rating !== undefined ? (
            <StarRating value={Number(product.rating)} />
          ) : (
            <span className="text-xs text-foreground/40">No rating</span>
          )}
        </div>
        <AddToCartButton product={product} className="mt-3 w-full justify-center" />
      </div>
    </div>
  );
}
