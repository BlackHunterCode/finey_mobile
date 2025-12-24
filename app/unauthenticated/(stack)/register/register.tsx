/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 *
 * Tela de Cadastro.
 */

import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import UIButton from "@/components/UI/UIButton";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";

export default function RegisterScreen() {
  const { theme, isDark } = useAppTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <WRScreenContainer style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <WRText
          style={[
            styles.title,
            { color: theme.colors.primary },
          ]}
        >
          Criar Conta
        </WRText>

        <WRText
          style={[
            styles.subtitle,
            { color: theme.colors.muted },
          ]}
        >
          Preencha os dados para criar sua conta
        </WRText>

        <View style={styles.form}>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor={theme.colors.muted}
              style={[styles.input, { color: theme.colors.text }]}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={theme.colors.muted}
              style={[styles.input, { color: theme.colors.text }]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              placeholderTextColor={theme.colors.muted}
              style={[styles.input, { color: theme.colors.text }]}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconButton}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.muted}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar senha"
              placeholderTextColor={theme.colors.muted}
              style={[styles.input, { color: theme.colors.text }]}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.iconButton}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.colors.muted}
              />
            </TouchableOpacity>
          </View>

          <UIButton
            text="Criar Conta"
            style={styles.button}
            size="large"
            onPress={() => console.log("Criar conta")}
          />
        </View>

        <View style={styles.footer}>
          <WRText style={{ color: theme.colors.muted }}>
            Já tem uma conta?{" "}
          </WRText>
          <Link href="../login/login" asChild>
            <WRText style={{ color: theme.colors.primary }}>Faça login</WRText>
          </Link>
        </View>
      </View>
    </WRScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    position: "relative",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "center",
  },
  input: {
    fontSize: 15,
    width: "100%",
  },
  iconButton: {
    position: "absolute",
    right: 16,
    padding: 6,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
});
