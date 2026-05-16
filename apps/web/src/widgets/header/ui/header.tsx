import Link from "next/link";
import { cn } from "@/shared/lib";

const navLinkClass =
  "inline-flex h-11 items-center justify-center rounded-lg px-5 text-[15px] font-semibold transition";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-foreground/15 px-6 py-4">
      <Link href="/" className="text-lg font-bold tracking-tight">
        Marketplace
      </Link>
      <nav className="flex items-center gap-2">
        <Link
          href="/auth"
          className={cn(navLinkClass, "opacity-75 hover:opacity-100")}
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className={cn(
            navLinkClass,
            "border border-foreground/20 hover:bg-foreground/5",
          )}
        >
          Register
        </Link>
      </nav>
    </header>
  );
}
