import { useAppTheme } from '@/context/theme-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { JSX } from 'react';
import { Image, ImageSourcePropType, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';


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
  staticSource = undefined
}: UIIconProps) {
  const { theme } = useAppTheme();
  const iconColor = color || theme.colors.primary;
  const iconBackgroundColor = backgroundColor || theme.icons.backgroundColor;
  const renderIcon = () => (
    <Ionicons
      name={name}
      size={size}
      color={iconColor}
      style={iconStyle}
    />
  );

  const staticIconStyles = StyleSheet.create({
    image: {
      width: size,
      height: size
    }  
  });

  const renderStaticIcon = () => (
    <Image source={staticSource} style={staticIconStyles.image} resizeMode="contain" />
  );

  const icon: JSX.Element = (staticSource != undefined) ? renderStaticIcon() : renderIcon(); 

  if (withBackground) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || !onPress}
        style={[
          {
            width: backgroundSize,
            height: backgroundSize,
            borderRadius: 8,
            backgroundColor: iconBackgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}
      >
        {icon}
      </TouchableOpacity>
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