import { appConfig } from "@/shared/config/app-config";
import { handleUnauthorized } from "@/shared/api/session-storage";
import type { Cart } from "../model/types";

async function cartFetch(
  path: string,
  token: string,
  init?: RequestInit & { json?: unknown },
): Promise<Cart> {
  const { json, ...rest } = init ?? {};
  const res = await fetch(`${appConfig.apiUrl}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...rest.headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (res.status === 401) handleUnauthorized();

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const raw = body?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(raw) ? raw.join(", ") : String(raw));
  }

  return res.json() as Promise<Cart>;
}

export function fetchCart(token: string): Promise<Cart> {
  return cartFetch("/cart", token);
}

export function addCartItem(
  token: string,
  productId: string,
  quantity: number,
): Promise<Cart> {
  return cartFetch("/cart/items", token, {
    method: "POST",
    json: { productId, quantity },
  });
}

export function updateCartItem(
  token: string,
  itemId: string,
  quantity: number,
): Promise<Cart> {
  return cartFetch(`/cart/items/${itemId}`, token, {
    method: "PATCH",
    json: { quantity },
  });
}

export function removeCartItem(token: string, itemId: string): Promise<Cart> {
  return cartFetch(`/cart/items/${itemId}`, token, { method: "DELETE" });
}

export function clearCartItems(token: string): Promise<Cart> {
  return cartFetch("/cart", token, { method: "DELETE" });
}
