import UICard from "@/components/UI/UICard";
import UIIcon from "@/components/UI/UIIcon";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface Insight {
    id: string;
    text: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    actionText?: string;
    onAction?: () => void;
}

export default function AIInsightsScreen() {
    const { theme } = useAppTheme();
    
    // Dados mockados para os insights
    // Em uma implementação real, esses dados viriam da API
    const [insights, setInsights] = useState<Insight[]>([
        {
            id: '1',
            text: 'Você gasta R$ 35 por dia com delivery. Quer definir um limite?',
            icon: 'restaurant',
            actionText: 'Definir limite',
            onAction: () => console.log('Definir limite de delivery')
        },
        {
            id: '2',
            text: 'Se guardar R$ 200 por mês, em 1 ano você terá R$ 2.400 + rendimentos.',
            icon: 'trending-up',
            actionText: 'Criar meta de economia',
            onAction: () => console.log('Criar meta de economia')
        },
        {
            id: '3',
            text: 'Seus gastos com assinaturas aumentaram 20% nos últimos 3 meses.',
            icon: 'alert-circle',
            actionText: 'Ver detalhes',
            onAction: () => console.log('Ver detalhes de assinaturas')
        }
    ]);
    
    const styles = StyleSheet.create({
        mainCard: {
            marginBottom: 10
        },
        container: {
            width: '100%'
        },
        insightItem: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary
        },
        insightHeader: {
            flexDirection: 'row',
            marginBottom: 12
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${theme.colors.primary}20`,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
        },
        insightContent: {
            flex: 1
        },
        insightText: {
            fontSize: 14,
            color: theme.colors.text,
            lineHeight: 20
        },
        actionButton: {
            alignSelf: 'flex-start',
            marginTop: 12,
            backgroundColor: `${theme.colors.primary}20`,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16
        },
        actionButtonText: {
            color: theme.colors.primary,
            fontSize: 12,
            fontWeight: '500'
        },
        refreshContainer: {
            alignItems: 'center',
            marginTop: 8
        },
        refreshButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8
        },
        refreshText: {
            color: theme.colors.primary,
            marginLeft: 8,
            fontSize: 14
        }
    });

    return (
        <UICard
            style={styles.mainCard}
            activeAccordion
            accordionTitle="Insights de IA"
            accordionBeOpenDefault
        >
            <View style={styles.container}>
                {insights.map((insight) => (
                    <View key={insight.id} style={styles.insightItem}>
                        <View style={styles.insightHeader}>
                            <View style={styles.iconContainer}>
                                <UIIcon name={insight.icon} size={20} color={theme.colors.primary} />
                            </View>
                            <View style={styles.insightContent}>
                                <WRText style={styles.insightText}>{insight.text}</WRText>
                                
                                {insight.actionText ? (
                                    <TouchableOpacity 
                                        style={styles.actionButton}
                                        onPress={insight.onAction}
                                    >
                                        <WRText style={styles.actionButtonText}>{insight.actionText}</WRText>
                                    </TouchableOpacity>
                                ) : (<></>)}
                            </View>
                        </View>
                    </View>
                ))}
                
                <View style={styles.refreshContainer}>
                    <TouchableOpacity style={styles.refreshButton}>
                        <UIIcon name="refresh" size={16} color={theme.colors.primary} />
                        <WRText style={styles.refreshText}>Atualizar insights</WRText>
                    </TouchableOpacity>
                </View>
            </View>
        </UICard>
    );
}