import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>V</Text>
      </View>

      <Text style={styles.title}>VANTAGE</Text>
      <Text style={styles.subtitle}>Recover smarter.</Text>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0C0D",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#2EE6A6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoText: {
    color: "#04140F",
    fontSize: 30,
    fontWeight: "900",
  },
  title: {
    color: "#F4F6F5",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 2,
  },
  subtitle: {
    color: "#8A9591",
    fontSize: 16,
    marginTop: 8,
  },
});