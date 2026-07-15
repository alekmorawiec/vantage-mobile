import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from "react-native";

import { colors } from "../theme/colors";
import { radii } from "../theme/radii";
import { spacing } from "../theme/spacing";

type AppButtonProps = PressableProps & {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function AppButton({
  label,
  variant = "primary",
  disabled,
  style,
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
  },
  primaryLabel: {
    color: colors.accentInk,
  },
  secondaryLabel: {
    color: colors.text,
  },
  ghostLabel: {
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
