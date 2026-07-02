"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/entities/session";
import {
  cancelOrder,
  createStripeCheckout,
  fetchUserOrders,
  type OrderStatus,
  type OrderWithItems,
} from "@/features/checkout";
import { Button, Image } from "@/shared/ui";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  PAID: "bg-emerald-50 text-emerald-600",
  PROCESSING: "bg-blue-50 text-blue-600",
  SHIPPED: "bg-blue-50 text-blue-600",
  DELIVERED: "bg-emerald-50 text-emerald-600",
  CANCELLED: "bg-red-50 text-red-600",
};

export function OrdersView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");
  const { token, hydrated } = useSession();

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      setOrders(await fetchUserOrders(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/auth");
      return;
    }
    void load();
  }, [hydrated, token, router, load]);

  const handlePay = async (orderId: string) => {
    if (!token) return;
    setPayingId(orderId);
    setError(null);
    try {
      // Redirect to Stripe-hosted Checkout; Stripe returns to /orders?payment=...
      const { url } = await createStripeCheckout(token, orderId);
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start payment");
      setPayingId(null);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!token) return;
    if (!confirm("Cancel this order? The reserved stock will be released.")) {
      return;
    }
    setCancellingId(orderId);
    setError(null);
    try {
      await cancelOrder(token, orderId);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-bold">My orders</h1>

      {payment === "success" && (
        <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✓ Payment successful — your order will be marked as paid shortly.
        </p>
      )}
      {payment === "canceled" && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Payment was canceled. You can try paying again.
        </p>
      )}

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-foreground/50">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-foreground/50">You have no orders yet.</p>
          <Button onClick={() => router.push("/catalog")}>Browse catalog</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-background p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-xs text-foreground/50">#{order.id}</p>
                  <p className="text-xs text-foreground/50">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex flex-col divide-y divide-foreground/5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="line-clamp-1 text-sm font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-foreground/10 pt-4">
                <span className="text-sm text-foreground/60">Total</span>
                <span className="text-lg font-bold tabular-nums">
                  ${Number(order.totalAmount).toFixed(2)}
                </span>
              </div>

              {(order.status === "PENDING" || order.status === "PAID") && (
                <div className="flex gap-2">
                  {order.status === "PENDING" && (
                    <Button
                      className="flex-1"
                      disabled={payingId === order.id || cancellingId === order.id}
                      onClick={() => handlePay(order.id)}
                    >
                      {payingId === order.id ? "Paying…" : "Pay now"}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="flex-1"
                    disabled={cancellingId === order.id || payingId === order.id}
                    onClick={() => handleCancel(order.id)}
                  >
                    {cancellingId === order.id ? "Cancelling…" : "Cancel order"}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
