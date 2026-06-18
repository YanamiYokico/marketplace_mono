import { appConfig } from "@/shared/config/app-config";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type Order = {
  id: string;
  userId: string;
  totalAmount: number | string;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number | string;
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
};

export type OrderWithItems = Order & { items: OrderItem[] };

async function ordersFetch<T>(
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

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const raw = body?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(raw) ? raw.join(", ") : String(raw));
  }

  return res.json() as Promise<T>;
}

export function checkoutOrder(
  token: string,
  shippingAddress: string,
): Promise<Order> {
  return ordersFetch<Order>("/orders/checkout", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shippingAddress }),
  });
}

export function fetchUserOrders(token: string): Promise<OrderWithItems[]> {
  return ordersFetch<OrderWithItems[]>("/orders", token);
}

export function payOrder(token: string, orderId: string): Promise<Order> {
  return ordersFetch<Order>(`/orders/${orderId}/pay`, token, {
    method: "POST",
  });
}

export function cancelOrder(token: string, orderId: string): Promise<Order> {
  return ordersFetch<Order>(`/orders/${orderId}/cancel`, token, {
    method: "POST",
  });
}
