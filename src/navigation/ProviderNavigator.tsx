import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProviderHomeScreen } from "../screens/provider/ProviderHomeScreen";
import { FeaturePlaceholderScreen } from "../screens/shared/FeaturePlaceholderScreen";
import { colors } from "../theme/colors";
import type { AppUser } from "../types/auth";
import type { ProviderStackParamList } from "./navigation.types";

const Stack = createNativeStackNavigator<ProviderStackParamList>();

type ProviderNavigatorProps = {
  user: AppUser;
  onLogout: () => void;
};

function CaseloadScreen() {
  return (
    <FeaturePlaceholderScreen
      description="Review your assigned patients and quickly identify who needs attention."
      detail="Search, adherence status, symptom alerts, and patient-level workflow entry points."
      eyebrow="Provider workspace"
      title="Caseload"
    />
  );
}

function PatientDetailScreen({
  route,
}: NativeStackScreenProps<ProviderStackParamList, "PatientDetail">) {
  return (
    <FeaturePlaceholderScreen
      description="Inspect the clinical and engagement information available for this assigned patient."
      detail={`Patient ID: ${route.params.patientId}. Future work will add check-ins, adherence, outcomes, and VALD trends without introducing mock queries here.`}
      eyebrow="Assigned patient"
      title="Patient Detail"
    />
  );
}

function ProviderResourcesScreen() {
  return (
    <FeaturePlaceholderScreen
      description="Organize clinic education and assign relevant resources to patients."
      detail="Resource library browsing and trusted patient assignment workflows."
      eyebrow="Clinic library"
      title="Resources"
    />
  );
}

export function ProviderNavigator({ user, onLogout }: ProviderNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName="ProviderDashboard"
      screenOptions={{
        animation: "fade",
        contentStyle: styles.scene,
        headerBackTitle: "Back",
        headerStyle: styles.header,
        headerTintColor: colors.text,
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Stack.Screen
        name="ProviderDashboard"
        options={{ headerShown: false, title: "Provider Dashboard" }}
      >
        {() => (
          <SafeAreaView edges={["top", "left", "right"]} style={styles.scene}>
            <ProviderHomeScreen onLogout={onLogout} user={user} />
          </SafeAreaView>
        )}
      </Stack.Screen>
      <Stack.Screen
        component={CaseloadScreen}
        name="Caseload"
        options={{ title: "Caseload" }}
      />
      <Stack.Screen
        component={PatientDetailScreen}
        name="PatientDetail"
        options={{ title: "Patient Detail" }}
      />
      <Stack.Screen
        component={ProviderResourcesScreen}
        name="ProviderResources"
        options={{ title: "Resources" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: colors.text,
    fontWeight: "900",
  },
});
