import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../../components/AppButton";
import { BrandMark } from "../../components/BrandMark";
import { colors } from "../../theme/colors";
import { radii } from "../../theme/radii";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

type AccountSetupRequiredScreenProps = {
  message: string;
  onLogout: () => void;
  onRefresh: () => void;
};

export function AccountSetupRequiredScreen({
  message,
  onLogout,
  onRefresh,
}: AccountSetupRequiredScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <BrandMark />
        <Text style={styles.eyebrow}>Vantage account</Text>
        <Text accessibilityRole="header" style={styles.title}>
          Account setup required
        </Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>What happens next?</Text>
          <Text style={styles.noticeText}>
            Patient access is created during signup. Provider access must be
            approved and provisioned by a clinic administrator.
          </Text>
        </View>

        <View style={styles.actions}>
          <AppButton label="Check again" onPress={onRefresh} />
          <AppButton label="Log out" onPress={onLogout} variant="ghost" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },
  eyebrow: {
    ...typography.label,
    marginTop: spacing.xl,
    color: colors.accent,
  },
  title: {
    ...typography.display,
    marginTop: spacing.sm,
    color: colors.text,
  },
  message: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  notice: {
    marginTop: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.xl,
  },
  noticeTitle: {
    ...typography.bodyMuted,
    color: colors.text,
    fontWeight: "700",
  },
  noticeText: {
    ...typography.bodyMuted,
    marginTop: spacing.sm,
    color: colors.textMuted,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
});
