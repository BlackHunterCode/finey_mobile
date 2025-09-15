import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, LinkProps } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleProp,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';

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
    isLoading?: boolean;
    error?: boolean;
}

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
    size = 'medium',
    isLoading = false,
    error = false
}: ButtonProps) {
    const { theme } = useAppTheme();
    const [displayError, setDisplayError] = useState(false);
    const [buttonText, setButtonText] = useState(text);
    
    // Animação de shake (nativa) - agora aplicada ao botão inteiro
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    
    // Estado para a cor de fundo
    const [backgroundColor, setBackgroundColor] = useState(
        hasBackground ? theme.colors.primary : 'transparent'
    );

    useEffect(() => {
        if (error) {
            setDisplayError(true);
            setButtonText("Erro na operação!");
            
            // Resetar animação
            shakeAnimation.setValue(0);

            // Animação de shake mais intensa (botão inteiro)
            Animated.sequence([
                Animated.timing(shakeAnimation, {
                    toValue: 15,  // Aumentei a intensidade do shake
                    duration: 80,
                    useNativeDriver: true
                }),
                Animated.timing(shakeAnimation, {
                    toValue: -15,
                    duration: 80,
                    useNativeDriver: true
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 15,
                    duration: 80,
                    useNativeDriver: true
                }),
                Animated.timing(shakeAnimation, {
                    toValue: -15,
                    duration: 80,
                    useNativeDriver: true
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 15,
                    duration: 80,
                    useNativeDriver: true
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 0,
                    duration: 80,
                    useNativeDriver: true
                })
            ]).start();

            // Mudança para cor vermelha
            setBackgroundColor(theme.colors.error || '#FF0000');
            
            // Voltar ao normal após 4 segundos (aumentei o tempo)
            const timer = setTimeout(() => {
                setBackgroundColor(hasBackground ? theme.colors.primary : 'transparent');
                setDisplayError(false);
                setButtonText(text);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [error]);

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

    const buttonContainerStyles: ViewStyle = {
        borderRadius: 50,
        flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: sizeStyles.paddingVertical,
        paddingHorizontal: sizeStyles.paddingHorizontal,
        opacity: disabled ? 0.6 : 1,
        backgroundColor: backgroundColor,
    };
    
    const buttonTextStyles: TextStyle = {
        color: textColor || (hasBackground ? '#FFFFFF' : theme.colors.primary),
        fontSize: sizeStyles.fontSize,
        fontWeight: '600',
        marginLeft: icon && iconPosition === 'left' ? 8 : 0,
        marginRight: icon && iconPosition === 'right' ? 8 : 0,
    };
    
    const ButtonContent = () => (
        <>
            {isLoading ? (
                <ActivityIndicator color={textColor || (hasBackground ? '#FFFFFF' : theme.colors.primary)} />
            ) : (
                <>
                    {icon && (
                        <Ionicons 
                            name={icon as any} 
                            size={sizeStyles.iconSize} 
                            color={textColor || (hasBackground ? '#FFFFFF' : theme.colors.primary)} 
                        />
                    )}
                    <Text style={[buttonTextStyles, textStyle]}>{buttonText}</Text>
                </>
            )}
        </>
    );

    const animatedStyle = {
        transform: [{ translateX: shakeAnimation }],
    };

    if (href) {
        return (
            <Link href={href} asChild>
                <Animated.View style={[animatedStyle, { borderRadius: 50 }]}>
                    <TouchableOpacity 
                        style={[buttonContainerStyles, style]}
                        activeOpacity={0.7}
                        disabled={disabled || isLoading || displayError}
                    >
                        <ButtonContent />
                    </TouchableOpacity>
                </Animated.View>
            </Link>
        );
    }
    
    return (
        <Animated.View style={[animatedStyle, { borderRadius: 50 }]}>
            <TouchableOpacity 
                style={[buttonContainerStyles, style]}
                onPress={onPress}
                activeOpacity={0.7}
                disabled={disabled || isLoading || displayError}
            >
                <ButtonContent />
            </TouchableOpacity>
        </Animated.View>
    );
}