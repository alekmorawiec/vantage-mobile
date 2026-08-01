import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import type { PropsWithChildren } from "react";

import { colors } from "../theme/colors";
import { radii } from "../theme/radii";
import { spacing } from "../theme/spacing";

type AppCardProps = PropsWithChildren<{
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewProps["style"];
}>;

export function AppCard({ children, onPress, accessibilityLabel, style }: AppCardProps) {
  if (onPress) {
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
});
