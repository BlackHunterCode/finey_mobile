/**
 *  2025 Finey - Todos os Direitos Reservados.
 * 
 * Tela Home.
 */

import BudgetRealityScreen from "@/components/component_screens/home_screen/budget-reality-screen";
import CurrentBalanceProjectionScreen from "@/components/component_screens/home_screen/current-balance-projection-screen";
import ExpenseCategoriesScreen from "@/components/component_screens/home_screen/expense-categories-screen";
import FinancialResumeHomeScreen from "@/components/component_screens/home_screen/financial-resume-home-screen";
import GreetingsHomeScreen from "@/components/component_screens/home_screen/greetings-home-screen";
import IncomeBreakdownScreen from "@/components/component_screens/home_screen/income-breakdown-screen";
import NewsHomeScreen from "@/components/component_screens/home_screen/news-home-screen";
import SavingsInvestmentsScreen from "@/components/component_screens/home_screen/savings-investments-screen";
import ScreenControllerHomeScreen from "@/components/component_screens/home_screen/screen-controller-home-screen";
import UILoader from "@/components/UI/UILoader";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import { ToastType } from "@/constants/constants.toast";
import { useAuth } from "@/context/auth-context";
import { useReferenceDate } from "@/context/reference-date-context";
import { useTargetBanks } from "@/context/target-bank-context";
import { useAppTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";
import { processTutorialPriorities } from "@/priorities/priorities.tutorial";
import { getHomeScreenAnalysisFromReferenceDate } from "@/service/service.analysis-screen";
import { getUserInfo } from "@/service/service.user";
import AuthResponse from "@/types/AuthResponse";
import HomeScreenAnalysisData from "@/types/HomeScreenAnalysisData";
import UserInfo from "@/types/UserInfo";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function HomeScreen() {
  const { isDark } = useAppTheme();
  const { authObject } = useAuth();
  const { showToast } = useToast();
  const { setSelectedBanks, selectedBanks } = useTargetBanks();
  const { referenceDate, getDateRangeByPeriod } = useReferenceDate();

  const [openTutorialModal, setOpenTutorialModal] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<null | HomeScreenAnalysisData>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function processScreenPriorities() {
      try {
        const userInfo: UserInfo | null = await getUserInfo(authObject);
        if(!userInfo) {
          showToast({
            message: "Não foi possível buscar as informações de usuário. Os processamentos de prioridades não foram executados.",
            type: ToastType.WARNING,
            duration: 10000
          })
          return;
        }
  
        processTutorialPriorities(userInfo, setOpenTutorialModal);
        setSelectedBanks(userInfo.connectedBanks);
  
        const dateRange = getDateRangeByPeriod('monthly');
        setAnalysis(await getHomeScreenAnalysisFromReferenceDate(
          userInfo.connectedBanks,
          referenceDate,
          authObject as AuthResponse,     
          true, 
          dateRange?.startDate,
          dateRange?.endDate
        ));
      } catch(err: any) {
        showToast({
          message: 'Ocorreu um erro inesperado ao obter os dados.',
          type: ToastType.ERROR,
          duration: 15000
        })
      } finally {
        setIsLoading(false);
      }
    } 

    processScreenPriorities();
  }, [isDark, authObject]);

  function HomeContent() {
    console.log("[Home] Renderizando HomeContent com análise:", analysis ? "disponível" : "indisponível");
    
    // Movendo os console.log para fora do JSX
    useEffect(() => {
      console.log("[Home] Antes de renderizar CurrentBalanceProjectionScreen");
      console.log("[Home] Antes de renderizar ExpenseCategoriesScreen");
      console.log("[Home] Antes de renderizar BudgetRealityScreen");
      console.log("[Home] Antes de renderizar IncomeBreakdownScreen");
      console.log("[Home] Antes de renderizar SavingsInvestmentsScreen");
      console.log("[Home] Antes de renderizar NewsHomeScreen");
      console.log("[Home] HomeContent renderizado completamente");
    }, []);
    
    // Adicionando logs para debug
    console.log("[Home] Verificando props dos componentes:");
    console.log("[Home] FinancialResumeHomeScreen props:", analysis?.financialSummary ? "dados presentes" : "dados ausentes");
    console.log("[Home] CurrentBalanceProjectionScreen props:", analysis?.currentBalanceProjection ? "dados presentes" : "dados ausentes");
    console.log("[Home] ExpenseCategoriesScreen props:", analysis?.expenseCategories ? "dados presentes" : "dados ausentes");
    console.log("[Home] BudgetRealityScreen props:", analysis?.budgetReality ? "dados presentes" : "dados ausentes");
    console.log("[Home] IncomeBreakdownScreen props:", analysis?.incomeBreakdown ? "dados presentes" : "dados ausentes");
    console.log("[Home] SavingsInvestmentsScreen props:", analysis?.savingsInvestments ? "dados presentes" : "dados ausentes");
    
    // Envolvendo cada componente em um try-catch para identificar qual está causando o erro
    const renderComponent = (Component: any, props: any, name: string) => {
      try {
        console.log(`[Home] Tentando renderizar ${name}`);
        return <Component {...props} />;
      } catch (error) {
        console.error(`[Home] Erro ao renderizar ${name}:`, error);
        return <Text>Erro ao renderizar {name}</Text>;
      }
    };
    
    return (
      <>
        {renderComponent(FinancialResumeHomeScreen, {analysis: analysis?.financialSummary}, "FinancialResumeHomeScreen")}
        {renderComponent(CurrentBalanceProjectionScreen, {analysis: analysis?.currentBalanceProjection}, "CurrentBalanceProjectionScreen")}
        {renderComponent(ExpenseCategoriesScreen, {analysis: analysis?.expenseCategories}, "ExpenseCategoriesScreen")}
        {renderComponent(BudgetRealityScreen, {analysis: analysis?.budgetReality}, "BudgetRealityScreen")}
        {renderComponent(IncomeBreakdownScreen, {analysis: analysis?.incomeBreakdown}, "IncomeBreakdownScreen")}
        {renderComponent(SavingsInvestmentsScreen, {analysis: analysis?.savingsInvestments}, "SavingsInvestmentsScreen")}
        {renderComponent(NewsHomeScreen, {}, "NewsHomeScreen")}
      </>
    )
  }

  return(
    <WRScreenContainer>
      <GreetingsHomeScreen />
      <ScreenControllerHomeScreen />
      
      {isLoading ? ( <UILoader message="Carregando dados..."/> ) : (<HomeContent/>) } 
    </WRScreenContainer>
  )

}