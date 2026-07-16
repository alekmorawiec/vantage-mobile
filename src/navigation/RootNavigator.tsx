import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../features/auth/AuthContext";
import { AppLoadingScreen } from "../screens/shared/AppLoadingScreen";
import { AuthNavigator } from "./AuthNavigator";
import { navigationTheme } from "./navigationTheme";
import { PatientNavigator } from "./PatientNavigator";
import { ProviderNavigator } from "./ProviderNavigator";

export function RootNavigator() {
  const { appUser, isLoading, signOut } = useAuth();

  if (isLoading) {
    return <AppLoadingScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {!appUser ? (
        <AuthNavigator />
      ) : appUser.role === "provider" ? (
        // TODO(Ticket #004B): Replace metadata-based UI routing with the
        // authoritative database profile and organization membership model.
        <ProviderNavigator onLogout={signOut} user={appUser} />
      ) : (
        <PatientNavigator onLogout={signOut} user={appUser} />
      )}
    </NavigationContainer>
  );
}
