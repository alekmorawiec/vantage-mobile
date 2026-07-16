import type { Session, User } from "@supabase/supabase-js";
import type { AppUser, UserRole } from "../../types/auth";

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  appUser: AppUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: UserRole) => Promise<{ requiresEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
};
