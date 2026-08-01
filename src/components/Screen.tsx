import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type ViewProps,
} from "react-native";
import { useEffect, useRef, type PropsWithChildren } from "react";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type ScreenProps = PropsWithChildren<{
  edges?: Edge[];
  scroll?: boolean;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
  scrollViewProps?: Omit<
    ScrollViewProps,
    "children" | "contentContainerStyle" | "style"
  >;
  style?: ViewProps["style"];
}>;

export function Screen({
  children,
  edges = ["top", "left", "right"],
  scroll = false,
  contentContainerStyle,
  scrollViewProps,
  style,
}: ScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      duration: 180,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, style]}>
      <Animated.View style={[styles.animated, { opacity }]}>
        {scroll ? (
          <ScrollView
            {...scrollViewProps}
            contentContainerStyle={[styles.content, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, styles.staticContent, contentContainerStyle]}>
            {children}
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  animated: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingVertical: spacing.xl },
  staticContent: { flex: 1 },
});
