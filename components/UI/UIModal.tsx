import { useAppTheme } from "@/context/theme-context";
import { Props } from "@/types/JSXTypes";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

/**
 * Tamanhos predefinidos para o modal
 */
type ModalSize = "small" | "medium" | "large" | "custom";

/**
 * Posição do modal na tela
 */
type ModalPosition = "center" | "bottom";

/**
 * Propriedades do componente Modal
 */
interface ModalProps extends Props {
    /**
     * Controla a visibilidade do modal
     */
    visible: boolean;
    
    /**
     * Função chamada quando o modal é fechado
     */
    onClose: () => void;
    
    /**
     * Tamanho do modal (small, medium, large ou custom)
     * @default "medium"
     */
    size?: ModalSize;
    
    /**
     * Largura personalizada (quando size="custom")
     */
    customWidth?: number | string;
    
    /**
     * Altura personalizada (quando size="custom")
     */
    customHeight?: number | string;
    
    /**
     * Posição do modal na tela (center ou bottom)
     * @default "center"
     */
    position?: ModalPosition;
    
    /**
     * Título do modal
     */
    title?: string;
    
    /**
     * Se true, fecha o modal ao tocar no backdrop
     * @default true
     */
    closeOnBackdropPress?: boolean;
    
    /**
     * Se true, mostra o botão de fechar
     * @default true
     */
    showCloseButton?: boolean;
    
    /**
     * Estilo adicional para o container do modal
     */
    containerStyle?: ViewStyle;
}

/**
 * Componente de modal customizável com suporte para diferentes tamanhos e posições
 * @param modalProps Propriedades do componente
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UIModal({
    children,
    style,
    visible,
    onClose,
    size = "medium",
    customWidth,
    customHeight,
    position = "center",
    title,
    closeOnBackdropPress = true,
    showCloseButton = true,
    containerStyle
}: ModalProps) {
    const { theme } = useAppTheme();
    const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
    
    // Valores de animação
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);
    const translateY = useSharedValue(position === "bottom" ? 100 : 0);
    
    // Estado interno para controlar a visibilidade real do modal
    // (permite que a animação de saída seja concluída antes de fechar o modal)
    const [internalVisible, setInternalVisible] = useState(false);
    
    /**
     * Atualiza o estado interno quando a prop visible muda
     */
    useEffect(() => {
        if (visible) {
            setInternalVisible(true);
            // Anima a entrada do modal
            opacity.value = withTiming(1, { duration: 300 });
            scale.value = withSpring(1);
            translateY.value = withSpring(0);
        } else {
            // Anima a saída do modal
            opacity.value = withTiming(0, { duration: 200 });
            scale.value = withTiming(0.8, { duration: 200 });
            translateY.value = withTiming(position === "bottom" ? 100 : 0, { duration: 200 });
            
            // Aguarda a animação terminar antes de fechar o modal
            setTimeout(() => {
                setInternalVisible(false);
            }, 200);
        }
    }, [visible, position]);
    
    /**
     * Fecha o modal
     */
    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);
    
    /**
     * Lida com o toque no backdrop
     */
    const handleBackdropPress = useCallback(() => {
        if (closeOnBackdropPress) {
            handleClose();
        }
    }, [closeOnBackdropPress, handleClose]);
    
    /**
     * Calcula as dimensões do modal com base no tamanho selecionado
     */
    const getModalDimensions = useCallback(() => {
        switch (size) {
            case "small":
                return {
                    width: screenWidth * 0.7,
                    maxHeight: screenHeight * 0.5
                };
            case "medium":
                return {
                    width: screenWidth * 0.85,
                    maxHeight: screenHeight * 0.7
                };
            case "large":
                return {
                    width: screenWidth * 0.95,
                    maxHeight: screenHeight * 0.9
                };
            case "custom":
                return {
                    width: customWidth || screenWidth * 0.85,
                    height: customHeight,
                    maxHeight: customHeight ? undefined : screenHeight * 0.7
                };
        }
    }, [size, screenWidth, screenHeight, customWidth, customHeight]);
    
    /**
     * Estilos animados para o container do modal
     */
    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                { scale: scale.value },
                { translateY: translateY.value }
            ]
        };
    });
    
    // Estilos base do modal
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
        ...getModalDimensions() as ViewStyle
    };
    
    const componentStyle = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: position === "center" ? "center" : "flex-end",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            paddingBottom: position === "bottom" ? 20 : 0
        },
        modalContent: {
            ...baseStyle,
            ...(style as ViewStyle),
            ...(containerStyle as ViewStyle)
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: title ? 16 : 0
        },
        title: {
            fontSize: 18,
            fontWeight: "600",
            color: theme.colors.text,
            flex: 1
        },
        closeButton: {
            padding: 4
        }
    });
    
    return (
        <Modal
            transparent
            visible={internalVisible}
            animationType="none"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <View style={componentStyle.modalContainer}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={[componentStyle.modalContent, animatedContainerStyle]}>
                            {(title || showCloseButton) && (
                                <View style={componentStyle.header}>
                                    {title && <Text style={componentStyle.title}>{title}</Text>}
                                    {showCloseButton && (
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={handleClose}
                                            style={componentStyle.closeButton}
                                        >
                                            <Ionicons
                                                name="close"
                                                size={24}
                                                color={theme.colors.text}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                            {children}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}