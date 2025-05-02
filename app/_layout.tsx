import { AuthProvider } from "@/context/auth-context";
import { NavigationProvider } from "@/context/navigation-context";
import { ReferenceDateProvider } from "@/context/reference-date-context";
import { SplashErrorMessageProvider } from "@/context/splash-error-message-context";
import { TargetBankProvider } from "@/context/target-bank-context";
import { ThemeProvider } from "@/context/theme-context";
import { ToastProvider } from "@/context/toast-context";
import { TotalTransactionPeriodProvider } from "@/context/transaction/total-transaction-period-context";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SplashErrorMessageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <NavigationProvider>
                <ReferenceDateProvider>
                  <TargetBankProvider>
                    <TotalTransactionPeriodProvider>
                      <InnerRouter />
                    </TotalTransactionPeriodProvider>
                  </TargetBankProvider>
                </ReferenceDateProvider>
              </NavigationProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </SplashErrorMessageProvider>
    </SafeAreaProvider>
  );
}

function InnerRouter() {
  return <Slot />
}