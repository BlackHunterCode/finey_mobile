/**
 * © 2025 Finey - Todos os Direitos Reservados.
 *
 * Tela de recuperação de senha com validação de e-mail.
 */

import UIButton from "@/components/UI/UIButton";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RecoverPasswordScreen() {
  const { theme, isDark } = useAppTheme();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailRegex.test(email);

  const handleSubmit = async () => {
    setTouched(true);
    if (!isValidEmail) {
      Alert.alert("E-mail inválido", "Verifique o formato do e-mail.");
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      Alert.alert("Sucesso", `Código enviado para: ${email}`);
    } catch (err) {
      setHasError(true);
      Alert.alert("Erro", "Não foi possível enviar o código.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WRScreenContainer style={[{ backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/hunter_sentado.png")} 
              style={{ width: 60, height: 60, marginBottom: 20 }}
            />

            <WRText style={[styles.title, { color: theme.colors.primary }]}>
              Recuperar Senha
            </WRText>
            <WRText style={[styles.subtitle, { color: theme.colors.muted }]}>
              Digite seu e-mail para receber o código de recuperação
            </WRText>
          </View>

          <View style={styles.form}>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
                },
              ]}
            >
              <TextInput
                placeholder="exemplo@email.com"
                placeholderTextColor={theme.colors.muted}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (!touched) setTouched(true);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, { color: theme.colors.text }]}
              />
            </View>

            {touched && email.length > 0 && !isValidEmail && (
              <WRText style={styles.errorText}>
                E-mail inválido. Verifique o formato.
              </WRText>
            )}

            <UIButton
              text="Enviar Código"
              onPress={handleSubmit}
              isLoading={isLoading}
              error={hasError}
              disabled={!isValidEmail}
              style={styles.button}
              size="large"
            />

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => console.log("Voltar")}
            >
              <WRText
                style={{
                  color: theme.colors.primary,
                  fontSize: 13,
                  textDecorationLine: "underline",
                }}
              >
                Voltar
              </WRText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </WRScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    width: "100%",
    paddingVertical: 16,
  },
  errorText: {
    color: "#ff4b4b",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 5,
  },
  button: {
    width: "100%",
    marginTop: 25,
  },
  backButton: {
    marginTop: 15,
    alignSelf: "center",
  },
});
