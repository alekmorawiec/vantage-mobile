import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
import { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark } from "../../components/BrandMark";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export function AppLoadingScreen() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { duration: 240, toValue: 1, useNativeDriver: true }).start();
  }, [opacity]);

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View style={[styles.loadingContent, { opacity }]}>
        <View style={styles.brand}>
          <BrandMark />
          <Text style={styles.name}>VANTAGE</Text>
        </View>
        <ActivityIndicator accessibilityLabel="Restoring your Vantage session" color={colors.accent} size="large" />
        <Text style={styles.status}>Restoring your session…</Text>
      </Animated.View>
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
  loadingContent: { alignItems: "center" },
  name: {
    ...typography.sectionTitle,
    color: colors.text,
    letterSpacing: 2,
  },
  status: {
    ...typography.caption,
    marginTop: spacing.lg,
    color: colors.textMuted,
  },
});
