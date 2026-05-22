"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginApi, LoginForm } from "@/features/auth-by-email";
import { useSession } from "@/entities/session";

export function AuthView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useSession();
  const [error, setError] = useState<string>();

  const justRegistered = searchParams.get("registered") === "1";

  const handleSubmit = async (credentials: { email: string; password: string }) => {
    setError(undefined);
    try {
      const { accessToken, user } = await loginApi(credentials);
      login(accessToken, user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <main className="flex min-h-[calc(100svh-65px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        {justRegistered && (
          <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Account created! Check your email to verify it, then sign in.
          </p>
        )}
        <LoginForm
          onSubmit={handleSubmit}
          switchHref="/register"
          error={error}
        />
      </div>
    </main>
  );
}
