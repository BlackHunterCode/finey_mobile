import { useAppTheme } from "@/context/theme-context";
import { Props } from "@/types/JSXTypes";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

/**
 * Componente de card para a interface do usuário
 */
interface CardProps extends Props {
    fullWidth?: boolean;

    /**
     * Configurações do Accordion 
     */
    activeAccordion?: boolean;
    accordionTitle?: string;
    accordionBeOpenDefault?: boolean;
    useDividerInAccordion?: boolean;
    
    /**
     * Configurações de Navegação em Stack
     */
    openStack?: boolean;
    href?: string;
    onPress?: () => void;

    /**
     * Configurações da Barra de Progresso
     */
    showProgressBar?: boolean;
    progressValue?: number; // Value between 0 and 100
}

/**
 * Componente de card customizável com suporte para accordion, navegação e barra de progresso
 * @param cardProps Propriedades do componente
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UICard({ 
        children, style, fullWidth=false, 
        activeAccordion=false, accordionTitle="", accordionBeOpenDefault=false, useDividerInAccordion=false,
        openStack=false, href="", onPress,
        showProgressBar=false, progressValue=0
    }: CardProps) {
    const { theme } = useAppTheme();

    /** Estados */
    const [withFullWidth, setWithFullWidth] = useState(false);
    const [withActiveAccordion, setWithActiveAccordion] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [useDividerAccordion, setUseDividerInAccordion] = useState(false);
    const [withOpenStack, setWithOpenStack] = useState(false);
    
    // Valores de animação
    const contentHeight = useSharedValue(0);
    const rotateValue = useSharedValue(0);

    /**
     * Inicializa o estado do componente a partir das props
     */
    useEffect(() => {
        setWithFullWidth(fullWidth);
        setWithActiveAccordion(activeAccordion);
        setAccordionOpen(accordionBeOpenDefault);
        setUseDividerInAccordion(useDividerInAccordion);
        setWithOpenStack(openStack);
        
        if (activeAccordion) {
            contentHeight.value = accordionBeOpenDefault ? 1 : 0;
            rotateValue.value = accordionBeOpenDefault ? 1 : 0;
        }
    }, [fullWidth, activeAccordion, accordionBeOpenDefault, useDividerInAccordion, openStack]);
    
    /**
     * Alterna o estado de aberto/fechado do accordion
     */
    const toggleAccordion = useCallback(() => {
        setAccordionOpen(prev => {
            const newState = !prev;
            // Animate height and rotation
            contentHeight.value = withTiming(newState ? 1 : 0, { duration: 300 });
            rotateValue.value = withTiming(newState ? 1 : 0, { duration: 300 });
            return newState;
        });
    }, [contentHeight, rotateValue]);
    
    /**
     * Navega para a rota especificada no stack
     */
    const navigateToStack = useCallback(() => {
        // Se tiver uma função onPress personalizada, use-a em vez da navegação padrão
        if (onPress) {
            onPress();
            return;
        }
        
        // Caso contrário, use a navegação padrão com href
        if (href) {
            try {
                // Tenta navegar usando o router.push
                router.push(href as any);
            } catch (error) {
                console.error('Navigation error:', error);
                
                // Fallback: tenta diferentes formatos de rota se o primeiro falhar
                if (href.startsWith('./')) {
                    // Remove o ./ e tenta novamente
                    const newPath = href.substring(2);
                    router.push(newPath as any);
                } else if (href.startsWith('/')) {
                    // Remove a / inicial e tenta novamente
                    const newPath = href.substring(1);
                    router.push(newPath as any);
                } else {
                    // Adiciona / no início e tenta novamente
                    router.push(`/${href}` as any);
                }
            }
        }
    }, [href, onPress]);
    
    /**
     * Animated styles for content container
     */
    const animatedContentStyle = useAnimatedStyle(() => {
        return {
            opacity: contentHeight.value,
            maxHeight: contentHeight.value * 1000, // Large enough value to accommodate content
            overflow: 'hidden',
        };
    });
    
    /**
     * Animated styles for the chevron icon
     */
    const animatedIconStyle = useAnimatedStyle(() => {
        const rotation = rotateValue.value * 180;
        return {
            transform: [{ rotate: `${rotation}deg` }],
        };
    });

    // Estilos base do card
    const baseStyle: ViewStyle = {
        backgroundColor: theme.colors.card,
        borderRadius: 8,
        borderColor: theme.colors.border,
        borderWidth: 0.5,
        padding: 16,
        shadowColor: theme.colors.text,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.5,
        elevation: 3,
        width: withFullWidth ? '100%' : 'auto',
    };
    
    const componentStyle = StyleSheet.create({
        cardContainer: {
            ...baseStyle,
            ...(style as ViewStyle),
            overflow: 'hidden',
            position: 'relative',
            paddingBottom: showProgressBar ? 24 : 16 // Add extra padding at bottom when progress bar is shown
        },
        accordionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 4,
        },
        accordionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            flex: 1,
        },
        accordionContent: {
            marginTop: 8,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: 8,
        },
        iconContainer: {
            padding: 4,
        },
        stackCardContainer: {
            position: 'relative',
        },
        stackChevronContainer: {
            position: 'absolute',
            right: 16,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
        },
        stackChevronTouchable: {
            padding: 8,
            borderRadius: 15,
        },
        progressBarContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: '#B5B5B5',
        },
        progressBar: {
            height: '100%',
            backgroundColor: theme.colors.primary,
            width: `${Math.min(Math.max(progressValue, 0), 100)}%`,
        }
    });

    return (
        <View style={[componentStyle.cardContainer, withOpenStack && componentStyle.stackCardContainer]}>
            {withActiveAccordion ? (
                <>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={toggleAccordion} 
                        style={componentStyle.accordionHeader}
                    >
                        <Text style={componentStyle.accordionTitle}>{accordionTitle}</Text>
                        <Animated.View style={[componentStyle.iconContainer, animatedIconStyle]}>
                            <Ionicons 
                                name="chevron-down" 
                                size={20} 
                                color={theme.colors.text} 
                            />
                        </Animated.View>
                    </TouchableOpacity>
                    
                    <Animated.View style={animatedContentStyle}>
                        {useDividerAccordion && <View style={componentStyle.divider} />}
                        <View style={componentStyle.accordionContent}>
                            {children}
                        </View>
                    </Animated.View>
                </>
            ) : (
                children
            )}
            
            {withOpenStack && (
                <View style={componentStyle.stackChevronContainer}>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={navigateToStack}
                        style={componentStyle.stackChevronTouchable}
                    >
                        <Ionicons 
                            name="chevron-forward" 
                            size={20} 
                            color={theme.colors.muted} 
                        />
                    </TouchableOpacity>
                </View>
            )}

            {showProgressBar && (
                <View style={componentStyle.progressBarContainer}>
                    <View style={componentStyle.progressBar} />
                </View>
            )}
        </View>
    );
}