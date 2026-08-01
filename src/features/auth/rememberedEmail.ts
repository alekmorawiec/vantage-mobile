import AsyncStorage from "@react-native-async-storage/async-storage";

const REMEMBERED_EMAIL_KEY = "vantage.lastSuccessfulEmail";

export async function getRememberedEmail() {
  try {
    return (await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY)) ?? "";
  } catch {
    return "";
  }
}

export async function rememberEmail(email: string) {
  try {
    await AsyncStorage.setItem(
      REMEMBERED_EMAIL_KEY,
      email.trim().toLowerCase(),
    );
  } catch {
    // Remembering an email is a convenience and must never block authentication.
  }
}
