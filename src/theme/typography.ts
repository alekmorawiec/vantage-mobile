import type { TextStyle } from "react-native";

export const typography = {
  display: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1.1,
    lineHeight: 42,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
  },
  input: {
    fontSize: 15,
    fontWeight: "400",
  },
  bodyMuted: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    lineHeight: 15,
    textTransform: "uppercase",
  },
  metric: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.7,
    lineHeight: 36,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 17,
  },
  button: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
} satisfies Record<string, TextStyle>;
