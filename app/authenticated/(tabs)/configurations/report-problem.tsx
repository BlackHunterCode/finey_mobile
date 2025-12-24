/**
 * © 2025 Finey - Todos os Direitos Reservados.
 *
 * Tela para relato de problema pelo usuário.
 */

import UIButton from "@/components/UI/UIButton";
import UIDropdown, { UIDropdownItem } from "@/components/UI/UIDropdown";
import UIInput from "@/components/UI/UIInput";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";

export default function ReportProblemScreen() {
  const { theme, isDark } = useAppTheme();

  const [category, setCategory] = useState<string>("Selecione a categoria");
  const [subject, setSubject] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const styles = StyleSheet.create({
    iconWrapper: {
      alignItems: "center",
      marginTop: 20,
      marginBottom: 10,
    },
    descriptionText: {
      textAlign: "center",
      color: isDark ? "#B0B0B0" : "#333",
      fontSize: 13,
      marginBottom: 20,
    },
    sectionLabel: {
      fontWeight: "bold",
      marginBottom: 5,
      fontSize: 13,
      color: isDark ? "#FFFFFF" : "#000000",
    },
    dropdownTrigger: {
      padding: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? "#333" : "#CCC",
      backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
      padding: 10,
      borderWidth: 1,
      borderColor: isDark ? "#333" : "#CCC",
      borderRadius: 8,
      color: isDark ? "#FFF" : "#000",
      backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
    },
    helperText: {
      color: isDark ? "#8A8A8A" : "#555",
      fontSize: 11,
      marginTop: 5,
    },
    buttonWrapper: {
      marginTop: 25,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const handleSubmit = () => {
    console.log({
      categoria: category,
      assunto: subject,
      descricao: description,
    });
  };

  return (
    <WRScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name="paper-plane-outline"
              size={48}
              color={theme.colors.primary}
            />
          </View>

          <WRText style={styles.descriptionText}>
            Descreva o problema que você está enfrentando e nossa equipe entrará
            em contato
          </WRText>

          <View>
            <WRText style={styles.sectionLabel}>Categoria</WRText>

            <UIDropdown
              trigger={
                <View style={styles.dropdownTrigger}>
                  <WRText>{category}</WRText>
                  <Ionicons
                    name="chevron-down-outline"
                    size={18}
                    color={theme.colors.text}
                  />
                </View>
              }
            >
              <UIDropdownItem
                onPress={() => setCategory("Problemas de login")}
                icon="lock-closed-outline"
              >
                Problemas de login
              </UIDropdownItem>
              <UIDropdownItem
                onPress={() => setCategory("Erros de transação")}
                icon="card-outline"
              >
                Erros de transação
              </UIDropdownItem>
              <UIDropdownItem
                onPress={() => setCategory("Bugs visuais")}
                icon="alert-circle-outline"
              >
                Bugs visuais
              </UIDropdownItem>
              <UIDropdownItem
                onPress={() => setCategory("Outros")}
                icon="help-circle-outline"
              >
                Outros
              </UIDropdownItem>
            </UIDropdown>

            <WRText style={styles.sectionLabel}>Assunto</WRText>
            <UIInput
              placeholder="Resumo do problema"
              value={subject}
              onChangeText={setSubject}
            />

            <WRText style={[styles.sectionLabel, { marginTop: 15 }]}>
              Descrição
            </WRText>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Descreva o problema em detalhes..."
              placeholderTextColor={isDark ? "#888" : "#999"}
              value={description}
              onChangeText={setDescription}
            />

            <WRText style={styles.helperText}>
              Inclua o máximo de detalhes possível para nos ajudar a resolver
              rapidamente
            </WRText>

            <View style={styles.buttonWrapper}>
              <UIButton
                text="Enviar Relato"
                icon="paper-plane-outline"
                onPress={handleSubmit}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WRScreenContainer>
  );
}
