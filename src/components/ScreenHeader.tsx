import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  onLogout?: () => void;
};

export function ScreenHeader({ eyebrow, title, onLogout }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
      </View>
      {onLogout ? (
        <Pressable
          accessibilityLabel="Log out of Vantage"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onLogout}
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
        >
          <Ionicons color={colors.textMuted} name="log-out-outline" size={21} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  copy: { flex: 1 },
  eyebrow: { ...typography.label, color: colors.textSubtle },
  title: { ...typography.screenTitle, marginTop: spacing.xs, color: colors.text },
  action: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionPressed: { opacity: 0.65, transform: [{ scale: 0.96 }] },
});
