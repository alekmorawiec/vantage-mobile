import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoginScreen } from "../screens/auth/LoginScreen";
import { colors } from "../theme/colors";
import type { AuthStackParamList } from "./navigation.types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

function LoginRoute() {
  return (
    <SafeAreaView style={styles.screen}>
      <LoginScreen />
    </SafeAreaView>
  );
}

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: styles.screen,
        headerShown: false,
      }}
    >
      <Stack.Screen
        component={LoginRoute}
        name="Login"
        options={{ title: "Sign in to Vantage" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
