"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  verifyEmailApi,
  resendVerificationApi,
  VerifyEmailForm,
} from "@/features/verify-email";

export function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [error, setError] = useState<string>();
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!email) {
    router.replace("/register");
    return null;
  }

  const handleSubmit = async (code: string) => {
    setError(undefined);
    try {
      await verifyEmailApi(email, code);
      router.push("/auth?verified=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleResend = async () => {
    setResendSuccess(false);
    try {
      await resendVerificationApi(email);
      setResendSuccess(true);
    } catch {
      // silently ignore — backend always returns the same message
    }
  };

  return (
    <main className="flex min-h-[calc(100svh-65px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
        {resendSuccess && (
          <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            A new code has been sent to your email.
          </p>
        )}
        <VerifyEmailForm
          email={email}
          onSubmit={handleSubmit}
          onResend={handleResend}
          error={error}
        />
      </div>
    </main>
  );
}
