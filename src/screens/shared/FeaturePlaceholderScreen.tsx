import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../theme/colors";
import { radii } from "../../theme/radii";
import { spacing } from "../../theme/spacing";

type FeaturePlaceholderScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  includeTopInset?: boolean;
  previewLabel?: string;
};

export function FeaturePlaceholderScreen({
  eyebrow,
  title,
  description,
  detail,
  includeTopInset = false,
  previewLabel = "Planned experience",
}: FeaturePlaceholderScreenProps) {
  return (
    <SafeAreaView
      edges={includeTopInset ? ["top", "left", "right"] : ["left", "right"]}
      style={styles.screen}
    >
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>{previewLabel}</Text>
          <Text style={styles.previewDetail}>{detail}</Text>
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
    color: colors.accent,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
  },
  description: {
    maxWidth: 420,
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  previewCard: {
    marginTop: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.xl,
  },
  previewLabel: {
    color: colors.textSubtle,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  previewDetail: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
});
