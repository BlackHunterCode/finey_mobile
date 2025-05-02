import UICard from "@/components/UI/UICard";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { ExpensesCategories } from "@/types/HomeScreenAnalysisData";
import { CryptUtil } from "@/utils/CryptoUtil";
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import { StyleSheet, View } from "react-native";

function logStyleValue(name: any, value: any) {
  console.log(`[ExpenseCategories] ${name}:`, JSON.stringify(value));
  return value;
}

interface ExpenseCategory {
    name: string;
    amount: number;
    percentage: number;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    comparison?: {
        percentage: number;
        increased: boolean;
    };
}

interface ExpenseCategoriesScreenProps {
    analysis: ExpensesCategories | undefined;
}

export default function ExpenseCategoriesScreen({ analysis } : ExpenseCategoriesScreenProps) {
    console.log("[ExpenseCategories] Renderizando componente", analysis ? "com dados" : "sem dados");
    const secretKey: string | undefined = Constants.expoConfig?.extra?.PLUGGY_CRYPT_SECRET;
    if (!secretKey) {
        throw new Error('Chave de criptografia não configurada. Verifique as variáveis de ambiente.');
    }

    const { theme } = useAppTheme();
    
    // Função para obter categorias de gastos da análise ou fallback
    const getExpenseCategories = (): ExpenseCategory[] => {
        if (!analysis || !analysis.categories) {
            // Fallback para dados mockados
            return [
                {
                    name: "Alimentação",
                    amount: 800,
                    percentage: 40,
                    icon: "restaurant",
                    comparison: {
                        percentage: 15,
                        increased: true
                    }
                },
                {
                    name: "Transporte",
                    amount: 500,
                    percentage: 25,
                    icon: "car",
                    comparison: {
                        percentage: 5,
                        increased: false
                    }
                }
            ];
        }

        return analysis.categories.map(category => ({
            name: CryptUtil.decrypt(category.name, secretKey),
            amount: parseFloat(CryptUtil.decrypt(category.amount, secretKey)) || 0,
            percentage: parseFloat(CryptUtil.decrypt(category.percentage, secretKey)) || 0,
            icon: CryptUtil.decrypt(category.icon, secretKey) as React.ComponentProps<typeof Ionicons>['name'] || "wallet",
            comparison: CryptUtil.decrypt(category.previousPercentage, secretKey) ? {
                percentage: Math.abs(parseFloat(CryptUtil.decrypt(category.percentage, secretKey)) - parseFloat(CryptUtil.decrypt(category.previousPercentage, secretKey))),
                increased: parseFloat(CryptUtil.decrypt(category.percentage, secretKey)) > parseFloat(CryptUtil.decrypt(category.previousPercentage, secretKey))
            } : undefined
        }));
    };

    const categories = getExpenseCategories();

    const styles = StyleSheet.create({
        mainCard: {
            marginBottom: 10
        },
        container: {
            width: '100%'
        },
        categoryItem: {
            marginBottom: 16
        },
        categoryHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
        },
        categoryTitleContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        categoryIcon: {
            marginRight: 8,
            backgroundColor: theme.icons.backgroundColor,
            padding: 8,
            borderRadius: 8
        },
        categoryTitle: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.text
        },
        categoryAmount: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text
        },
        progressBarContainer: {
            height: 8,
            backgroundColor: theme.colors.border,
            borderRadius: 4,
            marginBottom: 8
        },
        progressBar: {
            height: '100%',
            borderRadius: 4,
            backgroundColor: theme.colors.primary
        },
        comparisonContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        comparisonText: {
            fontSize: 12,
            color: theme.colors.muted,
            marginLeft: 4
        },
        increaseText: {
            color: '#FF5252'
        },
        decreaseText: {
            color: '#00C853'
        },
        loadingContainer: {
            alignItems: "center",
            justifyContent: 'center'
        }
    });

    function CardContent() {
        console.log("[ExpenseCategories] Renderizando CardContent");
        return (
            <View style={styles.container}>
                {categories.map((category, index) => {
                    console.log(`[ExpenseCategories] Renderizando categoria ${index}:`, category.name);
                    return (
                    <View key={index} style={styles.categoryItem}>
                        <View style={styles.categoryHeader}>
                            <View style={styles.categoryTitleContainer}>
                                <View style={styles.categoryIcon}>
                                    <UIIcon name={category.icon} size={20} color={theme.colors.primary} />
                                </View>
                                <WRText style={styles.categoryTitle}>{category.name}</WRText>
                            </View>
                            <WRText style={styles.categoryAmount}>R$ {category.amount.toFixed(2)}</WRText>
                        </View>
                        
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${category.percentage}%` }]} />
                        </View>
                        
                        {category.comparison ? (
                            <View style={styles.comparisonContainer}>
                                <UIIcon 
                                    name={category.comparison.increased ? "arrow-up" : "arrow-down"} 
                                    size={12} 
                                    color={category.comparison.increased ? '#FF5252' : '#00C853'} 
                                />
                                <WRText style={logStyleValue(`comparisonTextStyle_${index}`, [
                                    styles.comparisonText,
                                    category.comparison.increased ? styles.increaseText : styles.decreaseText
                                ])}>
                                    {category.comparison.percentage}% {category.comparison.increased ? 'a mais' : 'a menos'} que no mês anterior
                                </WRText>
                            </View>
                        ) : (<></>)}
                    </View>
                );})}
            </View>
        )
    }

    return (
        <UICard
            style={styles.mainCard}
            activeAccordion
            accordionTitle="Categorias de gastos"
            accordionBeOpenDefault
        >
            <CardContent />
        </UICard>
    );
}