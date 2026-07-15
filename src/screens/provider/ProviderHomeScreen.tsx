import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { MetricCard } from "../../components/MetricCard";
import { colors } from "../../theme/colors";
import { radii } from "../../theme/radii";
import { spacing } from "../../theme/spacing";
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
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Provider dashboard</Text>
          <Text style={styles.heading}>Welcome, {user.name}</Text>
        </View>
        <AppButton label="Log out" variant="ghost" onPress={onLogout} />
      </View>

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

      <Text style={styles.sectionTitle}>Clinical alerts</Text>

      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>Patient B adherence dropped to 43%</Text>
        <Text style={styles.alertDetail}>
          Consider outreach before the next visit.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Your caseload</Text>

      {patients.map((patient) => (
        <View key={patient.name} style={styles.patientCard}>
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
        </View>
      ))}
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
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  alertCard: {
    borderWidth: 1,
    borderColor: "#FF5C5C40",
    borderRadius: radii.lg,
    backgroundColor: "#241010",
    padding: spacing.lg,
  },
  alertTitle: {
    color: "#FFB0B0",
    fontSize: 14,
    fontWeight: "900",
  },
  alertDetail: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 12,
  },
  patientCard: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  patientTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  patientName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  patientDetail: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 12,
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
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
});
