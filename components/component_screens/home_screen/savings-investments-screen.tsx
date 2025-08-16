import UICard from "@/components/UI/UICard";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface Investment {
    type: string;
    amount: number;
    return: {
        value: number;
        percentage: number;
        isPositive: boolean;
    };
    icon: React.ComponentProps<typeof Ionicons>['name'];
}

export default function SavingsInvestmentsScreen() {
    const { theme } = useAppTheme();
    
    // Estado para controlar a visibilidade dos valores
    const [showValues, setShowValues] = useState(false);
    
    // Dados mockados para os investimentos
    // Em uma implementação real, esses dados viriam da API
    const [investments, setInvestments] = useState<Investment[]>([
        {
            type: "Renda Fixa",
            amount: 15000,
            return: {
                value: 120,
                percentage: 0.8,
                isPositive: true
            },
            icon: "lock-closed"
        },
        {
            type: "Ações",
            amount: 8000,
            return: {
                value: -200,
                percentage: 2.5,
                isPositive: false
            },
            icon: "stats-chart"
        },
        {
            type: "Fundos",
            amount: 5000,
            return: {
                value: 75,
                percentage: 1.5,
                isPositive: true
            },
            icon: "people"
        }
    ]);
    
    // Calcular totais
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturn = investments.reduce((sum, inv) => sum + inv.return.value, 0);
    const totalReturnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
    const isPositiveReturn = totalReturn >= 0;
    
    const styles = StyleSheet.create({
        mainCard: {
            marginBottom: 10
        },
        container: {
            width: '100%'
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
        },
        totalContainer: {
            flex: 1
        },
        totalLabel: {
            fontSize: 14,
            color: theme.colors.muted
        },
        totalValueRow: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        totalValue: {
            fontSize: 24,
            fontWeight: '600',
            color: theme.colors.text
        },
        hiddenValue: {
            fontSize: 24,
            letterSpacing: 2
        },
        visibilityButton: {
            padding: 8
        },
        returnContainer: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16
        },
        returnRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        returnLabel: {
            fontSize: 14,
            color: theme.colors.text
        },
        returnValue: {
            fontSize: 16,
            fontWeight: '500'
        },
        positiveReturn: {
            color: '#00C853'
        },
        negativeReturn: {
            color: '#FF5252'
        },
        investmentsList: {
            marginTop: 16
        },
        investmentItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16
        },
        investmentIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.icons.backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
        },
        investmentContent: {
            flex: 1
        },
        investmentHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        investmentType: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text
        },
        investmentAmount: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text
        },
        investmentReturn: {
            fontSize: 12,
            marginTop: 4
        }
    });

    return (
        <UICard
            style={styles.mainCard}
            activeAccordion
            accordionTitle="Poupança e investimentos"
            accordionBeOpenDefault
        >
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <View style={styles.totalContainer}>
                        <WRText style={styles.totalLabel}>Total investido</WRText>
                        <View style={styles.totalValueRow}>
                            {showValues ? (
                                <WRText style={styles.totalValue}>R$ {totalInvested.toFixed(2)}</WRText>
                            ) : (
                                <WRText style={styles.hiddenValue}>******</WRText>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.visibilityButton}
                        onPress={() => setShowValues(!showValues)}
                    >
                        <UIIcon 
                            name={showValues ? "eye-off" : "eye"} 
                            size={24} 
                            color={theme.colors.muted} 
                        />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.returnContainer}>
                    <View style={styles.returnRow}>
                        <WRText style={styles.returnLabel}>Rendimento no mês</WRText>
                        {showValues ? (
                            <WRText style={[
                                styles.returnValue,
                                isPositiveReturn ? styles.positiveReturn : styles.negativeReturn
                            ]}>
                                {isPositiveReturn ? '+' : ''}{totalReturn.toFixed(2)} ({totalReturnPercentage.toFixed(2)}%)
                            </WRText>
                        ) : (
                            <WRText style={styles.hiddenValue}>****</WRText>
                        )}
                    </View>
                </View>
                
                <WRText style={{ fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
                    Detalhamento por tipo
                </WRText>
                
                <View style={styles.investmentsList}>
                    {investments.map((investment, index) => (
                        <View key={index} style={styles.investmentItem}>
                            <View style={styles.investmentIcon}>
                                <UIIcon name={investment.icon} size={20} color={theme.colors.primary} />
                            </View>
                            <View style={styles.investmentContent}>
                                <View style={styles.investmentHeader}>
                                    <WRText style={styles.investmentType}>{investment.type}</WRText>
                                    {showValues ? (
                                        <WRText style={styles.investmentAmount}>R$ {investment.amount.toFixed(2)}</WRText>
                                    ) : (
                                        <WRText style={styles.hiddenValue}>****</WRText>
                                    )}
                                </View>
                                {showValues && (
                                    <WRText style={[
                                        styles.investmentReturn,
                                        investment.return.isPositive ? styles.positiveReturn : styles.negativeReturn
                                    ]}>
                                        {investment.return.isPositive ? '+' : ''}{investment.return.value.toFixed(2)} ({investment.return.percentage.toFixed(2)}%)
                                    </WRText>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </UICard>
    );
}