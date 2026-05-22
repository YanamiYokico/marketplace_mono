import { apiFetch } from "@/shared/api";
import type { RegisterCredentials } from "@/entities/user";

type RegisterResponse = {
  message: string;
};

export async function registerApi(
  credentials: Omit<RegisterCredentials, "confirmPassword">,
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}
