/**
 *  2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Tela Home.
 */

import UIButton from "@/components/UI/UIButton";
import WRText from "@/components/wrappers/WRText";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";
import { getConnectToken } from "@/service/service.financial-integrator";
import getFinancialIntegratorWebView from "@/webview/financial-integrations/FinancialIntegratorWebViewManager";
import { JSX, useEffect, useState } from "react";
import { View } from "react-native";

export default function HomeScreen() {
  const { isDark } = useAppTheme();
  const { authObject } = useAuth();
  const [useDarkMode, setUseDarkMode] = useState(false);

  // 🔥 Armazena o JSX do WebView para renderizar condicionalmente
  const [bankWebView, setBankWebView] = useState<JSX.Element | null>(null);

  useEffect(() => {
    setUseDarkMode(isDark);
  }, [isDark, authObject]);

  async function connectToBank() {
    try {
      const data = await getConnectToken(authObject);
      const connectToken = data?.dataAccess;
      const platform = data?.platform as string;

      const financialIntegratorWebView = getFinancialIntegratorWebView(platform);

      const webViewComponent = financialIntegratorWebView.connect({
        connectToken: connectToken as string,
        onSuccess: (itemId) => {
          console.log(`Item ID: ${itemId}`);
          setBankWebView(null); // fecha WebView após sucesso
        },
        onError: (error) => {
          console.error(`Erro ao conectar com o banco: ${error}`);
          setBankWebView(null); // fecha em caso de erro também
        },
      });

      setBankWebView(webViewComponent);
    } catch (err) {
      console.error(`Erro ao buscar o connect token: ${err}`);
    }
  }

  // Se houver WebView, renderiza apenas ela
  if (bankWebView) return bankWebView;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
      <WRText>Tela de home! (To logado)</WRText>
      <WRText>{useDarkMode ? 'Usando Thema Escuro' : 'Usando Tema Claro!'}</WRText>

      <WRText>Playground: </WRText>
      <UIButton text="Conectar com banco." onPress={connectToBank} />
    </View>
  );
}