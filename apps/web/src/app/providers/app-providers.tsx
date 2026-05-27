"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "@/entities/session";
import { CartProvider } from "@/entities/cart";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
