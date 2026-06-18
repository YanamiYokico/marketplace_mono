"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import {
  fetchSellerOrders,
  updateOrderStatus,
  type OrderStatus,
  type SellerOrderItem,
} from "@/features/sales";
import { Image, Select } from "@/shared/ui";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  PAID: "bg-emerald-50 text-emerald-600",
  PROCESSING: "bg-blue-50 text-blue-600",
  SHIPPED: "bg-blue-50 text-blue-600",
  DELIVERED: "bg-emerald-50 text-emerald-600",
  CANCELLED: "bg-red-50 text-red-600",
};

type OrderGroup = {
  order: SellerOrderItem["order"];
  items: SellerOrderItem[];
};

export function SalesView() {
  const router = useRouter();
  const { token, hydrated } = useSession();

  const [items, setItems] = useState<SellerOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      setItems(await fetchSellerOrders(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sales");
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

  const groups = useMemo<OrderGroup[]>(() => {
    const map = new Map<string, OrderGroup>();
    for (const item of items) {
      const group = map.get(item.orderId) ?? { order: item.order, items: [] };
      group.items.push(item);
      map.set(item.orderId, group);
    }
    return Array.from(map.values());
  }, [items]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    if (!token) return;
    setUpdatingId(orderId);
    setError(null);
    try {
      await updateOrderStatus(token, orderId, status);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-bold">Sales</h1>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-foreground/50">Loading sales…</p>
      ) : groups.length === 0 ? (
        <p className="py-16 text-center text-foreground/50">
          No one has bought from your store yet.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map(({ order, items: orderItems }) => {
            const subtotal = orderItems.reduce(
              (sum, i) => sum + Number(i.price) * i.quantity,
              0,
            );
            return (
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
                    <p className="text-xs text-foreground/50">
                      Ship to: {order.shippingAddress}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-col divide-y divide-foreground/5">
                  {orderItems.map((item) => (
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
                  <span className="text-sm text-foreground/60">Your earnings</span>
                  <span className="text-lg font-bold tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground/60">Status</span>
                  <Select
                    options={STATUS_OPTIONS}
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as OrderStatus)
                    }
                    className="h-9 w-44"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
