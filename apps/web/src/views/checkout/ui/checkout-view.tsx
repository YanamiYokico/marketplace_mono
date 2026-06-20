"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/entities/cart";
import { useSession } from "@/entities/session";
import { OrderSummaryPanel, checkoutOrder } from "@/features/checkout";
import { Button, Image } from "@/shared/ui";

type Shipping = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export function CheckoutView() {
  const router = useRouter();
  const { token, hydrated } = useSession();
  const { items, isLoading, isAuthenticated, refresh } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shipping, setShipping] = useState<Shipping>({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Require auth: redirect logged-out visitors to sign in.
  useEffect(() => {
    if (hydrated && !token) router.replace("/auth");
  }, [hydrated, token, router]);

  // Guard direct hits with an empty cart (but not on the confirmation step).
  useEffect(() => {
    if (isAuthenticated && !isLoading && items.length === 0 && step !== 3) {
      router.replace("/catalog");
    }
  }, [isAuthenticated, isLoading, items.length, step, router]);

  const inputClass =
    "h-10 rounded-lg border border-foreground/15 bg-background px-3 text-sm focus:border-foreground/40 focus:outline-none";

  const placeOrder = async () => {
    if (
      !shipping.fullName.trim() ||
      !shipping.address.trim() ||
      !shipping.city.trim() ||
      !shipping.postalCode.trim() ||
      !shipping.country.trim()
    )
      return;
    if (!token) return;

    const shippingAddress = `${shipping.fullName}, ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}`;

    setIsPlacingOrder(true);
    setError(null);
    try {
      const order = await checkoutOrder(token, shippingAddress);
      setOrderId(order.id);
      await refresh(); // backend cleared the cart; sync local state + header badge
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex gap-8">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex items-center gap-2 text-xs">
            {["Review", "Shipping", "Confirmation"].map((label, i) => {
              const n = (i + 1) as 1 | 2 | 3;
              const active = n === step;
              return (
                <span
                  key={label}
                  className={
                    active
                      ? "rounded-full bg-foreground px-3 py-1 font-semibold text-background"
                      : "rounded-full border border-foreground/20 px-3 py-1 text-foreground/60"
                  }
                >
                  {n}. {label}
                </span>
              );
            })}
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col divide-y divide-foreground/5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="line-clamp-1 text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-foreground/50">Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="w-fit"
                disabled={items.length === 0}
                onClick={() => setStep(2)}
              >
                Continue to shipping
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <input
                  className={`col-span-3 ${inputClass}`}
                  placeholder="Full name"
                  value={shipping.fullName}
                  onChange={(e) => setShipping((p) => ({ ...p, fullName: e.target.value }))}
                />
                <input
                  className={`col-span-3 ${inputClass}`}
                  placeholder="Address"
                  value={shipping.address}
                  onChange={(e) => setShipping((p) => ({ ...p, address: e.target.value }))}
                />
                <input
                  className={inputClass}
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => setShipping((p) => ({ ...p, city: e.target.value }))}
                />
                <input
                  className={inputClass}
                  placeholder="Postal code"
                  value={shipping.postalCode}
                  onChange={(e) => setShipping((p) => ({ ...p, postalCode: e.target.value }))}
                />
                <input
                  className={inputClass}
                  placeholder="Country"
                  value={shipping.country}
                  onChange={(e) => setShipping((p) => ({ ...p, country: e.target.value }))}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button disabled={isPlacingOrder} onClick={placeOrder}>
                  {isPlacingOrder ? "Placing order…" : "Place order"}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
                ✓
              </div>
              <h2 className="text-xl font-bold">Order placed</h2>
              <p className="text-sm text-foreground/60">
                Thanks — your order has been placed successfully.
              </p>
              {orderId && <p className="font-mono text-sm">Order #{orderId}</p>}
              <div className="flex items-center gap-3">
                <Button onClick={() => router.push("/orders")}>View my orders</Button>
                <Button variant="ghost" onClick={() => router.push("/catalog")}>
                  Continue shopping
                </Button>
              </div>
            </div>
          )}
        </div>

        {step !== 3 && (
          <div className="w-80 shrink-0">
            <OrderSummaryPanel />
          </div>
        )}
      </div>
    </main>
  );
}
