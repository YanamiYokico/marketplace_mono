"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { cn } from "@/shared/lib";

const navLinkClass =
  "inline-flex h-11 items-center justify-center rounded-lg px-5 text-[15px] font-semibold transition";

export function Header() {
  const { user, logout } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <header className="flex items-center justify-between border-b border-foreground/15 px-6 py-4">
      <Link href={user ? "/dashboard" : "/"} className="text-lg font-bold tracking-tight">
        Marketplace
      </Link>
      <nav className="flex items-center gap-2">
        {user ? (
          <>
            <span className="text-sm text-foreground/60">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className={cn(navLinkClass, "border border-foreground/20 hover:bg-foreground/5")}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth"
              className={cn(navLinkClass, "opacity-75 hover:opacity-100")}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={cn(navLinkClass, "border border-foreground/20 hover:bg-foreground/5")}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
