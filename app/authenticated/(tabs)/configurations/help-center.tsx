/**
 * © 2025 Finey - Todos os Direitos Reservados.
 *
 * Tela da Central de Ajuda (mockada)
 */

import UIDropInfo from "@/components/UI/UIDropInfo";
import UIInput from "@/components/UI/UIInput";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface HelpItem {
  id: number;
  title: string;
  answer: string;
}

interface HelpCategory {
  id: number;
  title: string;
  items: HelpItem[];
}

export default function HelpCenterScreen() {
  const { theme, isDark } = useAppTheme();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<HelpCategory[]>([]);

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    setTimeout(() => {
      setCategories([
        {
          id: 1,
          title: "Primeiros Passos",
          items: [
            {
              id: 11,
              title: "Como criar minha primeira transação?",
              answer:
                "Para criar sua primeira transação, vá até a tela principal e toque no botão '+'. Escolha se é uma despesa ou receita, adicione o valor, categoria e salve.",
            },
            {
              id: 12,
              title: "Como configurar minhas categorias?",
              answer:
                "Acesse o menu de Categorias no painel principal. Lá você pode criar, editar e remover categorias para organizar suas transações.",
            },
            {
              id: 13,
              title: "Como visualizar meu saldo?",
              answer:
                "Seu saldo é exibido na tela inicial, calculado automaticamente com base em todas as suas transações registradas.",
            },
          ],
        },
        {
          id: 2,
          title: "Transações",
          items: [
            {
              id: 21,
              title: "Como editar ou excluir uma transação?",
              answer:
                "Na tela de histórico, toque na transação desejada e escolha a opção 'Editar' ou 'Excluir'.",
            },
            {
              id: 22,
              title: "Posso criar transações recorrentes?",
              answer:
                "Sim! Ao criar uma transação, selecione a opção 'Recorrente' e defina o intervalo desejado.",
            },
            {
              id: 23,
              title: "Como anexar comprovantes?",
              answer:
                "Durante a criação ou edição de uma transação, toque em 'Anexar comprovante' e selecione o arquivo desejado (imagem ou PDF).",
            },
          ],
        },
        {
          id: 3,
          title: "Transações",
          items: [
            {
              id: 21,
              title: "Como editar ou excluir uma transação?",
              answer:
                "Na tela de histórico, toque na transação desejada e escolha a opção 'Editar' ou 'Excluir'.",
            },
            {
              id: 22,
              title: "Posso criar transações recorrentes?",
              answer:
                "Sim! Ao criar uma transação, selecione a opção 'Recorrente' e defina o intervalo desejado.",
            },
            {
              id: 23,
              title: "Como anexar comprovantes?",
              answer:
                "Durante a criação ou edição de uma transação, toque em 'Anexar comprovante' e selecione o arquivo desejado (imagem ou PDF).",
            },
          ],
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const styles = StyleSheet.create({
    textCenter: { textAlign: "center" },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#FFFFFF" : "#000000",
    },
    faqText: {
      color: isDark ? "#FFFFFF" : "#000000",
      fontSize: 12,
      marginBottom: 10,
    },
    containerGap: {
      gap: 10,
      marginTop: 20,
    },
  });

  if (loading) {
    return (
      <WRScreenContainer>
        <ActivityIndicator
          color={theme.colors.primary}
          style={{ marginTop: 40 }}
        />
      </WRScreenContainer>
    );
  }

  return (
    <WRScreenContainer>
      <WRText
        style={[
          styles.textCenter,
          { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
        ]}
      >
        Central de Ajuda
      </WRText>

      <UIInput
        placeholder="Buscar artigos de ajuda..."
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.containerGap}>
        {categories.map((category) => (
          <View key={category.id} style={{ gap: 10 }}>
            <WRText style={styles.sectionTitle}>{category.title}</WRText>

            {category.items.map((item) => (
              <UIDropInfo
                key={item.id}
                title={item.title}
                defaultOpen={false}
              >
                <WRText style={styles.faqText}>{item.answer}</WRText>
              </UIDropInfo>
            ))}
          </View>
        ))}
      </View>
      <View style={{ alignItems: "center", padding: 20 }}>
        <WRText style={styles.faqText}>Não encontrou o que procura?</WRText>
        <WRText style={styles.faqText}>Entre em contato com nossa equipe de suporte</WRText>
        <WRText style={{color: theme.colors.primary}}>Relatar um Problema →</WRText>
      </View>
    </WRScreenContainer>
  );
}
