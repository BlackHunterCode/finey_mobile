/**
 *  2025 Finey - Todos os Direitos Reservados.
 * 
 * Tela Home.
 */

import UIButton from "@/components/UI/UIButton";
import UIModal from "@/components/UI/UIModal";
import GreetingsHomeScreen from "@/components/component_screens/home_screen/greetings-home-screen";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { ToastType } from "@/constants/constants.toast";
import { useAuth } from "@/context/auth-context";
import { useNavigation } from "@/context/navigation-context";
import { useAppTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";
import { processTutorialPriorities } from "@/priorities/priorities.tutorial";
import { getUserInfo } from "@/service/service.user";
import UserInfo from "@/types/UserInfo";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const { isDark } = useAppTheme();
  const { authObject, signOut } = useAuth();
  const { showToast } = useToast();
  const { pushToSplashScreen } = useNavigation();
  const [useDarkMode, setUseDarkMode] = useState(false);

  // test
  const [openTutorialModal, setOpenTutorialModal] = useState<boolean>(false);

  useEffect(() => {
    async function processUserPriorities() {
      const userInfo: UserInfo | null = await getUserInfo(authObject);
      if(userInfo) {
        processTutorialPriorities(userInfo, setOpenTutorialModal);
      }
      else {
        showToast({
          message: "Não foi possível buscar as informações de usuário. Os processamentos de prioridades não foram executados.",
          type: ToastType.WARNING,
          duration: 10000
        })
      }
    } 

    setUseDarkMode(isDark);
    processUserPriorities();
  }, [isDark, authObject]);

  

  // Exemplo de função para mostrar diferentes tipos de toast
  function mostrarExemplosToast() {
    // Toast de sucesso
    showToast({
      message: "Operação realizada com sucesso!",
      type: ToastType.SUCCESS
    });

    // Você pode adicionar um timeout para mostrar diferentes toasts em sequência
    setTimeout(() => {
      // Toast de aviso
      showToast({
        message: "Atenção! Verifique suas informações.",
        type: ToastType.WARNING
      });
    }, 3500);

    setTimeout(() => {
      // Toast de erro com ação
      showToast({
        message: "Ocorreu um erro na operação",
        type: ToastType.ERROR,
        action: {
          label: "RESOLVER",
          onPress: () => {}
        }
      });
    }, 7000);

    setTimeout(() => {
      // Toast de notificação com ação
      showToast({
        message: "Você tem uma nova notificação",
        type: ToastType.NOTIFICATION,
        action: {
          label: "VER",
          onPress: () => {}
        }
      });
    }, 10500);
  }

  return (
    <WRScreenContainer>
      <GreetingsHomeScreen />
      <WRText>{useDarkMode ? 'Usando Thema Escuro' : 'Usando Tema Claro!'}</WRText>

      <UIModal
        visible={openTutorialModal}
        onClose={() => setOpenTutorialModal(false)}
        title="Título do Modal"
        size="medium"
        position="center"
      >
        <WRText>Conteúdo do modal aqui!</WRText>
      </UIModal>
      
      <UIButton 
        text="Mostrar Exemplo de Toast"
        size="medium"
        onPress={mostrarExemplosToast}
        style={{ marginBottom: 16 }}
      />
      
      <UIButton 
        text="Sair"
        hasBackground={false}
        size="medium"
        onPress={() => { 
          signOut(); 
          pushToSplashScreen({
            onRouterSuccess: "../../unauthenticated/(stack)/login/login" as const,
            message: "Volte sempre!",
            processingTime: 5500
          });
        }}
      />
    </WRScreenContainer>
  );
}