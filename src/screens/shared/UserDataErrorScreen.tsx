import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../../components/AppButton";
import { colors } from "../../theme/colors";
import { radii } from "../../theme/radii";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

type UserDataErrorScreenProps = {
  message: string;
  onLogout: () => void;
  onRetry: () => void;
};

export function UserDataErrorScreen({
  message,
  onLogout,
  onRetry,
}: UserDataErrorScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Connection problem</Text>
        <Text accessibilityRole="header" style={styles.title}>
          We couldn't load your account
        </Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <AppButton label="Try again" onPress={onRetry} />
          <AppButton label="Log out" onPress={onLogout} variant="ghost" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    padding: spacing.xl,
  },
  eyebrow: {
    ...typography.label,
    color: colors.red,
  },
  title: {
    ...typography.screenTitle,
    marginTop: spacing.sm,
    color: colors.text,
  },
  message: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
});
