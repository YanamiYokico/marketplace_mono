"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm, registerApi } from "@/features/register-by-email";
import type { RegisterCredentials } from "@/entities/user";

export function RegisterView() {
  const router = useRouter();
  const [error, setError] = useState<string>();

  const handleSubmit = async ({ name, email, password }: RegisterCredentials) => {
    setError(undefined);
    try {
      await registerApi({ name, email, password });
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <main className="flex min-h-[calc(100svh-65px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <RegisterForm
          onSubmit={handleSubmit}
          switchHref="/auth"
          error={error}
        />
      </div>
    </main>
  );
}
