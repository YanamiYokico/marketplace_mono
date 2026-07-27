import { appConfig } from "@/shared/config/app-config";
import { handleUnauthorized } from "@/shared/api/session-storage";
import type { Product } from "@/entities/product";

async function favoritesFetch<T>(
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

export type FavoriteToggleResult = { status: "added" | "removed" };

export type Favorite = {
  id: string;
  productId: string;
  createdAt: string;
  product: Product;
};

export function toggleFavorite(
  token: string,
  productId: string,
): Promise<FavoriteToggleResult> {
  return favoritesFetch<FavoriteToggleResult>(`/favorites/${productId}`, token, {
    method: "POST",
  });
}

export function fetchFavorites(token: string): Promise<Favorite[]> {
  return favoritesFetch<Favorite[]>("/favorites", token);
}
