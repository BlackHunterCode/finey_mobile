import UICard from "@/components/UI/UICard";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { CurrentBalanceProjection } from "@/types/HomeScreenAnalysisData";
import { CryptUtil } from "@/utils/CryptoUtil";
import Constants from 'expo-constants';
import { StyleSheet, View } from "react-native";

// Adicionar função de log
function logStyleValue(name: any, value: any) {
  console.log(`[CurrentBalanceProjection] ${name}:`, JSON.stringify(value));
  return value;
}

interface CurrentBalanceProjectionScreenProps {
    analysis: CurrentBalanceProjection | undefined;
}

export default function CurrentBalanceProjectionScreen({ analysis } : CurrentBalanceProjectionScreenProps) {
    console.log("[CurrentBalanceProjection] Renderizando componente", analysis ? "com dados" : "sem dados");
    
    const secretKey: string | undefined = Constants.expoConfig?.extra?.PLUGGY_CRYPT_SECRET;
    if (!secretKey) {
        throw new Error('Chave de criptografia não configurada. Verifique as variáveis de ambiente.');
    }
   
    const { theme } = useAppTheme();
    
    const getProjectionData = () => {
        if(!analysis) {
            console.log("[CurrentBalanceProjection] Análise indefinida");
            throw new Error("O objeto de projeção do financial nao esta correto.");
        }

        try {
            const currentBalance = parseFloat(CryptUtil.decrypt(analysis.currentBalance, secretKey)) || 0;
            const projectedBalance = parseFloat(CryptUtil.decrypt(analysis.projectedBalance, secretKey)) || 0;
            const dailyAvgExpense = parseFloat(CryptUtil.decrypt(analysis.dailyAverageExpense, secretKey)) || 0;
            
            console.log("[CurrentBalanceProjection] Dados decodificados:", {
                currentBalance,
                projectedBalance,
                daysLeftInMonth: analysis.daysLeftInMonth,
                dailyAvgExpense
            });
            
            return {
                currentBalance,
                projectedBalance,
                daysLeftInMonth: analysis.daysLeftInMonth || 0,
                dailyAvgExpense
            };
        } catch (error) {
            console.error("[CurrentBalanceProjection] Erro ao decodificar dados:", error);
            throw error;
        }
    };

    const projectionData = getProjectionData();
    const { currentBalance, projectedBalance, daysLeftInMonth, dailyAvgExpense } = projectionData;
    
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
        },
        loadingContainer: {
            alignItems: "center",
            justifyContent: 'center'
        }
    });

    function CardContent() {
        console.log("[CurrentBalanceProjection] Renderizando CardContent");
        return (
            <View style={styles.container}>
                <View style={styles.balanceRow}>
                    <View style={styles.balanceColumn}>
                        <WRText style={styles.balanceTitle}>Saldo atual</WRText>
                        <WRText style={logStyleValue("balanceValueStyle", [
                            styles.balanceValue,
                            currentBalance > 0 ? styles.positiveBalance : 
                            currentBalance < 0 ? styles.negativeBalance : {}
                        ])}>
                            R$ {currentBalance.toFixed(2)}
                        </WRText>
                    </View>
                    
                    <View style={styles.balanceColumn}>
                        <WRText style={styles.balanceTitle}>Projeção para o fim do mês</WRText>
                        <WRText style={logStyleValue("projectedBalanceValueStyle", [
                            styles.balanceValue,
                            projectedBalance > 0 ? styles.positiveBalance : 
                            projectedBalance < 0 ? styles.negativeBalance : {}
                        ])}>
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
        )
    }

    return (
        <UICard
            style={styles.mainCard}
            activeAccordion
            accordionTitle="Saldo atual e projeção"
            accordionBeOpenDefault
        >
            <CardContent />
        </UICard>
    );
}