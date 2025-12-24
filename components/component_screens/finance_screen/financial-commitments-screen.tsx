import UICard from '@/components/UI/UICard';
import UIIcon from '@/components/UI/UIIcon';
import WRText from '@/components/wrappers/WRText';
import { useAppTheme } from '@/context/theme-context';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

/**
 * Componente que exibe os compromissos financeiros na tela de finanças
 * @returns React.JSX.Element
 */
export default function FinancialCommitmentsScreen() {
  const { theme } = useAppTheme();

  // Dados mockados para demonstração
  const commitmentData = {
    totalMensal: 2254.80,
    proximosSeteDias: 1,
    agenda: [
      {
        id: '1',
        titulo: 'Aluguel',
        descricao: 'Pagamento mensal do apartamento',
        categoria: 'Moradia',
        valor: 1800.00,
        vencimento: '04/11/2023',
        agendadoDias: 5
      },
      {
        id: '2',
        titulo: 'Academia',
        descricao: 'Mensalidade Smart Fit',
        categoria: 'Saúde',
        valor: 89.90,
        vencimento: '09/11/2023',
        agendadoDias: 10
      },
      {
        id: '3',
        titulo: 'Internet',
        descricao: 'Vivo Fibra 300MB',
        categoria: 'Utilidades',
        valor: 119.90,
        vencimento: '14/11/2023',
        agendadoDias: 15
      }
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <WRText style={styles.title}>Compromissos Financeiros</WRText>
        <TouchableOpacity style={styles.newButton}>
          <WRText style={[styles.newButtonText, { color: theme.colors.primary }]}>Novo</WRText>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <UICard width={"48%"}>
          <View style={styles.cardIconContainer}>
            <View style={[styles.cardIconBackground, { backgroundColor: `${theme.colors.error}20` }]}>
              <UIIcon name="cash-outline" size={20} color={theme.colors.error} />
            </View>
          </View>
          <View style={styles.cardContent}>
            <WRText style={styles.cardTitle}>Total Mensal</WRText>
            <WRText style={[styles.cardValue, { color: theme.colors.error }]}>
              -R$ {commitmentData.totalMensal.toFixed(2).replace('.', ',')}
            </WRText>
          </View>
        </UICard>

        <UICard width={"48%"} style={[styles.nextDaysCard]}>
          <View style={styles.cardIconContainer}>
            <View style={[styles.cardIconBackground, { backgroundColor: `${theme.colors.primary}20` }]}>
              <UIIcon name="calendar" size={20} color={theme.colors.primary} />
            </View>
          </View>
          <View style={styles.cardContent}>
            <WRText style={styles.cardTitle}>Próximos 7 dias</WRText>
            <WRText style={styles.cardValue}>
              {commitmentData.proximosSeteDias}
              <WRText style={styles.nextDaysLabel}> compromissos</WRText>
            </WRText>
          </View>
        </UICard>
      </View>

      <WRText style={styles.sectionTitle}>Agenda</WRText>

      {commitmentData.agenda.map((commitment) => (
        <UICard key={commitment.id} style={styles.transactionCard}>
          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <UIIcon name="calendar" size={16} color={theme.colors.primary} />
            </View>
            <View style={styles.transactionInfo}>
              <WRText style={styles.transactionTitle}>{commitment.titulo}</WRText>
              <WRText style={styles.transactionDescription}>{commitment.descricao}</WRText>
              
              <View style={styles.transactionMeta}>
                <WRText style={styles.transactionDate}>Vencimento: {commitment.vencimento}</WRText>
                <WRText style={styles.transactionCategory}>{commitment.categoria}</WRText>
              </View>
            </View>
            <WRText style={[styles.transactionValue, { color: theme.colors.error }]}>
              -R$ {commitment.valor.toFixed(2).replace('.', ',')}
            </WRText>
          </View>
        </UICard>
      ))}

      <TouchableOpacity style={styles.viewAllButton}>
        <WRText style={[styles.viewAllText, { color: theme.colors.primary }]}>Ver todos (4)</WRText>
      </TouchableOpacity>
    </View>
  );
}

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
  nextDaysCard: {
    backgroundColor: '#FFFFFF',
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
  nextDaysLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  transactionCard: {
    marginBottom: 8,
    padding: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  transactionMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#757575',
    marginRight: 8,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#757575',
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: 'bold',
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