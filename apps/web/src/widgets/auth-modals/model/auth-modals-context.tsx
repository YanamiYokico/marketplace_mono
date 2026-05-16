"use client";

import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";

export type AuthModalType = "login" | "register" | null;

type AuthModalsContextValue = {
  activeModal: AuthModalType;
  openLogin: () => void;
  openRegister: () => void;
  switchToLogin: () => void;
  switchToRegister: () => void;
  close: () => void;
};

export const AuthModalsContext = createContext<AuthModalsContextValue | null>(
  null,
);

type AuthModalsProviderProps = {
  children: ReactNode;
};

export function AuthModalsProvider({ children }: AuthModalsProviderProps) {
  const [activeModal, setActiveModal] = useState<AuthModalType>(null);

  const openLogin = useCallback(() => setActiveModal("login"), []);
  const openRegister = useCallback(() => setActiveModal("register"), []);
  const close = useCallback(() => setActiveModal(null), []);

  const value = useMemo(
    () => ({
      activeModal,
      openLogin,
      openRegister,
      switchToLogin: openLogin,
      switchToRegister: openRegister,
      close,
    }),
    [activeModal, openLogin, openRegister, close],
  );

  return (
    <AuthModalsContext.Provider value={value}>
      {children}
    </AuthModalsContext.Provider>
  );
}
