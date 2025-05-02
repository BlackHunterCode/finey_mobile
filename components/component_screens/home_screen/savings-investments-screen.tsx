import UICard from "@/components/UI/UICard";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { SavingsInvestments } from "@/types/HomeScreenAnalysisData";
import { CryptUtil } from "@/utils/CryptoUtil";
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

function logStyleValue(name: any, value: any) {
  console.log(`[SavingsInvestments] ${name}:`, JSON.stringify(value));
  return value;
}

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

interface SavingsInvestmentsScreenProps {
    analysis: SavingsInvestments | undefined;
}

export default function SavingsInvestmentsScreen({ analysis } : SavingsInvestmentsScreenProps) {
    console.log("[SavingsInvestments] Renderizando componente", analysis ? "com dados" : "sem dados");
    const secretKey: string | undefined = Constants.expoConfig?.extra?.PLUGGY_CRYPT_SECRET;
    if (!secretKey) {
        throw new Error('Chave de criptografia não configurada. Verifique as variáveis de ambiente.');
    }

    const { theme } = useAppTheme();
    
    // Estado para controlar a visibilidade dos valores
    const [showValues, setShowValues] = useState(false);
    
    // Função para obter dados de investimentos
    const getSavingsData = () => {
        if (analysis) {
            // Usar dados reais da análise
            const investments: Investment[] = analysis.investments.map(inv => ({
                type: CryptUtil.decrypt(inv.type, secretKey),
                amount: parseFloat(CryptUtil.decrypt(inv.amount, secretKey)) || 0,
                return: {
                    value: parseFloat(CryptUtil.decrypt(inv.investmentReturn.value, secretKey)) || 0,
                    percentage: parseFloat(CryptUtil.decrypt(inv.investmentReturn.percentage, secretKey)) || 0,
                    isPositive: inv.investmentReturn.isPositive
                },
                icon: CryptUtil.decrypt(inv.icon, secretKey) as React.ComponentProps<typeof Ionicons>['name'] || "wallet"
            }));
            
            return {
                investments,
                totalInvested: parseFloat(CryptUtil.decrypt(analysis.totalInvested, secretKey)) || 0,
                totalReturn: parseFloat(CryptUtil.decrypt(analysis.totalReturn, secretKey)) || 0,
                totalReturnPercentage: parseFloat(CryptUtil.decrypt(analysis.totalReturnPercentage, secretKey)) || 0
            };
        }
        
        // Dados de fallback (mockados)
        const fallbackInvestments: Investment[] = [
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
        ];
        
        const totalInvested = fallbackInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        const totalReturn = fallbackInvestments.reduce((sum, inv) => sum + inv.return.value, 0);
        const totalReturnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
        
        return {
            investments: fallbackInvestments,
            totalInvested,
            totalReturn,
            totalReturnPercentage
        };
    };
    
    const savingsData = getSavingsData();
    const { investments, totalInvested, totalReturn, totalReturnPercentage } = savingsData;
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
        },
        loadingContainer: {
            alignItems: "center",
            justifyContent: 'center'
        },
        detailTitle: {
            fontSize: 16, 
            fontWeight: '500', 
            marginBottom: 12
        }
    });

    function CardContent() {
        console.log("[SavingsInvestments] Renderizando CardContent");
        return (
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
                            <WRText style={logStyleValue("returnValueStyle", [
                                styles.returnValue,
                                isPositiveReturn ? styles.positiveReturn : {}
                            ])}>
                                {isPositiveReturn ? '+' : ''}R$ {totalReturn.toFixed(2)} ({totalReturnPercentage.toFixed(2)}%)
                            </WRText>
                        ) : (
                            <WRText style={styles.hiddenValue}>****</WRText>
                        )}
                    </View>
                </View>
                
                <WRText style={styles.detailTitle}>
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
                                {showValues ? (
                                    <WRText style={[
                                        styles.investmentReturn,
                                        investment.return.isPositive ? styles.positiveReturn : styles.negativeReturn
                                    ]}>
                                        {investment.return.isPositive ? '+' : ''}R$ {investment.return.value.toFixed(2)} ({investment.return.percentage.toFixed(2)}%)
                                    </WRText>
                                ) : (<></>)}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        )
    }

    return (
        <UICard
            style={styles.mainCard}
            activeAccordion
            accordionTitle="Poupança e investimentos"
            accordionBeOpenDefault
        >
           <CardContent />
        </UICard>
    );
}