/**
 * © 2025 Finey - Todos os Direitos Reservados.
 *
 * Tela de criação/alteração de nova senha.
 */

import UIButton from "@/components/UI/UIButton";
import UIInput from "@/components/UI/UIInput";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewPasswordScreen() {
  const { theme, isDark } = useAppTheme();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const requirements = {
    minLength: password.length >= 8,
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };

  const allValid = Object.values(requirements).every(Boolean);
  const passwordsMatch = password === confirm && confirm.length > 0;

  const handleSubmit = () => {
    if (!allValid || !passwordsMatch) return;
    console.log("Senha alterada com sucesso:", password);
  };

  const styles = StyleSheet.create({
    center: { alignItems: "center", justifyContent: "center" },
    inputContainer: { marginTop: 15, width: "100%" },
    iconButton: { position: "absolute", right: 10, top: 18 },
    requirementsBox: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 10,
      marginTop: 15,
      borderColor: isDark ? "#333" : "#DDD",
      backgroundColor: isDark ? "#111" : "#FFF",
    },
    requirementText: {
      fontSize: 12,
      marginVertical: 2,
    },
    valid: { color: "#00FF9F" },
    invalid: { color: "#888" },
  });

  return (
    <WRScreenContainer>
      <View style={styles.center}>
        <Image
          style={{ width: 60, height: 60, marginBottom: 20 }}
        />

        <WRText
          style={{
            fontWeight: "bold",
            fontSize: 20,
            color: theme.colors.primary,
          }}
        >
          Nova Senha
        </WRText>
        <WRText
          style={{
            textAlign: "center",
            marginTop: 5,
            opacity: 0.8,
            fontSize: 13,
          }}
        >
          Crie uma senha forte para proteger sua conta
        </WRText>
      </View>

      <View style={styles.inputContainer}>
        <WRText>Nova Senha</WRText>
        <View>
          <UIInput
            placeholder="Digite sua nova senha"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={isDark ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <WRText>Confirmar Senha</WRText>
        <View>
          <UIInput
            placeholder="Digite a senha novamente"
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowConfirm(!showConfirm)}
          >
            <Ionicons
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={isDark ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.requirementsBox}>
        <WRText style={{ fontWeight: "bold", fontSize: 13 }}>
          Requisitos da senha:
        </WRText>
        <WRText
          style={[
            styles.requirementText,
            requirements.minLength ? styles.valid : styles.invalid,
          ]}
        >
          {requirements.minLength ? "✓" : "✗"} Mínimo de 8 caracteres
        </WRText>
        <WRText
          style={[
            styles.requirementText,
            requirements.upperCase ? styles.valid : styles.invalid,
          ]}
        >
          {requirements.upperCase ? "✓" : "✗"} Uma letra maiúscula
        </WRText>
        <WRText
          style={[
            styles.requirementText,
            requirements.lowerCase ? styles.valid : styles.invalid,
          ]}
        >
          {requirements.lowerCase ? "✓" : "✗"} Uma letra minúscula
        </WRText>
        <WRText
          style={[
            styles.requirementText,
            requirements.number ? styles.valid : styles.invalid,
          ]}
        >
          {requirements.number ? "✓" : "✗"} Um número
        </WRText>
      </View>

      <View style={{ marginTop: 25 }}>
        <UIButton
          text="Alterar Senha"
          onPress={handleSubmit}
          disabled={!allValid || !passwordsMatch}
        />
      </View>

      <TouchableOpacity
        style={{ marginTop: 15, alignSelf: "center" }}
        onPress={() => console.log("Voltar")}
      >
        <WRText
          style={{
            color: theme.colors.primary,
            fontSize: 12,
            textDecorationLine: "underline",
          }}
        >
          Voltar
        </WRText>
      </TouchableOpacity>
    </WRScreenContainer>
  );
}
