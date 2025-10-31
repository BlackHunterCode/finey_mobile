/**
 * © 2025 Finey - Todos os Direitos Reservados.
 *
 * Tela de recuperação de senha com validação de e-mail.
 */

import UIButton from "@/components/UI/UIButton";
import UIInput from "@/components/UI/UIInput";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function RecoverPasswordScreen() {
  const { theme, isDark } = useAppTheme();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidEmail = emailRegex.test(email);

  const handleSubmit = () => {
    setTouched(true);
    if (!isValidEmail) return;
    console.log("Enviando código para:", email);
  };

  const styles = StyleSheet.create({
    center: { alignItems: "center", justifyContent: "center" },
    inputContainer: { marginTop: 25, width: "100%" },
    errorText: {
      color: "#ff4b4b",
      fontSize: 12,
      marginTop: 4,
      marginLeft: 5,
    },
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
          Recuperar Senha
        </WRText>
        <WRText
          style={{
            textAlign: "center",
            marginTop: 5,
            opacity: 0.8,
            fontSize: 13,
          }}
        >
          Digite seu e-mail para receber o código de recuperação
        </WRText>
      </View>

      <View style={styles.inputContainer}>
        <WRText style={{ marginBottom: 5 }}>E-mail</WRText>
        <UIInput
          placeholder="exemplo@email.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (!touched) setTouched(true);
          }}
        />
        {touched && email.length > 0 && !isValidEmail && (
          <WRText style={styles.errorText}>
            E-mail inválido. Verifique o formato.
          </WRText>
        )}
      </View>

      <View style={{ marginTop: 25 }}>
        <UIButton
          text="Enviar Código"
          onPress={handleSubmit}
          disabled={!isValidEmail}
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
          voltar para a tela anterior
        </WRText>
      </TouchableOpacity>
    </WRScreenContainer>
  );
}
