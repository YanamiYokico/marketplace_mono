"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from "../model/verify-email-schema";

type VerifyEmailFormProps = {
  email: string;
  onSubmit?: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
  error?: string;
};

export function VerifyEmailForm({
  email,
  onSubmit,
  onResend,
  error,
}: VerifyEmailFormProps) {
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: "" },
  });

  const onValidSubmit = async ({ code }: VerifyEmailFormValues) => {
    await onSubmit?.(code);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await onResend?.();
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <>
      <p className="mt-2 text-sm opacity-65">
        Enter the 6-digit code sent to{" "}
        <span className="font-medium text-foreground">{email}</span>
      </p>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onValidSubmit)}
        noValidate
      >
        <Input
          label="Verification code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          maxLength={6}
          error={errors.code?.message}
          {...register("code")}
        />
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Verifying…" : "Verify email"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm opacity-75">
        Didn&apos;t receive a code?{" "}
        <button
          type="button"
          className="font-semibold underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleResend}
          disabled={resendCooldown > 0}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
        </button>
      </p>
    </>
  );
}
