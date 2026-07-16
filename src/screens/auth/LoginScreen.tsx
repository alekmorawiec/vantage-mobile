import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { BrandMark } from "../../components/BrandMark";
import { useAuth } from "../../features/auth/AuthContext";
import { colors } from "../../theme/colors";
import { radii } from "../../theme/radii";
import { spacing } from "../../theme/spacing";

type AuthMode = "signIn" | "signUp";

export function LoginScreen() {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function validate() {
    if (mode === "signUp" && !name.trim()) {
      return "Enter your name.";
    }

    if (!email.trim() || !email.includes("@")) {
      return "Enter a valid email address.";
    }

    if (password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    return "";
  }

  async function submit() {
    const validationMessage = validate();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (mode === "signIn") {
        await signIn(email, password);
      } else {
        const result = await signUp(name, email, password, "patient");

        if (result.requiresEmailConfirmation) {
          Alert.alert(
            "Check your email",
            "Your patient account was created. Open the confirmation email, then return to Vantage and log in.",
          );
          setMode("signIn");
          setPassword("");
        }
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Authentication failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <BrandMark />
          <View>
            <Text style={styles.brand}>VANTAGE</Text>
            <Text style={styles.brandSubtitle}>
              Physical therapy + performance
            </Text>
          </View>
        </View>

        <Text style={styles.heading}>
          {mode === "signIn" ? "Welcome back" : "Create your patient account"}
        </Text>

        <Text style={styles.subheading}>
          {mode === "signIn"
            ? "Sign in to access your Vantage dashboard."
            : "Patient accounts can be created here. Provider access is invite-only."}
        </Text>

        <View style={styles.modeSwitch}>
          <AppButton
            label="Log in"
            variant={mode === "signIn" ? "primary" : "ghost"}
            onPress={() => {
              setMode("signIn");
              setErrorMessage("");
            }}
            style={styles.switchButton}
          />
          <AppButton
            label="Create account"
            variant={mode === "signUp" ? "primary" : "ghost"}
            onPress={() => {
              setMode("signUp");
              setErrorMessage("");
            }}
            style={styles.switchButton}
          />
        </View>

        {mode === "signUp" ? (
          <View style={styles.inviteNotice}>
            <Text style={styles.inviteTitle}>Provider access is invite-only</Text>
            <Text style={styles.inviteText}>
              Clinic providers must be approved and provisioned by an administrator.
            </Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {mode === "signUp" ? (
            <AppInput
              label="Name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
            />
          ) : null}

          <AppInput
            label="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
          />

          <AppInput
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
          />

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <AppButton
            disabled={isSubmitting}
            label={
              isSubmitting
                ? "Please wait…"
                : mode === "signIn"
                  ? "Log in"
                  : "Create patient account"
            }
            onPress={submit}
          />
        </View>

        <Text style={styles.securityNote}>
          Authentication is handled by your Vantage Supabase project.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
    paddingVertical: spacing.xxxl,
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
  modeSwitch: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.xl,
    padding: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
  },
  switchButton: {
    flex: 1,
    minHeight: 44,
  },
  inviteNotice: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: "#4FA6FF35",
    borderRadius: radii.md,
    backgroundColor: "#0E1B24",
    padding: spacing.lg,
  },
  inviteTitle: {
    color: "#9CC9FF",
    fontSize: 13,
    fontWeight: "900",
  },
  inviteText: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  form: {
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  error: {
    color: colors.red,
    fontSize: 13,
    lineHeight: 18,
  },
  securityNote: {
    marginTop: spacing.lg,
    color: colors.textSubtle,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
