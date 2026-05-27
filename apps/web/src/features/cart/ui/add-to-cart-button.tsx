"use client";

import { useCart } from "@/entities/cart";
import type { Product } from "@/entities/product";
import { cn } from "@/shared/lib";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
};

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition",
        inCart
          ? "bg-[#5A8A02] text-white"
          : "border border-foreground/20 hover:border-[#5A8A02] hover:text-[#5A8A02]",
        className,
      )}
    >
      {inCart ? "✓ In cart" : "+ Add to cart"}
    </button>
  );
}
