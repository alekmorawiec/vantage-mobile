import { StyleSheet, Text } from "react-native";

import { AppCard } from "../../components/AppCard";
import { Screen } from "../../components/Screen";
import { ScreenHeader } from "../../components/ScreenHeader";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

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
    <Screen edges={includeTopInset ? ["top", "left", "right"] : ["left", "right"]}>
      <ScreenHeader eyebrow={eyebrow} title={title} />
      <Text style={styles.description}>{description}</Text>
      <AppCard style={styles.previewCard}>
        <Text style={styles.previewLabel}>{previewLabel}</Text>
        <Text style={styles.previewDetail}>{detail}</Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  description: {
    ...typography.body,
    maxWidth: 420,
    marginTop: spacing.lg,
    color: colors.textMuted,
  },
  previewCard: { marginTop: spacing.xxl, padding: spacing.xl },
  previewLabel: { ...typography.label, color: colors.textSubtle },
  previewDetail: { ...typography.bodyMuted, marginTop: spacing.sm, color: colors.text },
});
