import { apiFetch } from "@/shared/api";

type ResendResponse = { message: string };

export async function resendVerificationApi(
  email: string,
): Promise<ResendResponse> {
  return apiFetch<ResendResponse>("/auth/resend-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}
