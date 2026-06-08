"use client";

import { useCart } from "@/entities/cart";
import { Image } from "@/shared/ui";

export function OrderSummaryPanel() {
  const { items, totalPrice } = useCart();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-background p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
        Order summary
      </p>

      <div className="flex flex-col divide-y divide-foreground/5">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3 py-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <p className="line-clamp-1 text-sm font-medium">{item.product.name}</p>
              <p className="text-xs text-foreground/50">
                {item.quantity} × ${Number(item.product.price).toFixed(2)}
              </p>
            </div>
            <span className="text-sm font-semibold tabular-nums">
              ${(Number(item.product.price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-foreground/10 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/60">Subtotal</span>
          <span className="font-medium tabular-nums">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">Shipping</span>
          <span className="font-medium">Free</span>
        </div>
        <div className="flex justify-between border-t border-foreground/10 pt-2">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold tabular-nums">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
