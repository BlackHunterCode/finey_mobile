import UICard from '@/components/UI/UICard';
import UIIcon from '@/components/UI/UIIcon';
import WRText from '@/components/wrappers/WRText';
import { useAppTheme } from '@/context/theme-context';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

/**
 * Componente que exibe as metas financeiras na tela de finanças
 * @returns React.JSX.Element
 */
export default function FinancialGoalsScreen() {
  const { theme } = useAppTheme();

  // Dados mockados para demonstração
  const goalsData = {
    progressoMedio: 44,
    metasConcluidas: 2,
    metasFoco: 1,
    metas: [
      {
        id: '1',
        titulo: 'Viagem para Europa',
        descricao: 'Comprar Euros, Passagem e Hospedagem',
        valorAtual: 8500.00,
        valorMeta: 15000.00,
        progresso: 57,
        mesesRestantes: 6,
        economizarPorMes: 812.50,
        icone: '✈️'
      },
      {
        id: '2',
        titulo: 'Fundo de Emergência',
        descricao: 'Reserva de segurança',
        valorAtual: 12300.00,
        valorMeta: 18000.00,
        progresso: 68,
        mesesRestantes: 2,
        economizarPorMes: 2850.00,
        icone: '💰',
        urgente: true
      },
      {
        id: '3',
        titulo: 'Carro Novo',
        descricao: 'Entrada para financiamento',
        valorAtual: 5200.00,
        valorMeta: 25000.00,
        progresso: 21,
        mesesRestantes: 14,
        economizarPorMes: 0,
        icone: '🚗'
      }
    ]
  };

  // Função para obter a cor baseada no progresso
  const getProgressColor = (progress: number) => {
    if (progress < 30) return theme.colors.error;
    if (progress < 70) return theme.colors.warning;
    return theme.colors.success;
  };

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    newButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: 'rgba(66, 133, 244, 0.1)',
    },
    newButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    cardsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      width: "100%"
    },
    card: {
      borderRadius: 12,
    },
    cardIconContainer: {
      marginBottom: 12,
    },
    cardIconBackground: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContent: {
      alignItems: 'flex-start',
    },
    cardTitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    cardValue: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    cardSubtitle: {
      fontSize: 12,
      color: '#757575',
      marginTop: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    transactionCard: {
      marginBottom: 12,
      padding: 16,
    },
    goalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    transactionIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    transactionDescription: {
      fontSize: 12,
      color: '#757575',
      marginTop: 2,
    },
    urgentTag: {
      backgroundColor: `${theme.colors.warning}20`,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    urgentText: {
      fontSize: 10,
      color: theme.colors.warning,
      fontWeight: 'bold',
    },
    goalValues: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    currentValue: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    targetValue: {
      fontSize: 14,
      color: '#757575',
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
      marginBottom: 8,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      borderRadius: 4,
    },
    goalMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    monthsRemaining: {
      fontSize: 12,
      color: '#757575',
    },
    progressPercentage: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    savingTip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `rgba(66, 133, 244, 0.1)`,
      padding: 8,
      borderRadius: 8,
      marginTop: 4,
    },
    savingTipText: {
      fontSize: 12,
      color: theme.colors.primary,
      marginLeft: 4,
    },
    viewAllButton: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <WRText style={styles.title}>Metas Financeiras</WRText>
        <TouchableOpacity style={styles.newButton}>
          <WRText style={[styles.newButtonText, { color: theme.colors.primary }]}>Nova</WRText>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <UICard width={"48%"} style={styles.card}>
          <View style={styles.cardIconContainer}>
            <View style={[styles.cardIconBackground, { backgroundColor: `${theme.colors.primary}20` }]}>
              <UIIcon name="stats-chart" size={20} color={theme.colors.primary} />
            </View>
          </View>
          <View style={styles.cardContent}>
            <WRText style={styles.cardTitle}>Progresso Médio</WRText>
            <WRText style={[styles.cardValue, { color: theme.colors.primary }]}>
              {goalsData.progressoMedio}%
            </WRText>
            <WRText style={styles.cardSubtitle}>{goalsData.metasConcluidas} concluídas</WRText>
          </View>
        </UICard>

        <UICard width={"48%"} style={styles.card}>
          <View style={styles.cardIconContainer}>
            <View style={[styles.cardIconBackground, { backgroundColor: `${theme.colors.warning}20` }]}>
              <UIIcon name="alert-circle" size={20} color={theme.colors.warning} />
            </View>
          </View>
          <View style={styles.cardContent}>
            <WRText style={styles.cardTitle}>Atenção</WRText>
            <WRText style={[styles.cardValue, { color: theme.colors.warning }]}>
              {goalsData.metasFoco}
            </WRText>
            <WRText style={styles.cardSubtitle}>precisam de foco</WRText>
          </View>
        </UICard>
      </View>

      <WRText style={styles.sectionTitle}>Suas Metas</WRText>

      {goalsData.metas.map((meta) => (
        <UICard key={meta.id} style={styles.transactionCard}>
          <View style={styles.goalHeader}>
            <View style={styles.transactionIcon}>
              <WRText>{meta.icone}</WRText> 
            </View>
            <View style={styles.transactionInfo}>
              <WRText style={styles.transactionTitle}>{meta.titulo}</WRText>
              <WRText style={styles.transactionDescription}>{meta.descricao}</WRText>
            </View>
            {meta.urgente && (
              <View style={styles.urgentTag}>
                <WRText style={styles.urgentText}>Urgente</WRText>
              </View>
            )}
          </View>
          
          <View style={styles.goalValues}>
            <WRText style={styles.currentValue}>R$ {meta.valorAtual.toFixed(2).replace('.', ',')}</WRText>
            <WRText style={styles.targetValue}>R$ {meta.valorMeta.toFixed(2).replace('.', ',')}</WRText>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${meta.progresso}%`, backgroundColor: getProgressColor(meta.progresso) }]} />
          </View>
          
          <View style={styles.goalMeta}>
            <WRText style={styles.monthsRemaining}>
              {meta.mesesRestantes > 0 ? `${meta.mesesRestantes} meses restantes` : ''}
            </WRText>
            <WRText style={styles.progressPercentage}>{meta.progresso}%</WRText>
          </View>
          
          {meta.economizarPorMes > 0 && (
            <View style={styles.savingTip}>
              <UIIcon name="trending-up" size={14} color={theme.colors.primary} />
              <WRText style={styles.savingTipText}>
                Economize R$ {meta.economizarPorMes.toFixed(2).replace('.', ',')} por mês para alcançar sua meta
              </WRText>
            </View>
          )}
        </UICard>
      ))}

      <TouchableOpacity style={styles.viewAllButton}>
        <WRText style={[styles.viewAllText, { color: theme.colors.primary }]}>Ver todas</WRText>
      </TouchableOpacity>
    </View>
  );
}