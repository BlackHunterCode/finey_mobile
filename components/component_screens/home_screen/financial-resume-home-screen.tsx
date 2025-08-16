import UICard from "@/components/UI/UICard";
import UIDivider from "@/components/UI/UIDivider";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAuth } from "@/context/auth-context";
import { useReferenceDate } from "@/context/reference-date-context";
import { useTargetBanks } from "@/context/target-bank-context";
import { useAppTheme } from "@/context/theme-context";
import { useTotalTransactionPeriod } from "@/context/transaction/total-transaction-period-context";
import { loadTotalTransactionPeriod } from "@/service/service.transaction";
import AuthResponse from "@/types/AuthResponse";
import { getWeeksInMonth } from 'date-fns';
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type AnalysisPeriod = 'weekly' | 'monthly' | 'yearly';

export default function FinancialResumeHomeScreen() {
    const { theme } = useAppTheme();
    const [selectedMonth, setSelectedMonth] = useState(1);
    const { referenceDate, getDateRangeByPeriod } = useReferenceDate();
    const { totalTransactionPeriod, setTotalTransactionPeriod } = useTotalTransactionPeriod();
    const { selectedBanks } = useTargetBanks();
    const [analysisPeriod, setAnalysisPeriod] = useState<AnalysisPeriod>('monthly');
    const [selectedWeek, setSelectedWeek] = useState<number>(1);
    const { authObject } = useAuth();
    
    const totalWeeks = getWeeksInMonth(referenceDate);
    const weekOptions = Array.from({ length: totalWeeks }, (_, i) => ({
        label: `Semana ${i + 1}`,
        value: i + 1
    }));

    const periodOptions = [
        { label: 'Semanal', value: 'weekly' },
        { label: 'Mensal', value: 'monthly' },
        { label: 'Anual', value: 'yearly' }
    ];

    const handlePeriodChange = async (period: AnalysisPeriod) => {
        setAnalysisPeriod(period);
        if (period !== 'weekly') {
            setSelectedWeek(1);
        }
        
        // Recarregar dados da API baseado no novo período
        try {
            const bankAccountIds = selectedBanks?.map(bank => bank.institutionId) || [];
            const dateRange = getDateRangeByPeriod(period);
            
            const result = await loadTotalTransactionPeriod(
                selectedBanks,
                referenceDate,
                authObject as AuthResponse,     
                true, // considera os cartões de crédito.
                dateRange?.startDate,
                dateRange?.endDate
            );
            
            if (result) {
                setTotalTransactionPeriod(result);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do período:', error);
        }
    };
    
    // Dados da API para o resumo financeiro
    const financialData = {
        ganhos: {
            valor: totalTransactionPeriod?.totalEarnings || 0,
            atualizadoEm: "hoje",
            status: "stable",
            percentual: 0, // Percentual não disponível na API atual
        },
        gastos: {
            valor: totalTransactionPeriod?.totalExpenses || 0,
            atualizadoEm: "hoje",
            percentual: 0, // Percentual não disponível na API atual
            status: "stable"
        },
        investimentos: {
            valor: "*****", // Valor oculto
            atualizadoEm: "15",
            categorias: [
                { nome: "Criptomoedas", ativo: true },
                { nome: "Fundos de investimentos", ativo: true }
            ],
            rentabilidade: 5,
            status: "down"
        },
        carteira: {
            valor: 7500.00,
            status: "up"
        },
        rentabilidadeGeral: {
            percentual: 5,
            status: "down"
        },
        meses: ["jan", "fev", "mar", "abr", "mai"]
    };

    // Renderiza o indicador de status (seta para cima/baixo)
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



    // Renderiza o gráfico de gerenciamento mensal
    const renderMonthlyChart = () => {
        return (
            <View style={styles.chartContainer}>
                <WRText style={styles.chartTitle}>Gráfico de gerenciamento mensal</WRText>
                
                <View style={styles.monthsContainer}>
                    {financialData.meses.map((mes, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.monthItem}
                            onPress={() => setSelectedMonth(index)}
                        >
                            <WRText style={[styles.monthText, selectedMonth === index && styles.selectedMonthText]}>
                                {mes}
                            </WRText>
                            <View 
                                style={[styles.monthDot, 
                                    selectedMonth === index && styles.selectedMonthDot,
                                    index === 1 && styles.highlightedMonthDot
                                ]} 
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                
                <View style={styles.chartSummary}>
                    <View style={styles.chartSummaryItem}>
                        <WRText style={styles.chartSummaryLabel}>Carteira</WRText>
                        <View style={styles.chartSummaryValue}>
                            <UIIcon name="arrow-up" size={16} color={theme.colors.primary} />
                            <WRText style={styles.chartSummaryAmount}>R$ {financialData.carteira.valor.toFixed(2)}</WRText>
                        </View>
                    </View>
                    
                    <UIDivider style={styles.summaryDivider} />
                    
                    <View style={styles.chartSummaryItem}>
                        <WRText style={styles.chartSummaryLabel}>Rentabilidade</WRText>
                        <View style={styles.chartSummaryValue}>
                            {renderStatusIndicator(
                                financialData.rentabilidadeGeral.status, 
                                financialData.rentabilidadeGeral.percentual
                            )}
                        </View>
                    </View>
                </View>
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
            color: '#2E7D32', // Verde para feedback positivo
        },
    });

    return (
        <>
            <UICard
                style={styles.mainCard}
                activeAccordion
                accordionTitle="Resumo financeiro"
                accordionBeOpenDefault
            >    
                <View style={styles.container}>
                    <View style={[styles.resumeControlRow, { marginBottom: 8 }]}>
                        <TouchableOpacity style={{ flexDirection: 'row', gap: 4 }}>
                            <UIIcon name="clipboard" size={16}/>
                            <WRText>Resumão</WRText>
                        </TouchableOpacity>
                        {/* UISelect de tipos de análise comentado - não será usado agora
                        <View style={styles.periodSelector}>
                            <UISelect
                                value={analysisPeriod}
                                options={periodOptions}
                                onChange={handlePeriodChange}
                                placeholder="Selecione o período de análise"
                                style={{ width: '100%' }}
                            />
                        </View>
                        */}
                    </View>
                    {/* Seletor de semana também comentado pois depende do UISelect acima
                    {analysisPeriod === 'weekly' && (
                        <View style={styles.weekSelector}>
                            <UISelect
                                value={selectedWeek}
                                options={weekOptions}
                                onChange={setSelectedWeek}
                                placeholder="Selecione a semana"
                            />
                        </View>
                    )}
                    */}
                    {/* Cards de resumo financeiro */}
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
                                {/* <WRText style={styles.summaryCardUpdated}>
                                    atualizado dia {financialData.ganhos.atualizadoEm}
                                </WRText> */}
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
                                {/* <WRText style={styles.summaryCardUpdated}>
                                    atualizado dia {financialData.gastos.atualizadoEm}
                                </WRText> */}
                            </View>
                        </UICard>
                    </View>
                    
                    {/* Card de investimentos */}
                    {/*
                    <UICard href="/investimentos" openStack style={{ marginBottom: 16 }}>
                        <WRText style={styles.summaryCardTitle}>Investimentos</WRText>
                        <View style={styles.summaryCardContent}>
                            <View style={styles.valueContainer}>
                                <View style={styles.investmentValueContainer}>
                                    <WRText style={styles.summaryCardValue}>
                                        {financialData.investimentos.valor}
                                    </WRText>
                                    <UIIcon name="eye-off" size={20} color={theme.colors.muted} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.investmentCategories}>
                            {financialData.investimentos.categorias.map((categoria, index) => (
                                <View key={index} style={styles.categoryItem}>
                                    <View style={styles.categoryDot} />
                                    <WRText style={styles.categoryText}>{categoria.nome}</WRText>
                                </View>
                            ))}
                            <View style={styles.rentabilidadeContainer}>
                                <WRText style={styles.rentabilidadeText}>Rentabilidade</WRText>
                                {renderStatusIndicator(financialData.investimentos.status, financialData.investimentos.rentabilidade)}
                            </View>
                        </View>
                    </UICard>
                    */}
                    
                    {/* Insight Financeiro */}
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

                    {/* Ícone de filtro */}
                    {/* <View style={styles.filterIconContainer}>
                        <UIIcon name="funnel" size={24} color={theme.colors.primary} />
                    </View> */}
                    
                    {/* Gráfico mensal */}
                    {/*renderMonthlyChart()*/}
                </View>
            </UICard>

            {/* Remover o card de insight separado, já que agora está dentro do card principal */}
        </>
    );
}