import { apiFetch } from "@/shared/api";

type VerifyEmailResponse = { message: string };

export async function verifyEmailApi(
  email: string,
  code: string,
): Promise<VerifyEmailResponse> {
  return apiFetch<VerifyEmailResponse>("/auth/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
}
