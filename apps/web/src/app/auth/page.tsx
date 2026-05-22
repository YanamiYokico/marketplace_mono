import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthView } from "@/views/auth";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function AuthPage() {
  return (
    <Suspense>
      <AuthView />
    </Suspense>
  );
}
