/**
 * © 2025 Finey - Todos os Direitos Reservados.
 *
 * Tela de seleção de planos de assinatura.
 */

import UIButton from "@/components/UI/UIButton";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Plan {
  id: string;
  name: string;
  price: string;
  frequency: string;
  features: string[];
  isPopular?: boolean;
}

export default function PlansSelectionScreen() {
  const { theme, isDark } = useAppTheme();
  const [selectedPlan, setSelectedPlan] = useState<string>("panther-pro");

  const plans: Plan[] = [
    {
      id: "panther",
      name: "Plano Panther",
      price: "R$40",
      frequency: "/Mensal",
      features: [
        "Lorem ta lorado aqui imagina",
        "Lorem ta lorado aqui imagina",
        "Lorem ta lorado aqui imagina",
        "Lorem ta lorado aqui imagina",
      ],
    },
    {
      id: "panther-pro",
      name: "Plano Panther Pro",
      price: "R$180",
      frequency: "/Anual",
      features: [
        "Lorem ta lorado aqui imagina",
        "Lorem ta lorado aqui imagina",
        "Lorem ta lorado aqui imagina",
        "Lorem ta lorado aqui imagina",
      ],
      isPopular: true,
    },
  ];

  const styles = StyleSheet.create({
    headerText: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 18,
      marginTop: 10,
    },
    subText: {
      textAlign: "center",
      opacity: 0.7,
      marginBottom: 20,
    },
    card: {
      width: 200,
      borderWidth: 1,
      borderRadius: 14,
      padding: 15,
      marginHorizontal: 8,
      backgroundColor: isDark ? "#111" : "#FFF",
    },
    selectedCard: {
      borderColor: theme.colors.primary,
      backgroundColor: isDark ? "#001a12" : "#E8FFF5",
    },
    planTitle: {
      fontWeight: "bold",
      fontSize: 16,
    },
    planPrice: {
      fontWeight: "bold",
      fontSize: 22,
      marginTop: 10,
    },
    featureText: {
      fontSize: 12,
      marginTop: 5,
      opacity: 0.8,
    },
    scrollContainer: {
      flexDirection: "row",
      paddingHorizontal: 10,
    },
    badge: {
      position: "absolute",
      top: -10,
      right: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    badgeText: {
      fontSize: 10,
      color: "#000",
      fontWeight: "bold",
    },
  });

  return (
    <WRScreenContainer>
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("@/assets/images/hunter_sentado.png")} 
          style={{ width: 60, height: 60, marginBottom: 20 }}
        />
        <WRText style={styles.headerText}>
          Pronto para ter um futuro financeiro melhor
        </WRText>
        <WRText style={styles.subText}>
          O futuro está te esperando, não deixe para depois invista para ganhar mais.
        </WRText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {plans.map((plan) => {
          const selected = plan.id === selectedPlan;
          return (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.card,
                  selected && styles.selectedCard,
                  { borderColor: selected ? theme.colors.primary : "#333" },
                ]}
              >
                {plan.isPopular && (
                  <View style={styles.badge}>
                    <WRText style={styles.badgeText}>Mais Popular</WRText>
                  </View>
                )}
                <WRText style={styles.planTitle}>{plan.name}</WRText>
                <WRText style={styles.planPrice}>
                  {plan.price}{" "}
                  <WRText style={{ fontSize: 14 }}>{plan.frequency}</WRText>
                </WRText>
                {plan.features.map((f, i) => (
                  <WRText key={i} style={styles.featureText}>
                    ✓ {f}
                  </WRText>
                ))}

                <View
                  style={{
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <UIButton
                    text={selected ? "Selecionado!" : "Selecionar"}
                    onPress={() => setSelectedPlan(plan.id)}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ marginTop: 25 }}>
        <UIButton
          text={
            selectedPlan === "panther-pro"
              ? "Investir no Plano Panther Pro Agora"
              : "Investir no Plano Panther Agora"
          }
          onPress={() => console.log("Investir em:", selectedPlan)}
        />
      </View>

      <View style={{ alignItems: "center", marginTop: 10 }}>
        <WRText
          style={{
            color: theme.colors.primary,
            fontSize: 12,
            textDecorationLine: "underline",
          }}
        >
          voltar para a tela anterior
        </WRText>
      </View>
    </WRScreenContainer>
  );
}
