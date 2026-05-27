"use client";

import { useCart } from "@/entities/cart";
import type { CartItem } from "@/entities/cart";
import { Image } from "@/shared/ui";

type CartItemRowProps = {
  item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-3 py-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
        <Image src={product.imageUrl} alt={product.name} className="h-full w-full" />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-medium leading-snug">{product.name}</p>
        <p className="text-sm font-bold">${(Number(product.price) * quantity).toFixed(2)}</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-foreground/20 text-sm hover:bg-foreground/5"
          >
            −
          </button>
          <span className="min-w-5 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-foreground/20 text-sm hover:bg-foreground/5"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeItem(product.id)}
        className="self-start text-foreground/30 hover:text-red-500 transition"
        aria-label="Remove"
      >
        ✕
      </button>
    </div>
  );
}
