/**
 *  2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Tela Home.
 */

import UIButton from "@/components/UI/UIButton";
import WRText from "@/components/wrappers/WRText";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";
import { connectToBank } from "@/service/service.financial-integrator";
import { JSX, useEffect, useState } from "react";
import { View } from "react-native";

export default function HomeScreen() {
  const { isDark } = useAppTheme();
  const { authObject } = useAuth();
  const [useDarkMode, setUseDarkMode] = useState(false);
  const [bankWebView, setBankWebView] = useState<JSX.Element | null>(null);

  useEffect(() => {
    setUseDarkMode(isDark);
  }, [isDark, authObject]);

  async function handleConnectBank() {
    const webViewComponent = await connectToBank({
      authObject: authObject,
      onSuccess: () => {
        setBankWebView(null);
      },
      onError: () => {
        setBankWebView(null);
      },
    });

    if (webViewComponent) {
      setBankWebView(webViewComponent);
    }
  }

  if (bankWebView) return bankWebView;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
      <WRText>Tela de home! (To logado)</WRText>
      <WRText>{useDarkMode ? 'Usando Thema Escuro' : 'Usando Tema Claro!'}</WRText>

      <WRText>Playground: </WRText>
      <UIButton text="Conectar com banco." onPress={handleConnectBank} />
    </View>
  );
}