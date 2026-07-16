import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../auth/AuthContext";
import type {
  OrganizationMembership,
  Patient,
  Profile,
  UserContextValue,
} from "./user.types";

const UserContext = createContext<UserContextValue | undefined>(undefined);

const profileColumns = "id,email,display_name,created_at,updated_at";
const membershipColumns =
  "id,organization_id,profile_id,role,status,created_at,updated_at";
const patientColumns =
  "id,profile_id,organization_id,clinic_id,status,created_at,updated_at";

export function UserProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const loadUserData = useCallback(async () => {
    const userId = user?.id;
    const currentRequestId = ++requestId.current;

    if (!userId) {
      setProfile(null);
      setMemberships([]);
      setPatient(null);
      setError(null);
      setLoadedUserId(null);
      setIsRefreshing(false);
      return;
    }

    setIsRefreshing(true);
    setError(null);

    try {
      const [profileResult, membershipsResult, patientResult] =
        await Promise.all([
          supabase
            .from("profiles")
            .select(profileColumns)
            .eq("id", userId)
            .maybeSingle<Profile>(),
          supabase
            .from("organization_memberships")
            .select(membershipColumns)
            .eq("profile_id", userId)
            .returns<OrganizationMembership[]>(),
          supabase
            .from("patients")
            .select(patientColumns)
            .eq("profile_id", userId)
            .maybeSingle<Patient>(),
        ]);

      if (currentRequestId !== requestId.current) {
        return;
      }

      const queryError =
        profileResult.error ?? membershipsResult.error ?? patientResult.error;

      if (queryError) {
        throw queryError;
      }

      setProfile(profileResult.data);
      setMemberships(membershipsResult.data ?? []);
      setPatient(patientResult.data);
    } catch (loadError: unknown) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      console.error(
        "Unable to load the authenticated Vantage user:",
        loadError instanceof Error ? loadError.message : loadError,
      );
      setProfile(null);
      setMemberships([]);
      setPatient(null);
      setError(
        "We could not load your Vantage account. Check your connection and try again.",
      );
    } finally {
      if (currentRequestId === requestId.current) {
        setLoadedUserId(userId);
        setIsRefreshing(false);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    void loadUserData();

    return () => {
      requestId.current += 1;
    };
  }, [loadUserData]);

  const value = useMemo<UserContextValue>(
    () => ({
      profile,
      memberships,
      patient,
      loading: user ? loadedUserId !== user.id || isRefreshing : false,
      error,
      refresh: loadUserData,
    }),
    [
      error,
      isRefreshing,
      loadUserData,
      loadedUserId,
      memberships,
      patient,
      profile,
      user,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider.");
  }

  return context;
}
