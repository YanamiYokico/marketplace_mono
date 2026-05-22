import { apiFetch } from "@/shared/api";
import type { AuthResponse } from "@/entities/session";
import type { LoginCredentials } from "@/entities/user";

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}
