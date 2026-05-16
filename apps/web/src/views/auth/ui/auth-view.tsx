"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth-by-email";

export function AuthView() {
  const router = useRouter();

  return (
    <main className="flex min-h-[calc(100svh-65px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        <LoginForm
          onSubmit={() => router.push("/")}
          switchHref="/register"
        />
      </div>
    </main>
  );
}
