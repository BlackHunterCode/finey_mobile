import UICard from '@/components/UI/UICard';
import UIPageMan from '@/components/UI/UIPageMan';
import WRText from '@/components/wrappers/WRText';
import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * Componente de exemplo para demonstrar o uso do UIPageMan
 * @returns React.JSX.Element
 */
export default function UIPageManExample() {
  const { theme } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    tabContent: {
      padding: 0,
      gap: 16,
      marginRight: 20,
      marginVertical: 20
    },
    contentTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      color: theme.colors.text,
    },
    // Estilos para o card de score
    scoreContainer: {
      width: '100%',
    },
    scoreHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    scoreTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    scoreContent: {
      marginBottom: 24,
    },
    scoreValue: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    scoreMax: {
      fontSize: 16,
      color: theme.colors.muted,
    },
    scoreFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    scoreMetric: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
    },
    metricValue: {
      fontSize: 18,
      fontWeight: '600',
      marginVertical: 4,
    },
    metricLabel: {
      fontSize: 12,
      color: theme.colors.muted,
    },
    // Estilos para o card de insights
    insightsCard: {
      marginTop: 16,
    },
    insightsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    insightsTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    insightItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    insightIcon: {
      marginRight: 12,
    },
    insightContent: {
      flex: 1,
    },
    insightTitle: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
    },
    insightDescription: {
      fontSize: 14,
      color: theme.colors.muted,
    },
    // Estilos para transações
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    transactionContent: {
      flex: 1,
    },
    transactionTitle: {
      fontSize: 16,
      fontWeight: '500',
    },
    transactionDate: {
      fontSize: 14,
      color: theme.colors.muted,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: '600',
    },
    // Estilos para investimentos
    investmentSummary: {
      marginBottom: 24,
    },
    investmentTotal: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    investmentChange: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    investmentChangeText: {
      fontSize: 14,
      color: '#4CAF50',
      marginLeft: 4,
    },
    investmentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    investmentIcon: {
      marginRight: 12,
    },
    investmentIconBg: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    investmentContent: {
      flex: 1,
    },
    investmentTitle: {
      fontSize: 16,
      fontWeight: '500',
    },
    investmentValue: {
      fontSize: 14,
      color: theme.colors.muted,
    },
    investmentReturn: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    investmentReturnText: {
      fontSize: 14,
      color: '#4CAF50',
      marginLeft: 4,
    },
  });
 
  
  // Exemplo de conteúdo para as tabs - Visão Geral
  const OverviewTab = () => (
    <View style={styles.tabContent}>
      <UICard fullWidth>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreHeader}>
            <WRText style={styles.scoreTitle}>Seu Score Financeiro</WRText>
            <Ionicons name="star-outline" size={24} color={theme.colors.primary} />
          </View>
          
          <View style={styles.scoreContent}>
            <WRText style={styles.scoreValue}>8.5</WRText>
            <WRText style={styles.scoreMax}>de 10.0</WRText>
          </View>
          
          <View style={styles.scoreFooter}>
            <View style={styles.scoreMetric}>
              <Ionicons name="flash-outline" size={18} color={theme.colors.text} />
              <WRText style={styles.metricValue}>23</WRText>
              <WRText style={styles.metricLabel}>dias de controle</WRText>
            </View>
            
            <View style={styles.scoreMetric}>
              <Ionicons name="trending-up" size={18} color="#4CAF50" />
              <WRText style={[styles.metricValue, { color: '#4CAF50' }]}>+12%</WRText>
              <WRText style={styles.metricLabel}>melhoria</WRText>
            </View>
          </View>
        </View>
      </UICard>
      
      <UICard fullWidth style={styles.insightsCard}>
        <View style={styles.insightsHeader}>
          <WRText style={styles.insightsTitle}>Insights Para Você</WRText>
          <Ionicons name="star-outline" size={24} color={theme.colors.primary} />
        </View>
        
        <View style={styles.insightItem}>
          <View style={styles.insightIcon}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          </View>
          <View style={styles.insightContent}>
            <WRText style={styles.insightTitle}>Você está no caminho certo!</WRText>
            <WRText style={styles.insightDescription}>Seus gastos estão 12% abaixo da meta este mês</WRText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
        </View>
        
        <View style={styles.insightItem}>
          <View style={styles.insightIcon}>
            <Ionicons name="bulb-outline" size={24} color="#FFC107" />
          </View>
          <View style={styles.insightContent}>
            <WRText style={styles.insightTitle}>Dica da semana</WRText>
            <WRText style={styles.insightDescription}>Considere investir mais R$ 300 em ações para diversificar</WRText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
        </View>
      </UICard>
    </View>
  );
  
  // Exemplo de conteúdo para as tabs - Transações
  const TransactionsTab = () => (
    <View style={styles.tabContent}>
      <UICard fullWidth>
        <WRText style={styles.contentTitle}>Transações Recentes</WRText>
        
        <View style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <Ionicons name="cart-outline" size={24} color={theme.colors.text} />
          </View>
          <View style={styles.transactionContent}>
            <WRText style={styles.transactionTitle}>Supermercado</WRText>
            <WRText style={styles.transactionDate}>Hoje, 14:30</WRText>
          </View>
          <WRText style={styles.transactionAmount}>-R$ 156,75</WRText>
        </View>
        
        <View style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <Ionicons name="restaurant-outline" size={24} color={theme.colors.text} />
          </View>
          <View style={styles.transactionContent}>
            <WRText style={styles.transactionTitle}>Restaurante</WRText>
            <WRText style={styles.transactionDate}>Ontem, 20:15</WRText>
          </View>
          <WRText style={styles.transactionAmount}>-R$ 89,90</WRText>
        </View>
        
        <View style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <Ionicons name="cash-outline" size={24} color="#4CAF50" />
          </View>
          <View style={styles.transactionContent}>
            <WRText style={styles.transactionTitle}>Salário</WRText>
            <WRText style={styles.transactionDate}>15/05/2023</WRText>
          </View>
          <WRText style={[styles.transactionAmount, { color: '#4CAF50' }]}>+R$ 3.500,00</WRText>
        </View>
      </UICard>
    </View>
  );
  
  // Exemplo de conteúdo para as tabs - Investimentos
  const InvestmentsTab = () => (
    <View style={styles.tabContent}>
      <UICard fullWidth>
        <WRText style={styles.contentTitle}>Seus Investimentos</WRText>
        
        <View style={styles.investmentSummary}>
          <WRText style={styles.investmentTotal}>R$ 15.750,00</WRText>
          <View style={styles.investmentChange}>
            <Ionicons name="trending-up" size={16} color="#4CAF50" />
            <WRText style={styles.investmentChangeText}>+2,3% este mês</WRText>
          </View>
        </View>
        
        <View style={styles.investmentItem}>
          <View style={styles.investmentIcon}>
            <View style={[styles.investmentIconBg, { backgroundColor: '#6823D1' }]}>
              <Ionicons name="pie-chart-outline" size={20} color="#fff" />
            </View>
          </View>
          <View style={styles.investmentContent}>
            <WRText style={styles.investmentTitle}>Fundos</WRText>
            <WRText style={styles.investmentValue}>R$ 8.500,00</WRText>
          </View>
          <View style={styles.investmentReturn}>
            <Ionicons name="trending-up" size={16} color="#4CAF50" />
            <WRText style={styles.investmentReturnText}>+3,2%</WRText>
          </View>
        </View>
        
        <View style={styles.investmentItem}>
          <View style={styles.investmentIcon}>
            <View style={[styles.investmentIconBg, { backgroundColor: '#FB8915' }]}>
              <Ionicons name="business-outline" size={20} color="#fff" />
            </View>
          </View>
          <View style={styles.investmentContent}>
            <WRText style={styles.investmentTitle}>Ações</WRText>
            <WRText style={styles.investmentValue}>R$ 4.250,00</WRText>
          </View>
          <View style={styles.investmentReturn}>
            <Ionicons name="trending-up" size={16} color="#4CAF50" />
            <WRText style={styles.investmentReturnText}>+1,8%</WRText>
          </View>
        </View>
        
        <View style={styles.investmentItem}>
          <View style={styles.investmentIcon}>
            <View style={[styles.investmentIconBg, { backgroundColor: '#3E77E3' }]}>
              <Ionicons name="cash-outline" size={20} color="#fff" />
            </View>
          </View>
          <View style={styles.investmentContent}>
            <WRText style={styles.investmentTitle}>Renda Fixa</WRText>
            <WRText style={styles.investmentValue}>R$ 3.000,00</WRText>
          </View>
          <View style={styles.investmentReturn}>
            <Ionicons name="trending-up" size={16} color="#4CAF50" />
            <WRText style={styles.investmentReturnText}>+0,8%</WRText>
          </View>
        </View>
      </UICard>
    </View>
  );
  
  // Definição das tabs
  const tabs = [
    {
      id: 'overview',
      title: 'Visão Geral',
      content: <OverviewTab />,
    },
    {
      id: 'transactions',
      title: 'Transações',
      content: <TransactionsTab />,
    },
    {
      id: 'investments',
      title: 'Investimentos',
      content: <InvestmentsTab />,
    },
    {
      id: 'analytics',
      title: 'Análises',
      content: <View style={styles.tabContent}><UICard><WRText>Conteúdo de Análises</WRText></UICard></View>,
    },
  ];
   
  return (
    <View style={styles.container}>
      <UIPageMan 
        tabs={tabs}
        initialTabId="overview"
        onTabChange={(tabId) => console.log(`Tab changed to: ${tabId}`)}
      />
    </View>
  );
}