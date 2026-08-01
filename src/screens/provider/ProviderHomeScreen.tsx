import { StyleSheet, Text, View } from "react-native";

import { AppCard } from "../../components/AppCard";
import { MetricCard } from "../../components/MetricCard";
import { Screen } from "../../components/Screen";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SectionHeader } from "../../components/SectionHeader";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import type { AppUser } from "../../types/auth";

type ProviderHomeScreenProps = {
  user: AppUser;
  onLogout: () => void;
};

const patients = [
  {
    name: "Patient A",
    program: "ACL recovery",
    visit: "9/12",
    adherence: "91%",
    status: "On track",
  },
  {
    name: "Patient B",
    program: "Rotator cuff",
    visit: "4/10",
    adherence: "43%",
    status: "Needs attention",
  },
  {
    name: "Patient C",
    program: "Post-op knee",
    visit: "14/16",
    adherence: "100%",
    status: "On track",
  },
];

export function ProviderHomeScreen({
  user,
  onLogout,
}: ProviderHomeScreenProps) {
  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <ScreenHeader eyebrow="Provider dashboard" onLogout={onLogout} title={`Welcome, ${user.name}`} />

      <View style={styles.metricsRow}>
        <MetricCard
          label="Active patients"
          value="24"
          detail="3 need review"
          accent="blue"
        />
        <MetricCard
          label="Avg adherence"
          value="82%"
          detail="+4% this week"
          accent="green"
        />
      </View>

      <SectionHeader title="Clinical alerts" />

      <AppCard style={styles.alertCard}>
        <Text style={styles.alertTitle}>Patient B adherence dropped to 43%</Text>
        <Text style={styles.alertDetail}>
          Consider outreach before the next visit.
        </Text>
      </AppCard>

      <SectionHeader title="Your caseload" />

      {patients.map((patient) => (
        <AppCard key={patient.name} style={styles.patientCard}>
          <View style={styles.patientTopRow}>
            <View>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientDetail}>
                {patient.program} · Visit {patient.visit}
              </Text>
            </View>

            <Text
              style={[
                styles.status,
                patient.status === "Needs attention" && styles.statusAlert,
              ]}
            >
              {patient.status}
            </Text>
          </View>

          <View style={styles.patientBottomRow}>
            <Text style={styles.metricLabel}>HEP adherence</Text>
            <Text style={styles.metricValue}>{patient.adherence}</Text>
          </View>
        </AppCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxxl,
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  alertCard: {
    borderColor: "#FF5C5C40",
    backgroundColor: "#241010",
  },
  alertTitle: {
    ...typography.bodyMuted,
    color: "#FFB0B0",
    fontWeight: "700",
  },
  alertDetail: {
    ...typography.caption,
    marginTop: spacing.xs,
    color: colors.textMuted,
  },
  patientCard: {
    marginBottom: spacing.md,
  },
  patientTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  patientName: {
    ...typography.body,
    color: colors.text,
    fontWeight: "700",
  },
  patientDetail: {
    ...typography.caption,
    marginTop: spacing.xs,
    color: colors.textMuted,
  },
  status: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  statusAlert: {
    color: colors.red,
  },
  patientBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metricLabel: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  metricValue: {
    ...typography.sectionTitle,
    color: colors.text,
  },
});
