/**
 * © 2025 Finey - Todos os Direitos Reservados.
 *
 * Tela de verificação de código para redefinição de senha.
 */

import UIButton from "@/components/UI/UIButton";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function VerifyCodeScreen({ navigation }: any) {
  const { theme, isDark } = useAppTheme();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleBack = () => navigation.goBack();
  const codeCompleted = code.join("").length === 6;

  const styles = StyleSheet.create({
    backButton: {
      position: "absolute",
      top: 50,
      left: 25,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    backText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    iconContainer: {
      width: 85,
      height: 85,
      borderRadius: 50,
      backgroundColor: isDark ? "#1c1c1c" : "#e5e5e5",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 25,
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: theme.colors.primary,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.muted,
      textAlign: "center",
      marginBottom: 25,
      lineHeight: 20,
    },
    codeContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginBottom: 30,
    },
    codeInput: {
      width: 48,
      height: 58,
      borderRadius: 10,
      borderWidth: 1.5,
      textAlign: "center",
      fontSize: 20,
      fontWeight: "500",
    },
    resendText: {
      color: theme.colors.muted,
      fontSize: 13,
      marginTop: 20,
      textAlign: "center",
    },
  });

  return (
    <WRScreenContainer>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={22} color={theme.colors.primary} />
        <WRText style={styles.backText}>Voltar</WRText>
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ alignItems: "center" }}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-outline" size={38} color={theme.colors.primary} />
        </View>

        <WRText style={styles.title}>Verificar Código</WRText>
        <WRText style={styles.subtitle}>
          Digite o código de 6 dígitos enviado para {"\n"}
          <WRText style={{ color: theme.colors.text }}>alexandre@gmail.com</WRText>
        </WRText>

        <View style={styles.codeContainer}>
          {code.map((value, index) => (
            <TextInput
              key={index}
              style={[
                styles.codeInput,
                {
                  backgroundColor: isDark ? "#1c1c1c" : "#f2f2f2",
                  color: isDark ? "#fff" : "#000",
                  borderColor: isDark ? "#2c2c2c" : "#ccc",
                },
              ]}
              maxLength={1}
              keyboardType="number-pad"
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          ))}
        </View>

        <UIButton
          text="Verificar Código"
          onPress={() => navigation.navigate("NovaSenha")}
          disabled={!codeCompleted}
          style={[
            { width: 220, marginBottom: 10 },
            !codeCompleted && { opacity: 0.5 },
          ]}
        />

        <WRText style={styles.resendText}>
          Não recebeu o código?{" "}
          <WRText style={{ color: theme.colors.primary }}>Reenviar</WRText>
        </WRText>
      </KeyboardAvoidingView>
    </WRScreenContainer>
  );
}
