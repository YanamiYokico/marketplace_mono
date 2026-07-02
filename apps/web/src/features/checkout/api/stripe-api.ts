import { appConfig } from "@/shared/config/app-config";
import { handleUnauthorized } from "@/shared/api/session-storage";

export async function createStripeCheckout(
  token: string,
  orderId: string,
): Promise<{ url: string }> {
  const res = await fetch(
    `${appConfig.apiUrl}/stripe/create-checkout-session/${orderId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (res.status === 401) handleUnauthorized();

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const raw = body?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(raw) ? raw.join(", ") : String(raw));
  }

  return res.json() as Promise<{ url: string }>;
}
