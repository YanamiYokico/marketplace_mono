"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { Button } from "@/shared/ui/button";

export function DashboardView() {
  const { user, logout, hydrated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/auth");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <main className="flex min-h-[calc(100svh-65px)] items-center justify-center">
        <p className="text-foreground/50">Loading…</p>
      </main>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">{user.email}</p>
          </div>
          <Button onClick={handleLogout}>Sign out</Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-foreground/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
              Account status
            </p>
            <p className="mt-2 font-medium">
              {user.isEmailVerified ? (
                <span className="text-green-600">Email verified</span>
              ) : (
                <span className="text-amber-600">Email not verified</span>
              )}
            </p>
          </div>
          <div className="rounded-xl border border-foreground/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
              Member since
            </p>
            <p className="mt-2 font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
