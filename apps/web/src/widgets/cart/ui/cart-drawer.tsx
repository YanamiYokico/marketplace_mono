"use client";

import { useCart } from "@/entities/cart";
import { CartItemRow, CartSummary } from "@/features/cart";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, isLoading, isAuthenticated } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
          <h2 className="text-lg font-bold">Cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-foreground/40 hover:text-foreground transition"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {!isAuthenticated ? (
            <p className="py-16 text-center text-sm text-foreground/40">
              Sign in to use your cart.
            </p>
          ) : isLoading && items.length === 0 ? (
            <p className="py-16 text-center text-sm text-foreground/40">
              Loading cart…
            </p>
          ) : items.length === 0 ? (
            <p className="py-16 text-center text-sm text-foreground/40">
              Your cart is empty.
            </p>
          ) : (
            <div className="divide-y divide-foreground/10">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-foreground/10 px-5 py-4">
            <CartSummary />
          </div>
        )}
      </aside>
    </>
  );
}
