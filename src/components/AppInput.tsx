import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { colors } from "../theme/colors";
import { radii } from "../theme/radii";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type AppInputProps = TextInputProps & {
  label: string;
};

export function AppInput({ label, style, ...props }: AppInputProps) {
  const isMultiline = props.multiline === true;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={colors.textSubtle}
        selectionColor={colors.accent}
        style={[
          styles.input,
          isMultiline ? styles.multilineInput : styles.singleLineInput,
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSubtle,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    ...typography.input,
  },
  singleLineInput: {
    height: 52,
    paddingVertical: 0,
  },
  multilineInput: {
    paddingVertical: spacing.md,
    lineHeight: typography.body.lineHeight,
  },
});
