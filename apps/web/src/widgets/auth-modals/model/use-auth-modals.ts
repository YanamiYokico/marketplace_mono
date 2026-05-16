"use client";

import { useContext } from "react";
import { AuthModalsContext } from "./auth-modals-context";

export function useAuthModals() {
  const context = useContext(AuthModalsContext);

  if (!context) {
    throw new Error("useAuthModals must be used within AuthModalsProvider");
  }

  return context;
}
