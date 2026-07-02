import { appConfig } from "@/shared/config/app-config";
import { handleUnauthorized } from "@/shared/api/session-storage";
import type { Store } from "@/entities/store";

async function storesFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${appConfig.apiUrl}${path}`, init);
  if (res.status === 401) handleUnauthorized();
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchMyStore(token: string): Promise<Store | null> {
  const res = await fetch(`${appConfig.apiUrl}/stores/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (res.status === 401) handleUnauthorized();
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export async function createStore(name: string, token: string): Promise<Store> {
  return storesFetch<Store>("/stores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
}
