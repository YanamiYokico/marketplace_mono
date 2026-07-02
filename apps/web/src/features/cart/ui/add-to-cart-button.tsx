"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/entities/cart";
import { useSession } from "@/entities/session";
import { Image } from "@/shared/ui";
import type { Product } from "@/entities/product";
import { cn } from "@/shared/lib";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  variant?: "default" | "icon";
};

export function AddToCartButton({
  product,
  className,
  variant = "default",
}: AddToCartButtonProps) {
  const { items, addItem } = useCart();
  const { token } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const inCart = items.some((i) => i.productId === product.id);

  const handleClick = async () => {
    if (!token) {
      router.push("/auth");
      return;
    }
    setPending(true);
    try {
      await addItem(product.id);
    } finally {
      setPending(false);
    }
  };

  const label = !token
    ? "Sign in to add"
    : pending
      ? "Adding…"
      : inCart
        ? "✓ In cart"
        : "+ Add to cart";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label={label}
        title={label}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full transition disabled:opacity-60",
          inCart && token ? "bg-[#5A8A02]" : "hover:bg-black/5",
          className,
        )}
      >
        <Image
          src="/images/icons/cart_icon.svg"
          alt=""
          aria-hidden
          className="h-6 w-6"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition disabled:opacity-60",
        inCart && token
          ? "bg-[#5A8A02] text-white"
          : "border border-foreground/20 hover:border-[#5A8A02] hover:text-[#5A8A02]",
        className,
      )}
    >
      {label}
    </button>
  );
}
