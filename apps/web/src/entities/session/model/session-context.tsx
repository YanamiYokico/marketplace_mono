"use client";

import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/entities/user";
import { AUTH_TOKEN_KEY as TOKEN_KEY } from "@/shared/api/session-storage";

export type SessionState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { token: string; user: User };
        setToken(parsed.token);
        setUser(parsed.user);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, user }));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, token, hydrated, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
