import UICard from "@/components/UI/UICard";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface BudgetCategory {
    name: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    budgetAmount: number;
    spentAmount: number;
    percentage: number;
}

export default function BudgetRealityScreen() {
    const { theme } = useAppTheme();
    
    // Dados mockados para as categorias de orçamento
    // Em uma implementação real, esses dados viriam da API
    const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
        {
            name: "Lazer",
            icon: "game-controller",
            budgetAmount: 500,
            spentAmount: 350,
            percentage: 70
        },
        {
            name: "Alimentação",
            icon: "restaurant",
            budgetAmount: 1000,
            spentAmount: 800,
            percentage: 80
        },
        {
            name: "Transporte",
            icon: "car",
            budgetAmount: 600,
            spentAmount: 300,
            percentage: 50
        }
    ]);
    
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
        headerTitle: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.text
        },
        addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16
        },
        addButtonText: {
            color: '#FFFFFF',
            fontSize: 12,
            marginLeft: 4
        },
        budgetItem: {
            marginBottom: 16
        },
        budgetHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
        },
        categoryContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        categoryIcon: {
            marginRight: 8,
            backgroundColor: theme.icons.backgroundColor,
            padding: 8,
            borderRadius: 8
        },
        categoryName: {
            fontSize: 16,
            color: theme.colors.text
        },
        progressInfo: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        progressText: {
            fontSize: 14,
            color: theme.colors.text,
            marginRight: 8
        },
        progressBarContainer: {
            height: 8,
            backgroundColor: theme.colors.border,
            borderRadius: 4,
            marginBottom: 4,
            overflow: 'hidden'
        },
        progressBar: {
            height: '100%',
            borderRadius: 4
        },
        progressSafe: {
            backgroundColor: '#00C853'
        },
        progressWarning: {
            backgroundColor: '#FFC107'
        },
        progressDanger: {
            backgroundColor: '#FF5252'
        },
        budgetDetails: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        budgetDetailText: {
            fontSize: 12,
            color: theme.colors.muted
        }
    });

    // Função para determinar a cor da barra de progresso com base na porcentagem
    const getProgressBarStyle = (percentage: number) => {
        if (percentage < 70) return styles.progressSafe;
        if (percentage < 90) return styles.progressWarning;
        return styles.progressDanger;
    };

    return (
        <UICard
            style={styles.mainCard}
            activeAccordion
            accordionTitle="Meta de gastos vs. realidade"
            accordionBeOpenDefault
        >
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <WRText style={styles.headerTitle}>Orçamentos definidos</WRText>
                    <TouchableOpacity style={styles.addButton}>
                        <UIIcon name="add" size={14} color="#FFFFFF" />
                        <WRText style={styles.addButtonText}>Novo orçamento</WRText>
                    </TouchableOpacity>
                </View>
                
                {budgetCategories.map((category, index) => (
                    <View key={index} style={styles.budgetItem}>
                        <View style={styles.budgetHeader}>
                            <View style={styles.categoryContainer}>
                                <View style={styles.categoryIcon}>
                                    <UIIcon name={category.icon} size={20} color={theme.colors.primary} />
                                </View>
                                <WRText style={styles.categoryName}>{category.name}</WRText>
                            </View>
                            <View style={styles.progressInfo}>
                                <WRText style={styles.progressText}>{category.percentage}%</WRText>
                            </View>
                        </View>
                        
                        <View style={styles.progressBarContainer}>
                            <View 
                                style={[
                                    styles.progressBar, 
                                    getProgressBarStyle(category.percentage),
                                    { width: `${category.percentage}%` }
                                ]} 
                            />
                        </View>
                        
                        <View style={styles.budgetDetails}>
                            <WRText style={styles.budgetDetailText}>
                                Gasto: R$ {category.spentAmount.toFixed(2)}
                            </WRText>
                            <WRText style={styles.budgetDetailText}>
                                Meta: R$ {category.budgetAmount.toFixed(2)}
                            </WRText>
                        </View>
                    </View>
                ))}
            </View>
        </UICard>
    );
}