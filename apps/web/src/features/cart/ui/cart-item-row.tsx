"use client";

import { useCart } from "@/entities/cart";
import type { CartItem } from "@/entities/cart";
import { Image } from "@/shared/ui";

type CartItemRowProps = {
  item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem, isMutating } = useCart();
  const { id, product, quantity } = item;

  const decrement = () => {
    if (quantity <= 1) {
      void removeItem(id);
    } else {
      void updateQuantity(id, quantity - 1);
    }
  };

  const increment = () => {
    if (quantity < product.stock) {
      void updateQuantity(id, quantity + 1);
    }
  };

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
            onClick={decrement}
            disabled={isMutating}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-foreground/20 text-sm hover:bg-foreground/5 disabled:opacity-50"
          >
            −
          </button>
          <span className="min-w-5 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={increment}
            disabled={isMutating || quantity >= product.stock}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-foreground/20 text-sm hover:bg-foreground/5 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void removeItem(id)}
        disabled={isMutating}
        className="self-start text-foreground/30 hover:text-red-500 transition disabled:opacity-50"
        aria-label="Remove"
      >
        ✕
      </button>
    </div>
  );
}
