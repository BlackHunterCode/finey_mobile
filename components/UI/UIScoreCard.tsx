import { useAppTheme } from '@/context/theme-context';
import FinancialScore from '@/types/FinancialScore';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import WRText from '../wrappers/WRText';
import UICard from './UICard';

/**
 * Propriedades do componente UIScoreCard
 */
interface ScoreCardProps {
  financialScore?: FinancialScore | null;
  score?: number;
  maxScore?: number;
  title?: string;
  subtitle?: string;
  stats?: {
    days?: number;
    improvement?: number;
  };
  style?: ViewStyle;
}

/**
 * Componente de card para exibição de score financeiro
 * @param scoreCardProps Propriedades do componente
 * @returns React.JSX.Element
 */
export default function UIScoreCard({
  financialScore,
  score,
  maxScore = 100.0,
  title = 'Seu Score Financeiro',
  subtitle,
  stats,
  style,
}: ScoreCardProps) {
  const { theme } = useAppTheme();
  
  // Usa os dados do FinancialScore se disponíveis, caso contrário usa os valores padrão
  const scoreValue = financialScore ? parseFloat(financialScore.score.toString()) : (score || 0);
  const details = financialScore?.details;
  const percentage = financialScore?.percentage;
  const period = financialScore?.period;
  
  // Formata o período para exibição mais amigável
  const formatPeriod = (periodStr?: String) => {
    if (!periodStr) return '';
    
    try {
      const [startDate, endDate] = periodStr.toString().split(' - ');
      if (!startDate || !endDate) return periodStr;
      
      const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      };
      
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } catch (error) {
      return periodStr;
    }
  };
  
  // Determina a cor do score baseado no valor
  const getScoreColor = () => {
    if (scoreValue >= maxScore * 0.8) return theme.colors.success;
    if (scoreValue >= maxScore * 0.6) return theme.colors.primary;
    if (scoreValue >= maxScore * 0.4) return theme.colors.warning;
    return theme.colors.danger;
  };

  // Determina o texto de status (top %)
  const getTopStatus = () => {
    if (percentage) return `Top ${percentage}`;
    if (scoreValue >= maxScore * 0.85) return 'Top 15%';
    if (scoreValue >= maxScore * 0.7) return 'Top 30%';
    if (scoreValue >= maxScore * 0.5) return 'Top 50%';
    return '';
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 20,
      marginVertical: 10
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    starIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scoreContainer: {
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    scoreValueContainer: {
      flex: 1,
      marginRight: 10,
    },
    scoreValue: {
      fontSize: 42,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    maxScore: {
      fontSize: 16,
      color: theme.colors.muted,
      marginTop: 2,
      fontWeight: '500',
    },
    periodContainer: {
      backgroundColor: theme.colors.background + '30',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      alignSelf: 'flex-start',
      marginBottom: 10,
    },
    periodText: {
      fontSize: 13,
      color: theme.colors.muted,
      fontWeight: '500',
      letterSpacing: 0.2,
    },
    detailsContainer: {
      marginVertical: 12,
      backgroundColor: theme.colors.background + '30',
      borderRadius: 12,
      padding: 16,
      width: '100%',
    },
    detailsText: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 22,
      flexWrap: 'wrap',
      fontWeight: '400',
      flexShrink: 1,
    },
    topStatusContainer: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    topStatusText: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    usersComparisonText: {
      fontSize: 12,
      color: theme.colors.muted,
      fontWeight: '400',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 12,
    },
    statItem: {
      flex: 1,
      backgroundColor: theme.colors.background + '40',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
    },
    improvementStat: {
      marginLeft: 12,
    },
    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.muted,
      textAlign: 'center',
    },
  });

  return (
    <UICard activeAccordion accordionBeOpenDefault accordionTitle={title}>
      <View style={styles.header}>
        {period ? (
          <View style={styles.periodContainer}>
            <WRText style={styles.periodText}>
              📅 {formatPeriod(period)}
            </WRText>
          </View>
        ) : (<></>)}
        <View style={styles.starIcon}>
          <WRText>⭐</WRText>
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.scoreValueContainer}>
          <WRText style={[styles.scoreValue, { color: getScoreColor() }]}>
            {scoreValue.toFixed(1)}
          </WRText>
          <WRText style={styles.maxScore}>de {maxScore.toFixed(1)}</WRText>
        </View>
      </View>

      {details ? (
        <UICard activeAccordion accordionTitle='Detalhes' style={styles.detailsContainer}>
          <WRText numberOfLines={0} style={styles.detailsText}>
            {details}
          </WRText>
        </UICard>
      ) : (<></>)}

      {financialScore?.daysOfControl !== undefined ? (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
              <WRText style={styles.statValue}>⚡ {financialScore?.daysOfControl}</WRText>
              <WRText style={styles.statLabel}>dias de controle</WRText>
          </View>
          
          {financialScore?.percentage !== undefined && (
            <View style={[styles.statItem, styles.improvementStat]}>
              <WRText style={[styles.statValue, { color: theme.colors.success }]}>
                📈 +{financialScore?.percentage}%
              </WRText>
              <WRText style={styles.statLabel}>melhoria</WRText>
            </View>
          )}
        </View>
      ) : (<></>)}
    </UICard>
  );
}

