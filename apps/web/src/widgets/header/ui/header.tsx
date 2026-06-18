"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { useCart } from "@/entities/cart";
import { CartDrawer } from "@/widgets/cart";
import { Image } from "@/shared/ui";
import { cn } from "@/shared/lib";

const navLinkClass =
  "inline-flex h-11 items-center justify-center rounded-lg px-5 text-[15px] font-semibold transition";

export function Header() {
  const { user, logout, hydrated } = useSession();
  const { totalCount } = useCart();
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <>
    <header className="flex items-center justify-between bg-[#5A8A02] px-6 py-4">
      <Link href={user ? "/dashboard" : "/"} aria-label="Marketplace home">
        <Image
          src="/images/header/header_logo.png"
          alt="Marketplace"
          className="h-9 w-auto"
        />
      </Link>
      <nav className="flex items-center gap-2">
        <Link
          href="/catalog"
          className={cn(navLinkClass, "text-white/80 hover:text-white")}
        >
          Catalog
        </Link>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className={cn(navLinkClass, "relative text-white/80 hover:text-white")}
          aria-label="Open cart"
        >
          Cart
          {totalCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#5A8A02]">
              {totalCount > 99 ? "99+" : totalCount}
            </span>
          )}
        </button>

        {!hydrated ? null : user ? (
          <>
            <Link
              href="/orders"
              className={cn(navLinkClass, "text-white/80 hover:text-white")}
            >
              Orders
            </Link>
            <Link
              href="/sales"
              className={cn(navLinkClass, "text-white/80 hover:text-white")}
            >
              Sales
            </Link>
            <Link
              href="/dashboard"
              className={cn(navLinkClass, "text-white/80 hover:text-white")}
            >
              My store
            </Link>
            <span className="text-sm text-white/75">{user.name}</span>
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
    <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
