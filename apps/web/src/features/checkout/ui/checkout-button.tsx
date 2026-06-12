"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/entities/cart";
import { Button } from "@/shared/ui";

export function CheckoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <Button disabled className={className}>
        Checkout
      </Button>
    );
  }

  return (
    <Button onClick={() => router.push("/checkout")} className={className}>
      Checkout
    </Button>
  );
}
