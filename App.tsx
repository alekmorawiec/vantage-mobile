import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useState } from "react";

import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { PatientHomeScreen } from "./src/screens/patient/PatientHomeScreen";
import { ProviderHomeScreen } from "./src/screens/provider/ProviderHomeScreen";
import { colors } from "./src/theme/colors";
import type { AppUser, UserRole } from "./src/types/auth";

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);

  function handleLogin(role: UserRole) {
    setUser({
      id: role === "patient" ? "demo-patient" : "demo-provider",
      name: role === "patient" ? "Patient A" : "Alek",
      email:
        role === "patient"
          ? "patient@gmail.com"
          : "provider@vantage.com",
      role,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.app}>
        {!user ? (
          <LoginScreen onLogin={handleLogin} />
        ) : user.role === "patient" ? (
          <PatientHomeScreen user={user} onLogout={() => setUser(null)} />
        ) : (
          <ProviderHomeScreen user={user} onLogout={() => setUser(null)} />
        )}
      </View>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
