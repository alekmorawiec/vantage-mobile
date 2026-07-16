import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PatientHomeScreen } from "../screens/patient/PatientHomeScreen";
import { FeaturePlaceholderScreen } from "../screens/shared/FeaturePlaceholderScreen";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import type { AppUser } from "../types/auth";
import type { PatientTabParamList } from "./navigation.types";

type IconName = ComponentProps<typeof Ionicons>["name"];

const Tab = createBottomTabNavigator<PatientTabParamList>();

const tabIcons: Record<
  keyof PatientTabParamList,
  { active: IconName; inactive: IconName }
> = {
  Home: { active: "home", inactive: "home-outline" },
  Progress: { active: "stats-chart", inactive: "stats-chart-outline" },
  CheckIn: { active: "checkbox", inactive: "checkbox-outline" },
  Workouts: { active: "barbell", inactive: "barbell-outline" },
  Resources: { active: "library", inactive: "library-outline" },
};

type PatientNavigatorProps = {
  user: AppUser;
  onLogout: () => void;
};

export function PatientNavigator({ user, onLogout }: PatientNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: styles.scene,
        tabBarAccessibilityLabel: `${
          route.name === "CheckIn" ? "Check-In" : route.name
        } tab`,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            color={color}
            name={
              focused
                ? tabIcons[route.name].active
                : tabIcons[route.name].inactive
            }
            size={size}
          />
        ),
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Home" options={{ title: "Home" }}>
        {() => (
          <SafeAreaView edges={["top", "left", "right"]} style={styles.scene}>
            <PatientHomeScreen onLogout={onLogout} user={user} />
          </SafeAreaView>
        )}
      </Tab.Screen>
      <Tab.Screen name="Progress" options={{ title: "Progress" }}>
        {() => (
          <FeaturePlaceholderScreen
            description="See recovery, outcomes, and performance trends in one understandable view."
            detail="Outcome measure history, VALD trends, and the factors contributing to your Vantage summary."
            eyebrow="Your recovery"
            includeTopInset
            title="Progress"
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="CheckIn" options={{ title: "Check-In" }}>
        {() => (
          <FeaturePlaceholderScreen
            description="Share a quick update on pain, sleep, and changing symptoms with your care team."
            detail="A focused daily check-in designed to take about 60 seconds."
            eyebrow="Daily update"
            includeTopInset
            title="Check-In"
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Workouts" options={{ title: "Workouts" }}>
        {() => (
          <FeaturePlaceholderScreen
            description="Follow your prescribed home exercise program and record each completed session."
            detail="Exercise instructions, dosage, completion tracking, and additional activity logs."
            eyebrow="Your program"
            includeTopInset
            title="Workouts"
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Resources" options={{ title: "Resources" }}>
        {() => (
          <FeaturePlaceholderScreen
            description="Find the education and recovery resources assigned by your clinic."
            detail="Clinic videos, documents, and articles organized around your care plan."
            eyebrow="Learn and prepare"
            includeTopInset
            title="Resources"
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingTop: spacing.xs,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "800",
  },
});
