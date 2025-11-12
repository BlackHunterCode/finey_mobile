/**
 * © 2025 Finey - Todos os Direitos Reservados.
 *
 * Tela de criação/alteração de nova senha.
 */

import UIButton from "@/components/UI/UIButton";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { useState } from "react";
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

export default function NewPasswordScreen() {
  const { theme, isDark } = useAppTheme();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const requirements = {
    minLength: password.length >= 8,
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };

  const allValid = Object.values(requirements).every(Boolean);
  const passwordsMatch = password === confirm && confirm.length > 0;

  const handleSubmit = async () => {
    if (!allValid || !passwordsMatch) {
      Alert.alert("Atenção", "Verifique os requisitos da senha.");
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
    } catch (err) {
      setHasError(true);
      Alert.alert("Erro", "Não foi possível alterar a senha.");
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
              Nova Senha
            </WRText>
            <WRText style={[styles.subtitle, { color: theme.colors.muted }]}>
              Crie uma senha forte para proteger sua conta
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
                placeholder="Digite sua nova senha"
                placeholderTextColor={theme.colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={[styles.input, { color: theme.colors.text }]}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.visibilityIcon}
              >
                <WRText style={{ color: theme.colors.primary }}>
                  {showPassword ? "Esconder" : "Mostrar"}
                </WRText>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
                  marginTop: 16,
                },
              ]}
            >
              <TextInput
                placeholder="Confirme sua nova senha"
                placeholderTextColor={theme.colors.muted}
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showConfirm}
                style={[styles.input, { color: theme.colors.text }]}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.visibilityIcon}
              >
                <WRText style={{ color: theme.colors.primary }}>
                  {showConfirm ? "Esconder" : "Mostrar"}
                </WRText>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.requirementsBox,
                {
                  borderColor: isDark ? "#333" : "#DDD",
                  backgroundColor: isDark ? "#111" : "#FFF",
                },
              ]}
            >
              <WRText style={styles.requirementTitle}>
                Requisitos da senha:
              </WRText>

              <WRText
                style={[
                  styles.requirementText,
                  requirements.minLength
                    ? styles.valid
                    : styles.invalid,
                ]}
              >
                {requirements.minLength ? "✓" : "✗"} Mínimo de 8 caracteres
              </WRText>
              <WRText
                style={[
                  styles.requirementText,
                  requirements.upperCase
                    ? styles.valid
                    : styles.invalid,
                ]}
              >
                {requirements.upperCase ? "✓" : "✗"} Uma letra maiúscula
              </WRText>
              <WRText
                style={[
                  styles.requirementText,
                  requirements.lowerCase
                    ? styles.valid
                    : styles.invalid,
                ]}
              >
                {requirements.lowerCase ? "✓" : "✗"} Uma letra minúscula
              </WRText>
              <WRText
                style={[
                  styles.requirementText,
                  requirements.number
                    ? styles.valid
                    : styles.invalid,
                ]}
              >
                {requirements.number ? "✓" : "✗"} Um número
              </WRText>
            </View>

            <UIButton
              text="Alterar Senha"
              onPress={handleSubmit}
              isLoading={isLoading}
              error={hasError}
              disabled={!allValid || !passwordsMatch}
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
  visibilityIcon: {
    position: "absolute",
    right: 16,
    padding: 8,
  },
  requirementsBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 24,
  },
  requirementTitle: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 12,
    marginVertical: 2,
  },
  valid: { color: "#00FF9F" },
  invalid: { color: "#888" },
  button: {
    width: "100%",
    marginTop: 25,
  },
  backButton: {
    marginTop: 15,
    alignSelf: "center",
  },
});
