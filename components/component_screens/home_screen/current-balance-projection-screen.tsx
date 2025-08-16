import UICard from "@/components/UI/UICard";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { useTotalTransactionPeriod } from "@/context/transaction/total-transaction-period-context";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function CurrentBalanceProjectionScreen() {
    const { theme } = useAppTheme();
    const { totalTransactionPeriod } = useTotalTransactionPeriod();
    
    // Estados para os dados de saldo e projeção
    const [currentBalance, setCurrentBalance] = useState(0);
    const [projectedBalance, setProjectedBalance] = useState(0);
    const [daysLeftInMonth, setDaysLeftInMonth] = useState(0);
    const [dailyAvgExpense, setDailyAvgExpense] = useState(0);
    
    useEffect(() => {
        // Calcular dias restantes no mês
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const daysLeft = lastDayOfMonth - today.getDate();
        setDaysLeftInMonth(daysLeft);
        
        // Calcular saldo atual (ganhos - gastos)
        const balance = (totalTransactionPeriod?.totalEarnings || 0) - (totalTransactionPeriod?.totalExpenses || 0);
        setCurrentBalance(balance);
        
        // Calcular média diária de gastos
        const daysPassed = today.getDate();
        const avgDailyExpense = daysPassed > 0 ? (totalTransactionPeriod?.totalExpenses || 0) / daysPassed : 0;
        setDailyAvgExpense(avgDailyExpense);
        
        // Projetar saldo para o fim do mês
        const projectedExpenses = avgDailyExpense * daysLeft;
        const projected = balance - projectedExpenses;
        setProjectedBalance(projected);
    }, [totalTransactionPeriod]);
    
    const styles = StyleSheet.create({
        mainCard: {
            marginBottom: 10
        },
        container: {
            width: '100%'
        },
        balanceRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
        },
        balanceColumn: {
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: theme.colors.card,
            marginHorizontal: 4
        },
        balanceTitle: {
            fontSize: 14,
            color: theme.colors.text,
            marginBottom: 8
        },
        balanceValue: {
            fontSize: 20,
            fontWeight: '600',
            color: theme.colors.text
        },
        positiveBalance: {
            color: '#00C853'
        },
        negativeBalance: {
            color: '#FF5252'
        },
        projectionInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8
        },
        infoIcon: {
            marginRight: 8
        },
        infoText: {
            fontSize: 12,
            color: theme.colors.muted
        },
        projectionCard: {
            padding: 12,
            borderRadius: 8,
            backgroundColor: theme.colors.card,
            marginBottom: 16
        },
        projectionTitle: {
            fontSize: 14,
            color: theme.colors.text,
            marginBottom: 8
        },
        projectionRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
        },
        projectionLabel: {
            fontSize: 12,
            color: theme.colors.muted
        },
        projectionValue: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text
        }
    });

    return (
        <UICard
            style={styles.mainCard}
            activeAccordion
            accordionTitle="Saldo atual e projeção"
            accordionBeOpenDefault
        >
            <View style={styles.container}>
                <View style={styles.balanceRow}>
                    <View style={styles.balanceColumn}>
                        <WRText style={styles.balanceTitle}>Saldo atual</WRText>
                        <WRText style={[
                            styles.balanceValue,
                            currentBalance > 0 ? styles.positiveBalance : 
                            currentBalance < 0 ? styles.negativeBalance : null
                        ]}>
                            R$ {currentBalance.toFixed(2)}
                        </WRText>
                    </View>
                    
                    <View style={styles.balanceColumn}>
                        <WRText style={styles.balanceTitle}>Projeção para o fim do mês</WRText>
                        <WRText style={[
                            styles.balanceValue,
                            projectedBalance > 0 ? styles.positiveBalance : 
                            projectedBalance < 0 ? styles.negativeBalance : null
                        ]}>
                            R$ {projectedBalance.toFixed(2)}
                        </WRText>
                    </View>
                </View>
                
                <View style={styles.projectionInfo}>
                    <UIIcon name="information-circle-outline" size={16} color={theme.colors.muted} style={styles.infoIcon} />
                    <WRText style={styles.infoText}>
                        Projeção baseada nos seus gastos médios diários deste mês
                    </WRText>
                </View>
                
                <View style={styles.projectionCard}>
                    <WRText style={styles.projectionTitle}>Detalhes da projeção</WRText>
                    
                    <View style={styles.projectionRow}>
                        <WRText style={styles.projectionLabel}>Dias restantes no mês</WRText>
                        <WRText style={styles.projectionValue}>{daysLeftInMonth} dias</WRText>
                    </View>
                    
                    <View style={styles.projectionRow}>
                        <WRText style={styles.projectionLabel}>Gasto médio diário</WRText>
                        <WRText style={styles.projectionValue}>R$ {dailyAvgExpense.toFixed(2)}/dia</WRText>
                    </View>
                    
                    <View style={styles.projectionRow}>
                        <WRText style={styles.projectionLabel}>Gasto projetado até o fim do mês</WRText>
                        <WRText style={styles.projectionValue}>R$ {(dailyAvgExpense * daysLeftInMonth).toFixed(2)}</WRText>
                    </View>
                </View>
            </View>
        </UICard>
    );
}