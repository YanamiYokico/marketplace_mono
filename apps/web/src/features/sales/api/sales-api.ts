import { appConfig } from "@/shared/config/app-config";
import { handleUnauthorized } from "@/shared/api/session-storage";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type SellerOrderItem = {
  id: string;
  orderId: string;
  quantity: number;
  price: number | string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
  order: {
    id: string;
    status: OrderStatus;
    shippingAddress: string;
    createdAt: string;
  };
};

async function salesFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${appConfig.apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  if (res.status === 401) handleUnauthorized();

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const raw = body?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(raw) ? raw.join(", ") : String(raw));
  }

  return res.json() as Promise<T>;
}

export function fetchSellerOrders(token: string): Promise<SellerOrderItem[]> {
  return salesFetch<SellerOrderItem[]>("/seller/orders", token);
}

export function updateOrderStatus(
  token: string,
  orderId: string,
  status: OrderStatus,
): Promise<unknown> {
  return salesFetch(`/seller/orders/${orderId}/status`, token, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
