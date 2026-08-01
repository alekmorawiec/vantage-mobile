import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppCard } from "../../components/AppCard";
import { MetricCard } from "../../components/MetricCard";
import { Screen } from "../../components/Screen";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SectionHeader } from "../../components/SectionHeader";
import { colors } from "../../theme/colors";
import { radii } from "../../theme/radii";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import type { AppUser } from "../../types/auth";

type PatientHomeScreenProps = { user: AppUser; onLogout: () => void; onCheckIn: () => void };

export function PatientHomeScreen({ user, onLogout, onCheckIn }: PatientHomeScreenProps) {
  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <ScreenHeader
        eyebrow="Patient dashboard"
        onLogout={onLogout}
        title={`Good morning, ${user.name}`}
      />

      <AppCard style={styles.recoveryCard}>
        <Text style={styles.cardEyebrow}>Vantage summary · prototype</Text>
        <Text style={styles.recoveryScore}>84</Text>
        <Text style={styles.recoveryDetail}>
          Based on your recent check-ins and activity. This summary tracks
          trends and does not indicate medical clearance.
        </Text>
      </AppCard>

      <View style={styles.metricsRow}>
        <MetricCard label="HEP adherence" value="91%" detail="6-day streak" accent="amber" />
        <MetricCard label="VALD LSI" value="93%" detail="+7% from baseline" accent="green" />
      </View>

      <SectionHeader title="Today" />

      <AppCard style={styles.checkInCard}>
        <View style={styles.taskCopy}>
          <Text style={styles.checkInTitle}>Daily check-in</Text>
          <Text style={styles.checkInDetail}>Share how you’re feeling · about 60 seconds</Text>
        </View>
        <AppButton accessibilityLabel="Start daily check-in" label="Start check-in" onPress={onCheckIn} />
      </AppCard>

      <AppCard style={styles.taskCard}>
        <View>
          <Text style={styles.taskTitle}>Home exercise program</Text>
          <Text style={styles.taskDetail}>4 prescribed exercises</Text>
        </View>
        <Text style={styles.taskAction}>View →</Text>
      </AppCard>

      <SectionHeader title="Next appointment" />
      <AppCard>
        <Text style={styles.appointmentDate}>Thu, Jul 16 · 2:30 PM</Text>
        <Text style={styles.appointmentDetail}>with Provider · Visit 9 of 12</Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxxl },
  recoveryCard: {
    marginTop: spacing.xl,
    borderColor: "#1E3B2F",
    borderRadius: radii.xl,
    backgroundColor: "#102019",
    padding: spacing.xl,
  },
  cardEyebrow: { ...typography.label, color: colors.textMuted },
  recoveryScore: {
    marginTop: spacing.sm,
    color: colors.accent,
    fontSize: 54,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 60,
  },
  recoveryDetail: {
    ...typography.caption,
    maxWidth: 310,
    marginTop: spacing.xs,
    color: colors.textMuted,
  },
  metricsRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  checkInCard: {
    gap: spacing.lg,
    borderColor: "#2EE6A645",
    backgroundColor: "#102019",
    padding: spacing.xl,
  },
  taskCopy: { gap: spacing.xs },
  checkInTitle: { ...typography.sectionTitle, color: colors.text },
  checkInDetail: { ...typography.bodyMuted, color: colors.textMuted },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  taskTitle: { ...typography.body, color: colors.text, fontWeight: "700" },
  taskDetail: { ...typography.caption, marginTop: spacing.xs, color: colors.textMuted },
  taskAction: { ...typography.button, color: colors.accent },
  appointmentDate: { ...typography.sectionTitle, color: colors.text },
  appointmentDetail: { ...typography.bodyMuted, marginTop: spacing.sm, color: colors.textMuted },
});
