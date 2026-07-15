import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { MetricCard } from "../../components/MetricCard";
import { colors } from "../../theme/colors";
import { radii } from "../../theme/radii";
import { spacing } from "../../theme/spacing";
import type { AppUser } from "../../types/auth";

type PatientHomeScreenProps = {
  user: AppUser;
  onLogout: () => void;
};

export function PatientHomeScreen({
  user,
  onLogout,
}: PatientHomeScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Patient dashboard</Text>
          <Text style={styles.heading}>Good morning, {user.name}</Text>
        </View>
        <AppButton label="Log out" variant="ghost" onPress={onLogout} />
      </View>

      <View style={styles.recoveryCard}>
        <View>
          <Text style={styles.cardEyebrow}>Recovery score</Text>
          <Text style={styles.recoveryScore}>84</Text>
          <Text style={styles.recoveryDetail}>
            Trending upward over the last 14 days
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>READY</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <MetricCard
          label="HEP adherence"
          value="91%"
          detail="6-day streak"
          accent="amber"
        />
        <MetricCard
          label="VALD LSI"
          value="93%"
          detail="+7% from baseline"
          accent="green"
        />
      </View>

      <Text style={styles.sectionTitle}>Today</Text>

      <View style={styles.taskCard}>
        <View>
          <Text style={styles.taskTitle}>Complete your daily check-in</Text>
          <Text style={styles.taskDetail}>About 60 seconds</Text>
        </View>
        <Text style={styles.taskAction}>Start →</Text>
      </View>

      <View style={styles.taskCard}>
        <View>
          <Text style={styles.taskTitle}>Home exercise program</Text>
          <Text style={styles.taskDetail}>4 prescribed exercises</Text>
        </View>
        <Text style={styles.taskAction}>View →</Text>
      </View>

      <Text style={styles.sectionTitle}>Next appointment</Text>

      <View style={styles.appointmentCard}>
        <Text style={styles.appointmentDate}>Thu, Jul 16 · 2:30 PM</Text>
        <Text style={styles.appointmentDetail}>with Provider · Visit 9 of 12</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heading: {
    maxWidth: 245,
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 27,
    fontWeight: "900",
  },
  recoveryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: "#1E3B2F",
    borderRadius: radii.xl,
    backgroundColor: "#102019",
    padding: spacing.xl,
  },
  cardEyebrow: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  recoveryScore: {
    marginTop: spacing.sm,
    color: colors.accent,
    fontSize: 54,
    fontWeight: "900",
  },
  recoveryDetail: {
    maxWidth: 210,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  scoreBadge: {
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    backgroundColor: "#2EE6A620",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  scoreBadgeText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  taskTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  taskDetail: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 12,
  },
  taskAction: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800",
  },
  appointmentCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  appointmentDate: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  appointmentDetail: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 13,
  },
});
