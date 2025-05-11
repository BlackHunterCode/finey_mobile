import { useAppTheme } from '@/context/theme-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface UIIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color?: string;
  backgroundColor?: string;
  withBackground?: boolean;
  backgroundSize?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>; 
  iconStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
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
        {renderIcon()}
      </TouchableOpacity>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} style={style}>
        {renderIcon()}
      </TouchableOpacity>
    );
  }

  return <View style={style}>{renderIcon()}</View>;
}