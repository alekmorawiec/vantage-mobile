import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { BrandMark } from "../../components/BrandMark";
import { colors } from "../../theme/colors";
import { radii } from "../../theme/radii";
import { spacing } from "../../theme/spacing";
import type { UserRole } from "../../types/auth";

type LoginScreenProps = {
  onLogin: (role: UserRole) => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [role, setRole] = useState<UserRole>("patient");
  const [email, setEmail] = useState("patient@gmail.com");
  const [password, setPassword] = useState("demo123");

  function changeRole(nextRole: UserRole) {
    setRole(nextRole);
    setEmail(
      nextRole === "patient"
        ? "patient@gmail.com"
        : "provider@vantage.com",
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <BrandMark />
          <View>
            <Text style={styles.brand}>VANTAGE</Text>
            <Text style={styles.brandSubtitle}>
              Physical therapy + performance
            </Text>
          </View>
        </View>

        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>
          Track recovery, performance, and readiness in one place.
        </Text>

        <View style={styles.roleSwitch}>
          <AppButton
            label="Patient"
            variant={role === "patient" ? "primary" : "ghost"}
            onPress={() => changeRole("patient")}
            style={styles.roleButton}
          />
          <AppButton
            label="Provider"
            variant={role === "provider" ? "primary" : "ghost"}
            onPress={() => changeRole("provider")}
            style={styles.roleButton}
          />
        </View>

        <View style={styles.form}>
          <AppInput
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <AppInput
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <AppButton label="Log in" onPress={() => onLogin(role)} />
        </View>

        <Text style={styles.demo}>
          Feasibility demo. Authentication will be connected to Supabase next.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },
  brand: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    marginTop: 2,
    color: colors.textSubtle,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  heading: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
  },
  subheading: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  roleSwitch: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
    padding: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
  },
  roleButton: {
    flex: 1,
    minHeight: 44,
  },
  form: {
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  demo: {
    marginTop: spacing.lg,
    color: colors.textSubtle,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
