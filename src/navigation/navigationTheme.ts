import { DarkTheme, type Theme } from "@react-navigation/native";

import { colors } from "../theme/colors";

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.red,
  },
};
