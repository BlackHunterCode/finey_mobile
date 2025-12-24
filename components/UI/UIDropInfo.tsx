import { useAppTheme } from "@/context/theme-context";
import { Props } from "@/types/JSXTypes";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    TouchableOpacity,
    UIManager,
    View
} from "react-native";
import WRText from "../wrappers/WRText";

interface UIDropInfoProps extends Props {
  title: string;
  defaultOpen?: boolean;
}

/**
 * Componente estilo "Accordion" para mostrar/esconder conteúdo
 * @param props.title Título do drop
 * @param props.children Conteúdo exibido quando aberto
 * @param props.defaultOpen Se inicia aberto
 */
export default function UIDropInfo({
  title,
  children,
  style,
  defaultOpen = false
}: UIDropInfoProps) {
  const { theme } = useAppTheme();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
      ...(style as object)
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    title: {
      color: theme.colors.text,
      fontWeight: "600",
      fontSize: 16,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleOpen} activeOpacity={0.7}>
        <WRText style={styles.title}>{title}</WRText>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}
