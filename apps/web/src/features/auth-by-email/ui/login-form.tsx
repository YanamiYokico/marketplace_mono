"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { LoginCredentials } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { loginSchema, type LoginFormValues } from "../model/login-schema";

type LoginFormProps = {
  onSubmit?: (credentials: LoginCredentials) => void;
  onSwitchToRegister?: () => void;
  switchHref?: string;
};

export function LoginForm({
  onSubmit,
  onSwitchToRegister,
  switchHref,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onValidSubmit = (values: LoginFormValues) => {
    onSubmit?.(values);
  };

  return (
    <>
      <p className="mt-2 text-sm opacity-65">
        Sign in to your marketplace account
      </p>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onValidSubmit)}
        noValidate
      >
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
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm opacity-75">
        Don&apos;t have an account?{" "}
        {switchHref ? (
          <Link
            href={switchHref}
            className="font-semibold underline underline-offset-2"
          >
            Create one
          </Link>
        ) : (
          <button
            type="button"
            className="font-semibold underline underline-offset-2"
            onClick={onSwitchToRegister}
          >
            Create one
          </button>
        )}
      </p>
    </>
  );
}
