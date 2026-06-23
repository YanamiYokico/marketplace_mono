"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { cn } from "@/shared/lib";

const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-lg px-5 text-[15px] font-semibold transition";

export function HomeView() {
  const router = useRouter();
  const { user, hydrated } = useSession();

  useEffect(() => {
    if (hydrated && user) router.replace("/dashboard");
  }, [hydrated, user, router]);

  // Avoid flashing the logged-out CTAs before the session is known / while redirecting.
  if (!hydrated || user) return null;

  return (
    <main className="flex min-h-[calc(100svh-65px)] flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="mt-3 max-w-md text-foreground/65">
          Sign in or create an account to get started.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/auth"
          className={cn(buttonClass, "bg-foreground text-background hover:opacity-90")}
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className={cn(
            buttonClass,
            "border border-foreground/20 hover:bg-foreground/5",
          )}
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
