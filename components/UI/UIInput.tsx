import { useAppTheme } from "@/context/theme-context";
import { Props } from "@/types/JSXTypes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import WRText from "../wrappers/WRText";

interface UIInputProps extends Omit<Props, "children"> {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  description?: string;
  icon?: string; 
}

export default function UIInput({
  placeholder = "",
  value,
  onChangeText,
  label,
  description,
  icon = "search",
  style,
}: UIInputProps) {
  const { theme } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 15,
      ...(style as object),
    },
    label: {
      color: theme.colors.text,
      fontWeight: "600",
      fontSize: 15,
      marginBottom: 5,
    },
    description: {
      color: "gray",
      fontSize: 12,
      marginTop: 2,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    input: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.container}>
      {label && <WRText style={styles.label}>{label}</WRText>}

      <View style={styles.inputContainer}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={18}
            color={theme.colors.text}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="gray"
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
      </View>

      {description && <WRText style={styles.description}>{description}</WRText>}
    </View>
  );
}
