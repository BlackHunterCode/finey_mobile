import { AuthProvider } from "@/context/auth-context";
import { NavigationProvider } from "@/context/navigation-context";
import { ReferenceDateProvider } from "@/context/reference-date-context";
import { ThemeProvider } from "@/context/theme-context";
import { ToastProvider } from "@/context/toast-context";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <NavigationProvider>
              <ReferenceDateProvider>
                <InnerRouter />
              </ReferenceDateProvider>
            </NavigationProvider>
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

function InnerRouter() {
  return <Slot />
}