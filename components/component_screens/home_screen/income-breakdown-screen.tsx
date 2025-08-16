import UICard from "@/components/UI/UICard";
import UIDivider from "@/components/UI/UIDivider";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { useTotalTransactionPeriod } from "@/context/transaction/total-transaction-period-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

interface IncomeSource {
    name: string;
    amount: number;
    percentage: number;
    isRecurring: boolean;
    icon: React.ComponentProps<typeof Ionicons>['name'];
}

export default function IncomeBreakdownScreen() {
    const { theme } = useAppTheme();
    const { totalTransactionPeriod } = useTotalTransactionPeriod();
    
    // Dados mockados para as fontes de receita
    // Em uma implementação real, esses dados viriam da API
    const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
        {
            name: "Salário",
            amount: 5000,
            percentage: 70,
            isRecurring: true,
            icon: "cash"
        },
        {
            name: "Freelance",
            amount: 1500,
            percentage: 21,
            isRecurring: false,
            icon: "laptop"
        },
        {
            name: "Investimentos",
            amount: 500,
            percentage: 7,
            isRecurring: false,
            icon: "trending-up"
        },
        {
            name: "Outros",
            amount: 150,
            percentage: 2,
            isRecurring: false,
            icon: "ellipsis-horizontal"
        }
    ]);
    
    // Calcular totais
    const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);
    const recurringIncome = incomeSources
        .filter(source => source.isRecurring)
        .reduce((sum, source) => sum + source.amount, 0);
    const variableIncome = incomeSources
        .filter(source => !source.isRecurring)
        .reduce((sum, source) => sum + source.amount, 0);
    
    const recurringPercentage = (recurringIncome / totalIncome) * 100;
    const variablePercentage = (variableIncome / totalIncome) * 100;
    
    const styles = StyleSheet.create({
        mainCard: {
            marginBottom: 10
        },
        container: {
            width: '100%'
        },
        summaryContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16
        },
        summaryColumn: {
            flex: 1,
            alignItems: 'center',
            padding: 12
        },
        summaryTitle: {
            fontSize: 14,
            color: theme.colors.muted,
            marginBottom: 8
        },
        summaryValue: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text
        },
        summaryPercentage: {
            fontSize: 12,
            color: theme.colors.muted,
            marginTop: 4
        },
        divider: {
            height: '100%',
            marginHorizontal: 8
        },
        progressContainer: {
            height: 16,
            backgroundColor: `${theme.colors.primary}20`,
            borderRadius: 8,
            marginBottom: 16,
            overflow: 'hidden',
            flexDirection: 'row'
        },
        recurringProgress: {
            height: '100%',
            backgroundColor: theme.colors.primary
        },
        variableProgress: {
            height: '100%',
            backgroundColor: `${theme.colors.primary}80`
        },
        sourcesList: {
            marginTop: 16
        },
        sourceItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12
        },
        sourceIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.icons.backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
        },
        sourceContent: {
            flex: 1
        },
        sourceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        sourceName: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text
        },
        sourceAmount: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text
        },
        sourceType: {
            fontSize: 12,
            color: theme.colors.muted
        },
        sourcePercentage: {
            fontSize: 12,
            color: theme.colors.muted
        },
        legendContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 8
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 8
        },
        legendColor: {
            width: 12,
            height: 12,
            borderRadius: 6,
            marginRight: 4
        },
        legendText: {
            fontSize: 12,
            color: theme.colors.muted
        }
    });

    return (
        <UICard
            style={styles.mainCard}
            activeAccordion
            accordionTitle="Receitas recorrentes vs. variáveis"
            accordionBeOpenDefault
        >
            <View style={styles.container}>
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
                        <WRText style={styles.legendText}>Recorrentes</WRText>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: `${theme.colors.primary}80` }]} />
                        <WRText style={styles.legendText}>Variáveis</WRText>
                    </View>
                </View>
                
                <View style={styles.progressContainer}>
                    <View style={[styles.recurringProgress, { width: `${recurringPercentage}%` }]} />
                    <View style={[styles.variableProgress, { width: `${variablePercentage}%` }]} />
                </View>
                
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryColumn}>
                        <WRText style={styles.summaryTitle}>Recorrentes</WRText>
                        <WRText style={styles.summaryValue}>R$ {recurringIncome.toFixed(2)}</WRText>
                        <WRText style={styles.summaryPercentage}>{recurringPercentage.toFixed(0)}%</WRText>
                    </View>
                    
                    <UIDivider style={styles.divider} />
                    
                    <View style={styles.summaryColumn}>
                        <WRText style={styles.summaryTitle}>Variáveis</WRText>
                        <WRText style={styles.summaryValue}>R$ {variableIncome.toFixed(2)}</WRText>
                        <WRText style={styles.summaryPercentage}>{variablePercentage.toFixed(0)}%</WRText>
                    </View>
                </View>
                
                <WRText style={{ fontSize: 16, fontWeight: '500', marginTop: 16, marginBottom: 12 }}>
                    Detalhamento de receitas
                </WRText>
                
                <View style={styles.sourcesList}>
                    {incomeSources.map((source, index) => (
                        <View key={index} style={styles.sourceItem}>
                            <View style={styles.sourceIcon}>
                                <UIIcon name={source.icon} size={20} color={theme.colors.primary} />
                            </View>
                            <View style={styles.sourceContent}>
                                <View style={styles.sourceHeader}>
                                    <WRText style={styles.sourceName}>{source.name}</WRText>
                                    <WRText style={styles.sourceAmount}>R$ {source.amount.toFixed(2)}</WRText>
                                </View>
                                <View style={styles.sourceHeader}>
                                    <WRText style={styles.sourceType}>
                                        {source.isRecurring ? 'Recorrente' : 'Variável'}
                                    </WRText>
                                    <WRText style={styles.sourcePercentage}>{source.percentage}%</WRText>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </UICard>
    );
}