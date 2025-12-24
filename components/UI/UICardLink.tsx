import { useAppTheme } from "@/context/theme-context";
import { Props } from "@/types/JSXTypes";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import WRText from "../wrappers/WRText";

interface UICardLinkProps extends Omit<Props, "children"> {
  title: string;
  subtitle?: string;
  icon?: string;
  backgroundColor?: string;
  backgroundImage?: ImageSourcePropType;
  onPress?: () => void;
}

export default function UICardLink({
  title,
  subtitle,
  icon,
  backgroundColor,
  backgroundImage,
  onPress,
  style,
}: UICardLinkProps) {
  const { theme } = useAppTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(opacity, {
      toValue: 0.8,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const styles = StyleSheet.create({
    container: {
      borderRadius: 16,
      overflow: "hidden",
      ...(style as object),
      backgroundColor: backgroundColor || theme.colors.card,
      minHeight: 120,
      width: '49%'
    },
    backgroundImage: {
      ...StyleSheet.absoluteFillObject,
      resizeMode: "cover",
      opacity: 0.15,
    },
    overlay: {
      flex: 1,
      padding: 16,
      justifyContent: "space-between",
    },
    iconWrapper: {
      backgroundColor: "rgba(0,0,0,0.2)",
      alignSelf: "flex-start",
      borderRadius: 50,
      padding: 8,
      marginBottom: 10,
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    subtitle: {
      color: "gray",
      fontSize: 13,
      marginTop: 2,
    },
  });

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {backgroundImage && (
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 16 }}
        />
      )}

      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} style={{ flex: 1 }}>
        <View style={styles.overlay}>
          {icon && (
            <View style={styles.iconWrapper}>
              <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
            </View>
          )}
          <View>
            <WRText style={styles.title}>{title}</WRText>
            {subtitle && <WRText style={styles.subtitle}>{subtitle}</WRText>}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
