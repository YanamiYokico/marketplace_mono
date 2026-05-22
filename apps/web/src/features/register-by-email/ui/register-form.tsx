"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { RegisterCredentials } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  registerSchema,
  type RegisterFormValues,
} from "../model/register-schema";

type RegisterFormProps = {
  onSubmit?: (credentials: RegisterCredentials) => Promise<void> | void;
  onSwitchToLogin?: () => void;
  switchHref?: string;
  error?: string;
};

export function RegisterForm({
  onSubmit,
  onSwitchToLogin,
  switchHref,
  error,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onValidSubmit = async (values: RegisterFormValues) => {
    await onSubmit?.(values);
  };

  return (
    <>
      <p className="mt-2 text-sm opacity-65">Create your marketplace account</p>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onValidSubmit)}
        noValidate
      >
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm opacity-75">
        Already have an account?{" "}
        {switchHref ? (
          <Link
            href={switchHref}
            className="font-semibold underline underline-offset-2"
          >
            Sign in
          </Link>
        ) : (
          <button
            type="button"
            className="font-semibold underline underline-offset-2"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        )}
      </p>
    </>
  );
}
