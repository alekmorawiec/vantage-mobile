import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type SectionHeaderProps = { title: string; detail?: string };

export function SectionHeader({ title, detail }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: spacing.xxl, marginBottom: spacing.md },
  title: { ...typography.sectionTitle, color: colors.text },
  detail: { ...typography.caption, marginTop: spacing.xs, color: colors.textMuted },
});
