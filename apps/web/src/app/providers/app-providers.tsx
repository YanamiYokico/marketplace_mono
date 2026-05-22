"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "@/entities/session";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
