import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../features/auth/AuthContext";
import { useUser } from "../features/user/UserContext";
import type { Profile } from "../features/user/user.types";
import { AccountSetupRequiredScreen } from "../screens/shared/AccountSetupRequiredScreen";
import { AppLoadingScreen } from "../screens/shared/AppLoadingScreen";
import { UserDataErrorScreen } from "../screens/shared/UserDataErrorScreen";
import type { AppUser, UserRole } from "../types/auth";
import { AuthNavigator } from "./AuthNavigator";
import { navigationTheme } from "./navigationTheme";
import { PatientNavigator } from "./PatientNavigator";
import { ProviderNavigator } from "./ProviderNavigator";

function toAppUser(profile: Profile, role: UserRole): AppUser {
  return {
    id: profile.id,
    email: profile.email,
    name:
      profile.display_name?.trim() ||
      (role === "provider" ? "Provider" : "Patient"),
    role,
  };
}

export function RootNavigator() {
  const { isLoading: authLoading, signOut, user } = useAuth();
  const { error, loading: userLoading, memberships, patient, profile, refresh } =
    useUser();

  if (authLoading) {
    return <AppLoadingScreen />;
  }

  if (user && userLoading) {
    return <AppLoadingScreen />;
  }

  const activeMemberships = memberships.filter(
    (membership) => membership.status === "active",
  );
  const providerMemberships = activeMemberships.filter(
    (membership) => membership.role === "provider",
  );

  // TODO(invite acceptance): Surface pending invitations and refresh this data
  // after a trusted server-side invite acceptance workflow is implemented.
  const hasPendingInvitation = memberships.some(
    (membership) => membership.status === "invited",
  );

  // TODO(multi-role selection): Let users choose an organization and supported
  // role when more than one active access path is available.
  const providerUser =
    profile && providerMemberships.length > 0
      ? toAppUser(profile, "provider")
      : null;
  const patientUser =
    profile && patient ? toAppUser(profile, "patient") : null;

  return (
    <NavigationContainer theme={navigationTheme}>
      {!user ? (
        <AuthNavigator />
      ) : error ? (
        <UserDataErrorScreen
          message={error}
          onLogout={signOut}
          onRetry={() => void refresh()}
        />
      ) : providerUser ? (
        <ProviderNavigator onLogout={signOut} user={providerUser} />
      ) : patientUser ? (
        <PatientNavigator onLogout={signOut} user={patientUser} />
      ) : (
        <AccountSetupRequiredScreen
          message={
            !profile
              ? "Your authenticated account does not have a Vantage profile yet."
              : hasPendingInvitation
                ? "Your clinic invitation is waiting to be accepted."
                : activeMemberships.length > 0
                  ? "Your current organization role does not have a mobile workspace yet."
                  : "Your account does not have an active patient or provider workspace yet."
          }
          onLogout={signOut}
          onRefresh={() => void refresh()}
        />
      )}
    </NavigationContainer>
  );
}
