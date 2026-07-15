import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { radii } from "../theme/radii";
import { spacing } from "../theme/spacing";

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
    color: colors.textSubtle,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  value: {
    marginTop: spacing.sm,
    fontSize: 28,
    fontWeight: "900",
  },
  detail: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 12,
  },
});
