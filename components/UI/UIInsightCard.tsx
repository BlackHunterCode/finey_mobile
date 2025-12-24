import { useAppTheme } from '@/context/theme-context';
import { FinancialInsight } from '@/types/FinancialScore';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import WRText from '../wrappers/WRText';
import { useRouter } from 'expo-router';

/**
 * Propriedades do componente UIInsightCard
 */
interface InsightCardProps {
  insight: FinancialInsight;
  style?: ViewStyle;
}

/**
 * Componente de card para exibição de insights financeiros
 * @param insightCardProps Propriedades do componente
 * @returns React.JSX.Element
 */
export default function UIInsightCard({
  insight,
  style,
}: InsightCardProps) {
  const { theme } = useAppTheme();
  const router = useRouter();

  const handleActionPress = () => {
    if (insight.actionableLink) {
      //router.push(insight.actionableLink);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 18,
      marginVertical: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background + '40',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
      letterSpacing: -0.2,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.muted,
      marginBottom: 14,
      lineHeight: 22,
      flexWrap: 'wrap',
      fontWeight: '400',
    },
    actionButton: {
      backgroundColor: theme.colors.primary + '15',
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignSelf: 'flex-start',
      marginTop: 6,
    },
    actionText: {
      fontSize: 15,
      color: theme.colors.primary,
      fontWeight: '600',
      letterSpacing: -0.2,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <WRText>{insight.icon}</WRText>
        </View>
        <WRText style={styles.title}>{insight.title}</WRText>
      </View>

      <WRText style={styles.subtitle}>{insight.subtitle}</WRText>

      {insight.actionableText && (
        <TouchableOpacity style={styles.actionButton} onPress={handleActionPress}>
          <WRText style={styles.actionText}>{insight.actionableText}</WRText>
        </TouchableOpacity>
      )}
    </View>
  );
}