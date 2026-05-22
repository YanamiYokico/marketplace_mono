import type { User } from "@/entities/user";

export type AuthResponse = {
  accessToken: string;
  user: User;
};
