import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppCard } from "../../components/AppCard";
import { Screen } from "../../components/Screen";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SectionHeader } from "../../components/SectionHeader";
import { useUser } from "../../features/user/UserContext";
import { colors } from "../../theme/colors";
import { radii } from "../../theme/radii";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

type PatientHomeScreenProps = {
  onLogout: () => void;
  onCheckIn: () => void;
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function PatientHomeScreen({
  onLogout,
  onCheckIn,
}: PatientHomeScreenProps) {
  const { profile } = useUser();
  const displayName = profile?.display_name?.trim() || null;
  const greeting = getGreeting();

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <ScreenHeader
        eyebrow="Patient home"
        onLogout={onLogout}
        title="Today"
      />

      <View style={styles.greeting}>
        <Text accessibilityRole="header" style={styles.greetingTitle}>
          {displayName ? `${greeting}, ${displayName}` : greeting}
        </Text>
        <Text style={styles.greetingDetail}>
          Here’s what’s planned for today.
        </Text>
      </View>

      <AppCard style={styles.priorityCard}>
        <Text style={styles.priorityLabel}>Today’s priority</Text>
        <Text accessibilityRole="header" style={styles.priorityTitle}>
          Complete today’s check-in
        </Text>
        <Text style={styles.priorityDetail}>
          Share a quick update on how you’re feeling to help keep your care
          team informed.
        </Text>
        <Text style={styles.estimatedTime}>Less than 1 minute</Text>
        <AppButton
          accessibilityLabel="Start today’s check-in"
          label="Start check-in"
          onPress={onCheckIn}
          style={styles.priorityAction}
        />
      </AppCard>

      <SectionHeader title="Today’s exercises" />
      <AppCard>
        <Text style={styles.cardTitle}>No exercises assigned yet</Text>
        <Text style={styles.cardDetail}>
          Your prescribed exercises will appear here when they’re assigned by
          your care team.
        </Text>
      </AppCard>

      <SectionHeader title="Recovery summary" />
      <AppCard style={styles.recoveryCard}>
        <Text style={styles.summaryLabel}>Vantage summary · pre-data</Text>
        <Text style={styles.cardTitle}>Your summary is still taking shape</Text>
        <Text style={styles.cardDetail}>
          Future summaries will reflect approved inputs such as your check-ins,
          activity, and symptoms when that information is available.
        </Text>
        <Text style={styles.disclaimer}>
          This summary tracks trends and does not indicate medical clearance.
        </Text>
      </AppCard>

      <SectionHeader title="Progress" />
      <AppCard>
        <Text style={styles.cardTitle}>
          Progress trends will appear as you complete check-ins
        </Text>
        <Text style={styles.cardDetail}>
          Your provider’s assigned measures will appear here when available.
        </Text>
      </AppCard>

      <SectionHeader title="Upcoming care" />
      <AppCard>
        <Text style={styles.cardTitle}>
          Appointments aren’t available in Vantage yet
        </Text>
        <Text style={styles.cardDetail}>
          Future appointments will appear here when scheduling is connected.
        </Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxxl },
  greeting: { marginTop: spacing.xl },
  greetingTitle: { ...typography.sectionTitle, color: colors.text },
  greetingDetail: {
    ...typography.bodyMuted,
    marginTop: spacing.xs,
    color: colors.textMuted,
  },
  priorityCard: {
    marginTop: spacing.xl,
    borderColor: "#2EE6A650",
    borderRadius: radii.xl,
    backgroundColor: "#102019",
    padding: spacing.xl,
  },
  priorityLabel: { ...typography.label, color: colors.accent },
  priorityTitle: {
    ...typography.screenTitle,
    marginTop: spacing.sm,
    color: colors.text,
  },
  priorityDetail: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  estimatedTime: {
    ...typography.caption,
    marginTop: spacing.md,
    color: colors.text,
    fontWeight: "700",
  },
  priorityAction: { marginTop: spacing.xl },
  cardTitle: { ...typography.sectionTitle, color: colors.text },
  cardDetail: {
    ...typography.bodyMuted,
    marginTop: spacing.sm,
    color: colors.textMuted,
  },
  recoveryCard: { backgroundColor: colors.surfaceRaised },
  summaryLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    color: colors.textSubtle,
  },
  disclaimer: {
    ...typography.caption,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    color: colors.textMuted,
  },
});
