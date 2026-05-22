import { appConfig } from "@/shared/config/app-config";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${appConfig.apiUrl}${path}`, init);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const raw = body?.message ?? `Request failed (${response.status})`;
    throw new Error(Array.isArray(raw) ? raw.join(", ") : String(raw));
  }

  return response.json() as Promise<T>;
}
