"use client";

import { useRouter } from "next/navigation";
import { RegisterForm } from "@/features/register-by-email";

export function RegisterView() {
  const router = useRouter();

  return (
    <main className="flex min-h-[calc(100svh-65px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <RegisterForm
          onSubmit={() => router.push("/auth")}
          switchHref="/auth"
        />
      </div>
    </main>
  );
}
