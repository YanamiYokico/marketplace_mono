"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { Image } from "@/shared/ui";
import { ProductList } from "@/features/products";

export function DashboardView() {
  const { user, hydrated } = useSession();
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

  return (
    <main className="mx-auto max-w-379.5 px-6 py-12">
      <div className="overflow-hidden rounded-2xl">
        <Image
          src="/images/banner.png"
          alt="Dashboard banner"
          className="h-auto w-full"
        />
      </div>

      <div className="mt-10">
        <ProductList />
      </div>
    </main>
  );
}
