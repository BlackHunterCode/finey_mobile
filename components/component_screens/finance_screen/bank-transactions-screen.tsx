import UICard from '@/components/UI/UICard';
import UIIcon from '@/components/UI/UIIcon';
import WRText from '@/components/wrappers/WRText';
import { useAppTheme } from '@/context/theme-context';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

/**
 * Componente que exibe as transações bancárias na tela de finanças
 * @returns React.JSX.Element
 */
export default function BankTransactionsScreen() {
  const { theme } = useAppTheme();

  // Dados mockados para demonstração
  const transactionData = {
    entradas: 5750.00,
    saidas: 549.20,
    pendentes: 1,
    maiorGasto: 342.50,
    recentes: [
      {
        id: '1',
        tipo: 'entrada',
        descricao: 'Salário - Empresa XYZ',
        data: '24/10/2023',
        categoria: 'Salário',
        valor: 5500.00
      },
      {
        id: '2',
        tipo: 'saida',
        descricao: 'Supermercado Pão de Açúcar',
        data: '27/10/2023',
        categoria: 'Alimentação',
        valor: 342.50
      },
      {
        id: '3',
        tipo: 'saida',
        descricao: 'Netflix Assinatura',
        data: '28/10/2023',
        categoria: 'Entretenimento',
        valor: 49.90
      }
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <WRText style={styles.title}>Transações Bancárias</WRText>
        <TouchableOpacity style={styles.newButton}>
          <WRText style={[styles.newButtonText, { color: theme.colors.primary }]}>Nova</WRText>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <UICard width={"48%"}>
          <View style={styles.cardIconContainer}>
            <View style={[styles.cardIconBackground, { backgroundColor: `${theme.colors.success}20` }]}>
              <UIIcon name="arrow-down" size={20} color={theme.colors.success} />
            </View>
          </View>
          <View style={styles.cardContent}>
            <WRText style={styles.cardTitle}>Entradas</WRText>
            <WRText style={[styles.cardValue, { color: theme.colors.success }]}>
              R$ {transactionData.entradas.toFixed(2).replace('.', ',')}
            </WRText>
          </View>
        </UICard>

        <UICard width={"48%"} >
          <View style={styles.cardIconContainer}>
            <View style={[styles.cardIconBackground, { backgroundColor: `${theme.colors.error}20` }]}>
              <UIIcon name="arrow-up" size={20} color={theme.colors.error} />
            </View>
          </View>
          <View style={styles.cardContent}>
            <WRText style={styles.cardTitle}>Saídas</WRText>
            <WRText style={[styles.cardValue, { color: theme.colors.error }]}>
              -R$ {transactionData.saidas.toFixed(2).replace('.', ',')}
            </WRText>
          </View>
        </UICard>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <UIIcon name="time-outline" size={16} color={theme.colors.text} />
          <WRText style={styles.infoLabel}>Pendentes</WRText>
          <WRText style={styles.infoValue}>{transactionData.pendentes}</WRText>
        </View>

        <View style={styles.infoItem}>
          <UIIcon name="trending-up" size={16} color={theme.colors.error} />
          <WRText style={styles.infoLabel}>Maior Gasto</WRText>
          <WRText style={[styles.infoValue, { color: theme.colors.error }]}>
            -R$ {transactionData.maiorGasto.toFixed(2).replace('.', ',')}
          </WRText>
        </View>
      </View>

      <WRText style={styles.sectionTitle}>Recentes</WRText>

      {transactionData.recentes.map((transaction, index) => (
        <UICard key={transaction.id} style={styles.transactionCard}>
          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <UIIcon 
                name={transaction.tipo === 'entrada' ? 'arrow-down' : 'arrow-up'} 
                size={16} 
                color={transaction.tipo === 'entrada' ? theme.colors.success : theme.colors.error} 
              />
            </View>
            <View style={styles.transactionInfo}>
              <WRText style={styles.transactionTitle}>{transaction.descricao}</WRText>
              <View style={styles.transactionMeta}>
                <WRText style={styles.transactionDate}>{transaction.data}</WRText>
                <WRText style={styles.transactionCategory}>{transaction.categoria}</WRText>
              </View>
            </View>
            <WRText 
              style={[
                styles.transactionValue, 
                { color: transaction.tipo === 'entrada' ? theme.colors.success : theme.colors.error }
              ]}
            >
              {transaction.tipo === 'entrada' ? 'R$ ' : '-R$ '}
              {transaction.valor.toFixed(2).replace('.', ',')}
            </WRText>
          </View>
        </UICard>
      ))}

      <TouchableOpacity style={styles.viewAllButton}>
        <WRText style={[styles.viewAllText, { color: theme.colors.primary }]}>Ver todas (5)</WRText>
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
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  incomeCard: {
    backgroundColor: '#FFFFFF',
  },
  expenseCard: {
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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    marginLeft: 4,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
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