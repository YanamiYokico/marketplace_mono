import { appConfig } from "@/shared/config/app-config";
import { handleUnauthorized } from "@/shared/api/session-storage";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${appConfig.apiUrl}${path}`, init);

  if (response.status === 401) handleUnauthorized();

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const raw = body?.message ?? `Request failed (${response.status})`;
    throw new Error(Array.isArray(raw) ? raw.join(", ") : String(raw));
  }

  return response.json() as Promise<T>;
}
