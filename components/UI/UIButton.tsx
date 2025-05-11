import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, LinkProps } from 'expo-router';
import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    text: string;
    onPress?: () => void;
    href?: LinkProps['href'];
    icon?: string;
    iconPosition?: 'left' | 'right';
    hasBackground?: boolean;
    textColor?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
}

/**
 * UIButton - Um componente de botão redondo responsivo
 * 
 * @param props ButtonProps
 * @returns React.JSX.Element
 */
export default function UIButton({
    text,
    onPress,
    href,
    icon,
    iconPosition = 'left',
    hasBackground = true,
    textColor,
    style,
    textStyle,
    disabled = false,
    size = 'medium'
}: ButtonProps) {
    const { theme } = useAppTheme();
    
    // Determine sizes based on the size prop
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    fontSize: 12,
                    iconSize: 14
                };
            case 'large':
                return {
                    paddingVertical: 14,
                    paddingHorizontal: 24,
                    fontSize: 18,
                    iconSize: 22
                };
            default: // medium
                return {
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    fontSize: 16,
                    iconSize: 18
                };
        }
    };
    
    const sizeStyles = getSizeStyles();
    
    // Button styles based on props
    const buttonStyles: ViewStyle = {
        backgroundColor: hasBackground ? theme.colors.primary : 'transparent',
        borderRadius: 50, // Makes it round
        flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: sizeStyles.paddingVertical,
        paddingHorizontal: sizeStyles.paddingHorizontal,
        opacity: disabled ? 0.6 : 1,
    };
    
    // Text styles based on props
    const buttonTextStyles: TextStyle = {
        color: textColor || (hasBackground ? '#FFFFFF' : theme.colors.primary),
        fontSize: sizeStyles.fontSize,
        fontWeight: '600',
        marginLeft: icon && iconPosition === 'left' ? 8 : 0,
        marginRight: icon && iconPosition === 'right' ? 8 : 0,
    };
    
    // Button content component to avoid duplication
    const ButtonContent = () => (
        <>
            {icon && (
                <Ionicons 
                    name={icon as any} 
                    size={sizeStyles.iconSize} 
                    color={textColor || (hasBackground ? '#FFFFFF' : theme.colors.primary)} 
                />
            )}
            <Text style={[buttonTextStyles, textStyle]}>{text}</Text>
        </>
    );
    
    // If href is provided, use Link component for navigation
    if (href) {
        return (
            <Link href={href} asChild>
                <TouchableOpacity 
                    style={[buttonStyles, style]} 
                    activeOpacity={0.7}
                    disabled={disabled}
                >
                    <ButtonContent />
                </TouchableOpacity>
            </Link>
        );
    }
    
    // Otherwise use regular TouchableOpacity with onPress
    return (
        <TouchableOpacity 
            style={[buttonStyles, style]} 
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <ButtonContent />
        </TouchableOpacity>
    );
}