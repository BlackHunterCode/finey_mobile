import { useAppTheme } from "@/context/theme-context";
import { Props } from "@/types/JSXTypes";
import React from "react";
import { StyleSheet, Switch, View } from "react-native";
import WRText from "../wrappers/WRText";

interface UIToggleProps extends Omit<Props, "children"> {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

/**
 * Componente reutilizável de toggle com label e descrição
 * @param label Título principal
 * @param description Texto menor embaixo
 * @param value Estado atual do switch
 * @param onValueChange Função chamada ao alternar
 */
export default function UIToggle({
  label,
  description,
  value,
  onValueChange,
  style,
}: UIToggleProps) {
  const { theme } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 15,
      ...(style as object),
    },
    textContainer: {
      flex: 1,
      marginRight: 12,
    },
    label: {
      color: theme.colors.text,
      fontWeight: "600",
      fontSize: 15,
    },
    description: {
      color: 'gray',
      fontSize: 12,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <WRText style={styles.label}>{label}</WRText>
        {description && <WRText style={styles.description}>{description}</WRText>}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary,
        }}
        thumbColor={value ? theme.colors.card : theme.colors.text}
      />
    </View>
  );
}
