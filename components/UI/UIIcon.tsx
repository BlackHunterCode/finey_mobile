import { useAppTheme } from '@/context/theme-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { JSX } from 'react';
import { Image, ImageSourcePropType, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';


interface UIIconProps {
  name?: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color?: string;
  backgroundColor?: string;
  withBackground?: boolean;
  backgroundSize?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>; 
  iconStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  staticSource?: ImageSourcePropType | undefined;
  useSvg?: boolean;
  useGradient?: boolean;
  gradientColors?: string[];
}

export default function UIIcon({
  name,
  size = 24,
  color,
  backgroundColor,
  withBackground = false,
  backgroundSize = 40,
  onPress,
  style,
  iconStyle,
  disabled = false,
  staticSource = undefined,
  useGradient = false,
  gradientColors = []
}: UIIconProps) {
  const { theme } = useAppTheme();
  const iconColor = color || theme.colors.primary;
  const iconBackgroundColor = backgroundColor || theme.icons.backgroundColor;
  
  // Função para detectar se é um emoji
  const isEmoji = (str: string): boolean => {
    const emojiRegex = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]$/u;
    return emojiRegex.test(str);
  };
  
  const renderIcon = () => {
    // Se name não existe, retorna null
    if (!name) return null;
    
    // Se é um emoji, renderiza como Text
    if (isEmoji(name)) {
      return (
        <Text style={[{ fontSize: size, color: iconColor }, iconStyle]}>
          {name}
        </Text>
      );
    }
    
    // Se não é um emoji, tenta renderizar como ícone do Ionicons
    try {
      return (
        <Ionicons
          name={name as React.ComponentProps<typeof Ionicons>['name']}
          size={size}
          color={iconColor}
          style={iconStyle}
        />
      );
    } catch (error) {
      // Se não é um ícone válido do Ionicons, lança erro
      throw new Error(`Ícone inválido: "${name}" não é um ícone válido do Ionicons nem um emoji válido.`);
    }
  };

  const staticIconStyles = StyleSheet.create({
    image: {
      width: size,
      height: size
    }  
  });

  const renderStaticIcon = () => (
    <Image source={staticSource} style={staticIconStyles.image} resizeMode="contain" />
  );

  const icon: JSX.Element | null = (staticSource != undefined) ? renderStaticIcon() : renderIcon(); 

  if (withBackground) {
    return (
      useGradient && gradientColors ? (
        <LinearGradient
          colors={gradientColors as [string, string]}
          style={{
            width: backgroundSize,
            height: backgroundSize,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {icon}
        </LinearGradient>
      ) : (
        <View
          style={{
            width: backgroundSize,
            height: backgroundSize,
            borderRadius: 8,
            backgroundColor: iconBackgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {icon}
        </View>
      )
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} style={style}>
        {icon}
      </TouchableOpacity>
    );
  }

  return <View style={style}>{icon}</View>;
}