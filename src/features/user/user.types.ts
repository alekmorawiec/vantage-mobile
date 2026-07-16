export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

export type OrganizationRole = "admin" | "provider" | "staff";
export type MembershipStatus = "invited" | "active" | "disabled";

export type OrganizationMembership = {
  id: string;
  organization_id: string;
  profile_id: string;
  role: OrganizationRole;
  status: MembershipStatus;
  created_at: string;
  updated_at: string;
};

export type PatientStatus = "active" | "inactive" | "discharged";

export type Patient = {
  id: string;
  profile_id: string;
  organization_id: string | null;
  clinic_id: string | null;
  status: PatientStatus;
  created_at: string;
  updated_at: string;
};

export type UserContextValue = {
  profile: Profile | null;
  memberships: OrganizationMembership[];
  patient: Patient | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};
