import UICard from "@/components/UI/UICard";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

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

export default function ExpenseCategoriesScreen() {
    const { theme } = useAppTheme();
    
    // Dados mockados para as categorias de gastos
    // Em uma implementação real, esses dados viriam da API
    const [categories, setCategories] = useState<ExpenseCategory[]>([
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
        },
        {
            name: "Compras online",
            amount: 350,
            percentage: 17.5,
            icon: "cart",
            comparison: {
                percentage: 20,
                increased: true
            }
        }
    ]);
    
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
        }
    });

    return (
        <UICard
            style={styles.mainCard}
            activeAccordion
            accordionTitle="Categorias de gastos"
            accordionBeOpenDefault
        >
            <View style={styles.container}>
                {categories.map((category, index) => (
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
                        
                        {category.comparison && (
                            <View style={styles.comparisonContainer}>
                                <UIIcon 
                                    name={category.comparison.increased ? "arrow-up" : "arrow-down"} 
                                    size={12} 
                                    color={category.comparison.increased ? '#FF5252' : '#00C853'} 
                                />
                                <WRText style={[
                                    styles.comparisonText,
                                    category.comparison.increased ? styles.increaseText : styles.decreaseText
                                ]}>
                                    {category.comparison.percentage}% {category.comparison.increased ? 'a mais' : 'a menos'} que no mês anterior
                                </WRText>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </UICard>
    );
}