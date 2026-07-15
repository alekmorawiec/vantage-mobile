import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { radii } from "../theme/radii";

type BrandMarkProps = {
  size?: number;
};

export function BrandMark({ size = 48 }: BrandMarkProps) {
  return (
    <View
      style={[
        styles.mark,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
        },
      ]}
    >
      <Text style={[styles.letter, { fontSize: size * 0.42 }]}>V</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: radii.md,
  },
  letter: {
    color: colors.accentInk,
    fontWeight: "900",
  },
});
