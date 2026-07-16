import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";

import { AuthProvider, useAuth } from "./src/features/auth/AuthContext";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { PatientHomeScreen } from "./src/screens/patient/PatientHomeScreen";
import { ProviderHomeScreen } from "./src/screens/provider/ProviderHomeScreen";
import { colors } from "./src/theme/colors";

function AppContent() {
  const { appUser, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!appUser) return <LoginScreen />;

  return appUser.role === "provider" ? (
    <ProviderHomeScreen user={appUser} onLogout={signOut} />
  ) : (
    <PatientHomeScreen user={appUser} onLogout={signOut} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.app}>
          <AppContent />
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  app: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
});
