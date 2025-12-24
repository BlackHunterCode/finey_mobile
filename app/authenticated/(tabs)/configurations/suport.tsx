/**
 * © 2025 Finey - Todos os Direitos Reservados.
 *
 * Layout de navegação por tabs para a área autenticada.
 */

import UIButton from "@/components/UI/UIButton";
import UICardLink from "@/components/UI/UICardLink";
import UIDropInfo from "@/components/UI/UIDropInfo";
import UIInput from "@/components/UI/UIInput";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

interface FAQItem {
  id: number;
  title: string;
  answer: string;
}

export default function SuportConfigurationScreen() {
  const { theme, isDark } = useAppTheme();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [quickQuestions, setQuickQuestions] = useState<FAQItem[]>([]);
  const [frequentProblems, setFrequentProblems] = useState<FAQItem[]>([]);
  const [showAllQuick, setShowAllQuick] = useState(false);
  const [showAllProblems, setShowAllProblems] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setQuickQuestions([
        {
          id: 1,
          title: "Não consegui me conectar com o banco",
          answer:
            "Verifique se sua conexão com a internet está estável e se as credenciais estão corretas.",
        },
        {
          id: 2,
          title: "App gasta muita bateria",
          answer:
            "Ative o modo de economia de energia no app em Configurações → Desempenho.",
        },
        {
          id: 3,
          title: "Quero trocar de tema",
          answer:
            "Acesse as configurações do aplicativo e altere o tema entre Claro e Escuro.",
        },
        {
          id: 4,
          title: "Erro ao atualizar o app",
          answer:
            "Tente limpar o cache do aplicativo ou reinstalar a partir da loja oficial.",
        },
      ]);

      setFrequentProblems([
        {
          id: 5,
          title: "Não consigo enviar comprovante",
          answer:
            "Verifique se o arquivo está dentro do limite de 5MB e no formato permitido (PDF ou imagem).",
        },
        {
          id: 6,
          title: "Recebo erro de autenticação",
          answer:
            "Saia da conta e entre novamente. Se o erro persistir, entre em contato com o suporte.",
        },
        {
          id: 7,
          title: "O app fecha sozinho",
          answer:
            "Verifique se há atualizações disponíveis. Se persistir, envie um relatório de erro pelo suporte.",
        },
        {
          id: 8,
          title: "Não consigo acessar minha conta",
          answer:
            "Verifique se o login está correto ou redefina sua senha pelo e-mail cadastrado.",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const styles = StyleSheet.create({
    textCenter: { textAlign: "center" },
    sectionTitle: { fontSize: 18, fontWeight: "bold" },
    faqText: {
      color: isDark ? "#FFFFFF" : "#000000",
      fontSize: 12,
      marginBottom: 10,
    },
    seeMore: {
      fontSize: 10,
      color: theme.colors.primary,
    },
  });

  const getVisibleItems = (items: FAQItem[], showAll: boolean) =>
    showAll ? items : items.slice(0, 3);

  const renderFaqList = (
    items: FAQItem[],
    showAll: boolean,
    toggleShow: () => void
  ) => {
    if (loading)
      return (
        <ActivityIndicator
          color={theme.colors.primary}
          style={{ marginVertical: 20 }}
        />
      );

    const hasMore = items.length > 3;

    return (
      <>
        {getVisibleItems(items, showAll).map((item) => (
          <UIDropInfo key={item.id} title={item.title} defaultOpen={false}>
            <WRText style={styles.faqText}>{item.answer}</WRText>
          </UIDropInfo>
        ))}

        {hasMore && (
          <Pressable onPress={toggleShow}>
            <WRText style={styles.seeMore}>
              {showAll ? "ver menos..." : "ver mais..."}
            </WRText>
          </Pressable>
        )}
      </>
    );
  };

  return (
    <WRScreenContainer>
      <WRText
        style={[
          styles.textCenter,
          { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
        ]}
      >
        Suporte
      </WRText>

      <UIInput
        placeholder="Descreva seu problema..."
        value={query}
        onChangeText={setQuery}
      />

      <View style={{ marginTop: 20, gap: 10 }}>
        <WRText style={styles.sectionTitle}>Dúvidas Rápidas</WRText>
        {renderFaqList(quickQuestions, showAllQuick, () =>
          setShowAllQuick((prev) => !prev)
        )}
      </View>

      <View style={{ marginTop: 25 }}>
        <WRText style={styles.sectionTitle}>Acesso Rápido</WRText>

        <View style={{ gap: 10, marginTop: 10 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <UICardLink
              title="Chat Automático"
              subtitle="24h • Resposta Imediata"
              icon="chatbubble-ellipses-outline"
              backgroundColor="#003322"
              onPress={() => console.log("Abrir chat")}
            />
            <UICardLink
              title="Artigos de Ajuda"
              subtitle="Mais de 100 artigos"
              backgroundImage={require("../../../../assets/images/xandeco.jpg")}
              icon="help-outline"
              onPress={() => console.log("Abrir artigos")}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <UICardLink
              title="Chat Automático"
              subtitle="24h • Resposta Imediata"
              icon="chatbubble-ellipses-outline"
              backgroundColor="#003322"
              onPress={() => console.log("Abrir chat")}
            />
            <UICardLink
              title="Artigos de Ajuda"
              subtitle="Mais de 100 artigos"
              backgroundImage={require("../../../../assets/images/xandeco.jpg")}
              icon="help-outline"
              onPress={() => console.log("Abrir artigos")}
            />
          </View>
        </View>
      </View>

      <View style={{ marginTop: 25, gap: 10 }}>
        <WRText style={styles.sectionTitle}>Problemas Frequentes</WRText>
        {renderFaqList(frequentProblems, showAllProblems, () =>
          setShowAllProblems((prev) => !prev)
        )}
      </View>

      <View
        style={{
          justifyContent: "center",
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <UIButton text="Falar com suporte" onPress={() => {}} />
      </View>
    </WRScreenContainer>
  );
}
