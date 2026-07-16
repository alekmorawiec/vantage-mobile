import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

import { AuthProvider } from "./src/features/auth/AuthContext";
import { UserProvider } from "./src/features/user/UserContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AuthProvider>
        <UserProvider>
          <RootNavigator />
          <StatusBar style="light" />
        </UserProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
