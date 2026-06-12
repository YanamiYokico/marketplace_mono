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

export async function checkoutOrder(
  token: string,
  shippingAddress: string,
): Promise<Order> {
  const res = await fetch(`${appConfig.apiUrl}/orders/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shippingAddress }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const raw = body?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(raw) ? raw.join(", ") : String(raw));
  }

  return res.json() as Promise<Order>;
}
