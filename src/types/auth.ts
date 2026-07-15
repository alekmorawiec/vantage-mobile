export type UserRole = "patient" | "provider";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
