import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark } from "../../components/BrandMark";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

export function AppLoadingScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.brand}>
        <BrandMark />
        <Text style={styles.name}>VANTAGE</Text>
      </View>
      <ActivityIndicator
        accessibilityLabel="Restoring your Vantage session"
        color={colors.accent}
        size="large"
      />
      <Text style={styles.status}>Restoring your session…</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
  status: {
    marginTop: spacing.lg,
    color: colors.textMuted,
    fontSize: 13,
  },
});
