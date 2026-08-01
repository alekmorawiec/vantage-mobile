import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { radii } from "../theme/radii";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  accent?: "green" | "blue" | "amber" | "red";
};

const accentColors = {
  green: colors.accent,
  blue: colors.blue,
  amber: colors.amber,
  red: colors.red,
};

export function MetricCard({
  label,
  value,
  detail,
  accent = "green",
}: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: accentColors[accent] }]}>{value}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 118,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.textSubtle,
  },
  value: {
    ...typography.metric,
    marginTop: spacing.sm,
  },
  detail: {
    ...typography.caption,
    marginTop: spacing.xs,
    color: colors.textMuted,
  },
});
