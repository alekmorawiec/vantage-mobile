import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../theme/colors";
import { radii } from "../../../theme/radii";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

type ChoiceValue = string | number | boolean;

export type CheckInChoice<T extends ChoiceValue> = {
  value: T;
  label: string;
  accessibilityLabel?: string;
};

type CheckInChoiceGroupProps<T extends ChoiceValue> = {
  choices: readonly CheckInChoice<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  layout?: "list" | "row";
  compact?: boolean;
  accessibilityLabel: string;
};

type CheckInMultiChoiceGroupProps<T extends ChoiceValue> = {
  choices: readonly CheckInChoice<T>[];
  selectedValues: readonly T[];
  onToggle: (value: T) => void;
  maximumSelections: number;
  accessibilityLabel: string;
};

export function CheckInChoiceGroup<T extends ChoiceValue>({
  choices,
  selectedValue,
  onSelect,
  layout = "list",
  compact = false,
  accessibilityLabel,
}: CheckInChoiceGroupProps<T>) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radiogroup"
      style={[styles.group, layout === "row" && styles.row]}
    >
      {choices.map((choice) => {
        const selected = choice.value === selectedValue;

        return (
          <Pressable
            accessibilityLabel={choice.accessibilityLabel ?? choice.label}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            key={String(choice.value)}
            onPress={() => onSelect(choice.value)}
            style={({ pressed }) => [
              styles.choice,
              layout === "row" && styles.rowChoice,
              compact && styles.compactChoice,
              selected && styles.choiceSelected,
              pressed && styles.choicePressed,
            ]}
          >
            <Text
              style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}
            >
              {choice.label}
            </Text>
            {selected ? (
              <Text accessibilityElementsHidden style={styles.selectedIndicator}>
                ✓
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function CheckInMultiChoiceGroup<T extends ChoiceValue>({
  choices,
  selectedValues,
  onToggle,
  maximumSelections,
  accessibilityLabel,
}: CheckInMultiChoiceGroupProps<T>) {
  const reachedMaximum = selectedValues.length >= maximumSelections;

  return (
    <View accessibilityLabel={accessibilityLabel} style={styles.multiGroup}>
      {choices.map((choice) => {
        const selected = selectedValues.includes(choice.value);
        const disabled = reachedMaximum && !selected;

        return (
          <Pressable
            accessibilityLabel={choice.accessibilityLabel ?? choice.label}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected, disabled }}
            disabled={disabled}
            key={String(choice.value)}
            onPress={() => onToggle(choice.value)}
            style={({ pressed }) => [
              styles.choice,
              styles.multiChoice,
              selected && styles.choiceSelected,
              disabled && styles.choiceDisabled,
              pressed && styles.choicePressed,
            ]}
          >
            <Text
              style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}
            >
              {choice.label}
            </Text>
            {selected ? (
              <Text accessibilityElementsHidden style={styles.selectedIndicator}>
                ✓
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  row: { flexDirection: "row", gap: spacing.xs },
  multiGroup: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  choice: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowChoice: {
    minWidth: 44,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xs,
  },
  compactChoice: { minHeight: 44, paddingVertical: spacing.sm },
  multiChoice: { width: "48%", flexGrow: 1 },
  choiceSelected: {
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.surfaceRaised,
  },
  choicePressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
  choiceDisabled: { opacity: 0.45 },
  choiceLabel: { ...typography.body, flexShrink: 1, color: colors.text },
  choiceLabelSelected: { color: colors.accent, fontWeight: "700" },
  selectedIndicator: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: "800",
  },
});
