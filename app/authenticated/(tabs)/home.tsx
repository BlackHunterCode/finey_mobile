/**
 *  2025 Finey - Todos os Direitos Reservados.
 * 
 * Tela Home.
 */

import BudgetRealityScreen from "@/components/component_screens/home_screen/analysis/budget-reality-screen";
import CurrentBalanceProjectionScreen from "@/components/component_screens/home_screen/analysis/current-balance-projection-screen";
import ExpenseCategoriesScreen from "@/components/component_screens/home_screen/analysis/expense-categories-screen";
import FinancialResumeHomeScreen from "@/components/component_screens/home_screen/analysis/financial-resume-home-screen";
import GreetingsHomeScreen from "@/components/component_screens/home_screen/analysis/greetings-home-screen";
import IncomeBreakdownScreen from "@/components/component_screens/home_screen/analysis/income-breakdown-screen";
import NewsHomeScreen from "@/components/component_screens/home_screen/analysis/news-home-screen";
import SavingsInvestmentsScreen from "@/components/component_screens/home_screen/analysis/savings-investments-screen";
import ScreenControllerHomeScreen from "@/components/component_screens/home_screen/analysis/screen-controller-home-screen";
import UIInsightCard from "@/components/UI/UIInsightCard";
import UILoader from "@/components/UI/UILoader";
import UIPageMan, { TabItem } from "@/components/UI/UIPageMan";
import UIScoreCard from "@/components/UI/UIScoreCard";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { ToastType } from "@/constants/constants.toast";
import { useAuth } from "@/context/auth-context";
import { useReferenceDate } from "@/context/reference-date-context";
import { useTargetBanks } from "@/context/target-bank-context";
import { useAppTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";
import { processTutorialPriorities } from "@/priorities/priorities.tutorial";
import { getFinancialScoreAnalysisFromReferenceDate } from "@/service/service.analysis";
import { getUserInfo } from "@/service/service.user";
import { AppTheme } from "@/theme/theme";
import AuthResponse from "@/types/AuthResponse";
import FinancialScore from "@/types/FinancialScore";
import HomeScreenAnalysisData from "@/types/HomeScreenAnalysisData";
import UserInfo from "@/types/UserInfo";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { theme, isDark } = useAppTheme();
  const { authObject } = useAuth();
  const { showToast } = useToast();
  const { setSelectedBanks } = useTargetBanks();
  const { referenceDate, getDateRangeByPeriod } = useReferenceDate();

  const [openTutorialModal, setOpenTutorialModal] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<null | HomeScreenAnalysisData>(null);
  const [financialScore, setFinancialScore] = useState<null | FinancialScore>(null);
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
        /*setAnalysis(await getHomeScreenAnalysisFromReferenceDate(
          userInfo.connectedBanks,
          referenceDate,
          authObject as AuthResponse,     
          true, 
          dateRange?.startDate,
          dateRange?.endDate
        ));*/

        setFinancialScore(await getFinancialScoreAnalysisFromReferenceDate(
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
    // Envolvendo cada componente em um try-catch para identificar qual está causando o erro
    const renderComponent = (Component: any, props: any, name: string) => {
      try {
        return <Component {...props} />;
      } catch (error) {
        return <Text>Erro ao renderizar {name}</Text>;
      }
    };
    
    return (
      <View style={{ gap: 16 }}>
        {renderComponent(FinancialResumeHomeScreen, {analysis: analysis?.financialSummary}, "FinancialResumeHomeScreen")}
        {renderComponent(CurrentBalanceProjectionScreen, {analysis: analysis?.currentBalanceProjection}, "CurrentBalanceProjectionScreen")}
        {renderComponent(ExpenseCategoriesScreen, {analysis: analysis?.expenseCategories}, "ExpenseCategoriesScreen")}
        {renderComponent(BudgetRealityScreen, {analysis: analysis?.budgetReality}, "BudgetRealityScreen")}
        {renderComponent(IncomeBreakdownScreen, {analysis: analysis?.incomeBreakdown}, "IncomeBreakdownScreen")}
        {renderComponent(SavingsInvestmentsScreen, {analysis: analysis?.savingsInvestments}, "SavingsInvestmentsScreen")}
        {renderComponent(NewsHomeScreen, {}, "NewsHomeScreen")}
      </View>
    )
  }

  function AnalysisPage({ theme }: { theme: AppTheme }) {
    return (
      <View style={[style.tabContent, { flex: 1, height: '100%' }]}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <UILoader message="Carregando dados..."/>
          </View>
        ) : (
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            bounces={true}
          >
            <WRText style={{ textAlign: 'center', fontWeight: 'bold', marginVertical: 16 }}>Decidindo que será aqui...</WRText>
            <ActivityIndicator color={theme.colors.primary} />
          </ScrollView>
        )}
      </View>
    )
  }

  function ForYouPage () {
    return (
      <View style={[style.tabContent, { flex: 1 }]}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <UILoader message="Carregando dados..."/>
          </View>
        ) : (
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            bounces={true}
          >
            <GreetingsHomeScreen />

            <UIScoreCard 
              financialScore={financialScore}
              maxScore={100.0}
              title={"Seu Score Financeiro"}
              stats={{
                days: 23,
                improvement: 12
              }}
            />
            
            {financialScore?.insights && financialScore.insights.length > 0 && (
              <>
                <WRText style={{ fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>Insights Para Você</WRText>
                {financialScore.insights.map((insight, index) => (
                  <UIInsightCard key={`insight-${index}`} insight={insight} />
                ))}
              </>
            )}
          </ScrollView>
        )}
      </View>
    )
  }

  const tabs: TabItem[] = [
    {
      id: 'foryou',
      title: 'For you 💜',
      content: <ForYouPage />
    },
    {
      id: 'analysis',
      title: 'Analysis 🔎',
      content: <AnalysisPage theme={theme} />
    },
  ]

  return(
    <>
      <WRScreenContainer asView={true} style={{ flex: 1 }}>
        <ScreenControllerHomeScreen />
     
        <UIPageMan 
          tabs={tabs}
          initialTabId="foryou"
          onTabChange={(tabId) => console.log(`Tab changed to: ${tabId}`)}
          centerTabs
          style={{ flex: 1 }}
        />
    
      </WRScreenContainer>
    </>

  )
}

const style = StyleSheet.create({
  tabContent: {
     gap: 16,
     marginRight: 18,
     flex: 1
  }
})
