import type { Session, User } from "@supabase/supabase-js";
import type { UserRole } from "../../types/auth";

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: UserRole) => Promise<{ requiresEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
};
