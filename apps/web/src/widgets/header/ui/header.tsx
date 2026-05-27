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
    <header className="flex items-center justify-between bg-[#5A8A02] px-6 py-4">
      <Link href={user ? "/dashboard" : "/"} className="text-lg font-bold tracking-tight text-white">
        Marketplace
      </Link>
      <nav className="flex items-center gap-2">
        {user ? (
          <>
            <span className="text-sm text-white/75">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className={cn(navLinkClass, "border border-white/30 text-white hover:bg-white/10")}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth"
              className={cn(navLinkClass, "text-white/80 hover:text-white")}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={cn(navLinkClass, "border border-white/30 text-white hover:bg-white/10")}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
