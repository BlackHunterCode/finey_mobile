import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <InnerRouter />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

function InnerRouter() {
  return <Slot />
}