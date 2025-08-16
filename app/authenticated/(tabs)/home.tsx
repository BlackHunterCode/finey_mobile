/**
 *  2025 Finey - Todos os Direitos Reservados.
 * 
 * Tela Home.
 */

import FinancialResumeHomeScreen from "@/components/component_screens/home_screen/financial-resume-home-screen";
import GreetingsHomeScreen from "@/components/component_screens/home_screen/greetings-home-screen";
import NewsHomeScreen from "@/components/component_screens/home_screen/news-home-screen";
import ScreenControllerHomeScreen from "@/components/component_screens/home_screen/screen-controller-home-screen";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import { ToastType } from "@/constants/constants.toast";
import { useAuth } from "@/context/auth-context";
import { useTargetBanks } from "@/context/target-bank-context";
import { useAppTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";
import { processTutorialPriorities } from "@/priorities/priorities.tutorial";
import { getUserInfo } from "@/service/service.user";
import UserInfo from "@/types/UserInfo";
import { useEffect, useState } from "react";

// Importando os novos componentes de análise
import AIInsightsScreen from "@/components/component_screens/home_screen/ai-insights-screen";
import BudgetRealityScreen from "@/components/component_screens/home_screen/budget-reality-screen";
import CurrentBalanceProjectionScreen from "@/components/component_screens/home_screen/current-balance-projection-screen";
import ExpenseCategoriesScreen from "@/components/component_screens/home_screen/expense-categories-screen";
import IncomeBreakdownScreen from "@/components/component_screens/home_screen/income-breakdown-screen";
import SavingsInvestmentsScreen from "@/components/component_screens/home_screen/savings-investments-screen";

export default function HomeScreen() {
  const { isDark } = useAppTheme();
  const { authObject } = useAuth();
  const { showToast } = useToast();
  const { setSelectedBanks } = useTargetBanks();

  // test
  const [openTutorialModal, setOpenTutorialModal] = useState<boolean>(false);

  useEffect(() => {
    async function processUserPriorities() {
      const userInfo: UserInfo | null = await getUserInfo(authObject);
      if(userInfo) {
        processTutorialPriorities(userInfo, setOpenTutorialModal);
        setSelectedBanks(userInfo.connectedBanks);
      }
      else {
        showToast({
          message: "Não foi possível buscar as informações de usuário. Os processamentos de prioridades não foram executados.",
          type: ToastType.WARNING,
          duration: 10000
        })
      }
    } 
    processUserPriorities();
  }, [isDark, authObject]);

  return (
    <WRScreenContainer>
      <GreetingsHomeScreen />
      <ScreenControllerHomeScreen />
      
      <FinancialResumeHomeScreen/>
      <CurrentBalanceProjectionScreen />
      <ExpenseCategoriesScreen />
      <BudgetRealityScreen />
      <AIInsightsScreen />
      <IncomeBreakdownScreen />
      <SavingsInvestmentsScreen />
      
      <NewsHomeScreen />
    </WRScreenContainer>
  );
}