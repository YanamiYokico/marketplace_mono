"use client";

import { useCart } from "@/entities/cart";
import { Button } from "@/shared/ui";
import { CheckoutButton } from "@/features/checkout";

export function CartSummary() {
  const { totalCount, totalPrice, clearCart, error, isMutating } = useCart();

  return (
    <div className="flex flex-col gap-3 border-t border-foreground/10 pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-foreground/60">Items</span>
        <span className="font-medium">{totalCount}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <CheckoutButton className="w-full" />
      <Button variant="ghost" onClick={() => void clearCart()} disabled={isMutating}>
        Clear cart
      </Button>
    </div>
  );
}
