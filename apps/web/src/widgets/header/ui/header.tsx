"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { useCart } from "@/entities/cart";
import { CartDrawer } from "@/widgets/cart";
import { SearchBar } from "@/features/product-search";
import { Image } from "@/shared/ui";
import { cn } from "@/shared/lib";

const iconButtonClass =
  "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

type HeaderIconLinkProps = {
  href: string;
  label: string;
  src: string;
};

function HeaderIconLink({ href, label, src }: HeaderIconLinkProps) {
  return (
    <Link href={href} aria-label={label} className={iconButtonClass}>
      <Image
        src={src}
        alt=""
        aria-hidden
        className="max-h-7 max-w-8 object-contain"
      />
    </Link>
  );
}

export function Header() {
  const { user, logout, hydrated } = useSession();
  const { totalCount } = useCart();
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/auth");
  };

  return (
    <>
      <header className="relative z-20 bg-[#5A8A02] text-white">
        <div className="mx-auto flex h-[78px] max-w-[1506px] items-center gap-6 px-5 lg:px-0">
          <Link
            href={user ? "/dashboard" : "/"}
            aria-label="Quby home"
            className="flex shrink-0 items-center gap-3"
          >
            <Image
              src="/images/icons/header_quby_mark.svg"
              alt=""
              aria-hidden
              className="h-[63px] w-[53px] object-contain"
            />
            <Image
              src="/images/icons/header_quby_wordmark.svg"
              alt="Quby"
              className="h-[27px] w-[86px] object-contain"
            />
          </Link>

          <SearchBar className="hidden min-w-0 flex-1 lg:flex" />

          <nav
            aria-label="Main navigation"
            className="ml-auto flex items-center gap-3 sm:gap-4"
          >
            <HeaderIconLink
              href="/catalog"
              label="Catalog"
              src="/images/icons/header_catalog_icon.svg"
            />
            <HeaderIconLink
              href="/orders"
              label="My orders"
              src="/images/icons/header_orders_icon.svg"
            />
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className={cn(iconButtonClass, "hidden sm:inline-flex")}
              aria-label="Open cart"
            >
              <Image
                src="/images/icons/header_cart_icon.svg"
                alt=""
                aria-hidden
                className="h-7 w-8 object-contain"
              />
              {totalCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-[#5A8A02]">
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </button>
            <HeaderIconLink
              href="/favorites"
              label="Liked items"
              src="/images/icons/header_like_icon.svg"
            />
            <span className="hidden lg:inline-flex" aria-label="Notifications">
              <Image
                src="/images/icons/header_notifications_icon.svg"
                alt=""
                aria-hidden
                className="h-7 w-7 object-contain"
              />
            </span>
            <span className="hidden xl:inline-flex" aria-label="Comparison">
              <Image
                src="/images/icons/header_comparison_icon.svg"
                alt=""
                aria-hidden
                className="h-7 w-8 object-contain"
              />
            </span>
            <HeaderIconLink
              href="/sales"
              label="Sales"
              src="/images/icons/header_sales_icon.svg"
            />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className={iconButtonClass}
              aria-label="Open account menu"
              aria-expanded={menuOpen}
            >
              <Image
                src="/images/icons/header_menu_icon.svg"
                alt=""
                aria-hidden
                className="h-7 w-8 object-contain"
              />
            </button>
          </nav>
        </div>

        {menuOpen && (
          <div className="absolute right-5 top-[70px] w-52 rounded-b-xl border border-white/20 bg-[#5A8A02] p-3 shadow-xl lg:right-[max(1.25rem,calc((100vw-1506px)/2))]">
            {hydrated && user ? (
              <>
                <p className="px-3 py-2 text-sm text-white/70">{user.name}</p>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                >
                  My store
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </header>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
