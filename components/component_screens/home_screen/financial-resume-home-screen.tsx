import UICard from "@/components/UI/UICard";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { FinancialSummary } from "@/types/HomeScreenAnalysisData";
import { CryptUtil } from "@/utils/CryptoUtil";
import Constants from 'expo-constants';
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface FinancialResumeHomeScreenProps {
    analysis: undefined | FinancialSummary;
}

export default function FinancialResumeHomeScreen({ analysis } : FinancialResumeHomeScreenProps) {
    const secretKey: string | undefined = Constants.expoConfig?.extra?.PLUGGY_CRYPT_SECRET;
    if (!secretKey) {
        throw new Error('Chave de criptografia não configurada. Verifique as variáveis de ambiente.');
    }

    const { theme } = useAppTheme();

    const getFinancialData = () => {
        if(!analysis)
            throw new Error("O objeto de analises do financial nao esta correto.");

        return {
            ganhos: {
                valor: parseFloat(CryptUtil.decrypt(analysis.income.value, secretKey)) || 0,
                status: CryptUtil.decrypt(analysis.income.status, secretKey) || "stable",
                percentual: parseFloat(CryptUtil.decrypt(analysis.income.percentage, secretKey)) || 0
            },
            gastos: {
                valor: parseFloat(CryptUtil.decrypt(analysis.expenses.value, secretKey)) || 0,
                status: CryptUtil.decrypt(analysis.expenses.status, secretKey) || "stable",
                percentual: parseFloat(CryptUtil.decrypt(analysis.expenses.percentage, secretKey)) || 0
            }
        };
    };

    const financialData = getFinancialData();

    const renderStatusIndicator = (status: string, value: any) => {
        const isPositive = status === "up";
        const color = isPositive ? "#00C853" : "#FF5252";
        const iconName = isPositive ? "arrow-up" : "arrow-down";
        const prefix = !isPositive ? "- " : "";
        
        return (
            <View style={styles.statusContainer}>
                <UIIcon name={iconName} size={16} color={color} />
                <WRText style={{ color, marginLeft: 4, fontSize: 12 }}>{prefix}{value}%</WRText>
            </View>
        );
    };

    const styles = StyleSheet.create({
        periodSelector: {
            width: '50%'
        },
        weekSelector: {
            marginTop: 8,
            marginBottom: 16
        },
        mainCard: {
            marginBottom: 10
        },
        container: {
            width: '100%'
        },
        resumeControlRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16
        },
        summaryCard: {
            flex: 1,
            marginHorizontal: 4,
            width: '48%',
            minWidth: 150
        },
        summaryCardTitle: {
            fontSize: 16,
            color: theme.colors.text
        },
        summaryCardContent: {
            marginTop: 4
        },
        valueContainer: {
            marginBottom: 4
        },
        summaryCardValue: {
            fontSize: 20,
            fontWeight: '600',
            color: theme.colors.text
        },
        summaryCardUpdated: {
            fontSize: 12,
            color: theme.colors.muted
        },
        statusContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4
        },
        investmentValueContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        investmentCategories: {
            marginTop: 12
        },
        categoryItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4
        },
        categoryDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.primary,
            marginRight: 8
        },
        categoryText: {
            fontSize: 14,
            color: theme.colors.text
        },
        rentabilidadeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8
        },
        rentabilidadeText: {
            fontSize: 14,
            color: theme.colors.text
        },
        filterIconContainer: {
            alignItems: 'flex-end',
            marginVertical: 16
        },
        chartContainer: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 16,
            width: '100%'
        },
        chartTitle: {
            fontSize: 16,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 24
        },
        monthsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            marginBottom: 24,
            gap: 8
        },
        monthItem: {
            alignItems: 'center',
            minWidth: 50,
            marginBottom: 8
        },
        monthText: {
            fontSize: 14,
            color: theme.colors.muted,
            marginBottom: 8
        },
        selectedMonthText: {
            color: theme.colors.text
        },
        monthDot: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: theme.colors.border
        },
        selectedMonthDot: {
            backgroundColor: theme.colors.text
        },
        highlightedMonthDot: {
            backgroundColor: theme.colors.primary
        },
        chartSummary: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        chartSummaryItem: {
            flex: 1
        },
        chartSummaryLabel: {
            fontSize: 14,
            color: theme.colors.text,
            marginBottom: 4
        },
        chartSummaryValue: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        chartSummaryAmount: {
            fontSize: 16,
            fontWeight: '600',
            marginLeft: 4
        },
        summaryDivider: {
            height: '100%',
            marginHorizontal: 16
        },
        insightCard: {
            marginTop: 16,
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
        },
        insightContainer: {
            padding: 8,
        },
        insightHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        insightTitle: {
            marginLeft: 8,
            fontSize: 16,
            fontFamily: theme.fonts.semiBold.fontFamily,
            fontWeight: theme.fonts.semiBold.fontWeight,
        },
        insightText: {
            fontSize: 14,
            lineHeight: 20,
        },
        insightHighlight: {
            fontFamily: theme.fonts.semiBold.fontFamily,
            fontWeight: theme.fonts.semiBold.fontWeight,
            color: theme.colors.primary,
        },
        insightWarning: {
            fontFamily: theme.fonts.semiBold.fontFamily,
            fontWeight: theme.fonts.semiBold.fontWeight,
            color: theme.colors.error,
        },
        insightPositive: {
            fontFamily: theme.fonts.semiBold.fontFamily,
            fontWeight: theme.fonts.semiBold.fontWeight,
            color: '#2E7D32',
        },
        loadingContainer: {
            alignItems: "center",
            justifyContent: 'center'
        },
    });

    function CardContent() {
        return (
            <View style={styles.container}>
                <View style={[styles.resumeControlRow, { marginBottom: 8 }]}>
                    <TouchableOpacity style={{ flexDirection: 'row', gap: 4 }}>
                        <UIIcon name="clipboard" size={16}/>
                        <WRText>Resumão</WRText>
                    </TouchableOpacity>
                </View>

                <View style={styles.summaryRow}>
                    <UICard style={styles.summaryCard} href="/ganhos" openStack>
                        <WRText style={styles.summaryCardTitle}>Ganhos</WRText>
                        <View style={styles.summaryCardContent}>
                            <View style={styles.valueContainer}>
                                <WRText style={[styles.summaryCardValue]}>
                                    R$ {financialData.ganhos.valor.toFixed(2)}
                                </WRText>
                                {financialData.ganhos.status !== "stable" && financialData.ganhos.percentual &&
                                    renderStatusIndicator(financialData.ganhos.status, financialData.ganhos.percentual)}
                            </View>
                        </View>
                    </UICard>
                    <UICard style={styles.summaryCard} href="/gastos" openStack>
                        <WRText style={styles.summaryCardTitle}>Gastos</WRText>
                        <View style={styles.summaryCardContent}>
                            <View style={styles.valueContainer}>
                                <WRText style={[styles.summaryCardValue, { color: "#FF5252" }]}>
                                    - R$ {financialData.gastos.valor.toFixed(2)}
                                </WRText>
                                {financialData.gastos.status !== "stable" && financialData.gastos.percentual &&
                                    renderStatusIndicator(financialData.gastos.status, financialData.gastos.percentual)}
                            </View>
                        </View>
                    </UICard>
                </View>

                <View style={styles.insightContainer}>
                    <View style={styles.insightHeader}>
                        <UIIcon name="bulb-outline" size={20} color={theme.colors.primary} withBackground={true} backgroundSize={36} />
                        <WRText style={styles.insightTitle}>Insight do Mês</WRText>
                    </View>
                    <WRText style={styles.insightText}>
                        Você gastou <WRText style={styles.insightHighlight}>R$ {financialData.gastos.valor.toFixed(2)}</WRText> e 
                        ganhou <WRText style={styles.insightHighlight}>R$ {financialData.ganhos.valor.toFixed(2)}</WRText> nesse mês.
                        {financialData.gastos.valor > financialData.ganhos.valor ? (
                            <WRText style={styles.insightWarning}> Você está gastando mais do que está ganhando!</WRText>
                        ) : (
                            <WRText style={styles.insightPositive}> Parabéns! Você está economizando!</WRText>
                        )}
                    </WRText>
                </View>
            </View>
        );   
    }

    return (
        <>
            <UICard
                style={styles.mainCard}
                activeAccordion
                accordionTitle="Gastos e Ganhos"
                accordionBeOpenDefault
            >    
                <CardContent/>
            </UICard>
        </>
    );
}