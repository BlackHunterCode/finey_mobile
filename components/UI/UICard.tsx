import { useAppTheme } from "@/context/theme-context";
import { Props } from "@/types/JSXTypes";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

/**
 * 
 */
interface CardProps extends Props {
    fullWidth?: boolean;

    /**
     * Accordion Configurations 
     */
    activeAccordion?: boolean;
    accordionTitle?: string;
    accordionBeOpenDefault?: boolean;
    useDividerInAccordion?: boolean;
}

/**
 * 
 * @param cardProps 
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UICard({ 
        children, style, fullWidth=false, 
        activeAccordion=false, accordionTitle="", accordionBeOpenDefault=false, useDividerInAccordion=false 
    }: CardProps) {
    const { theme } = useAppTheme();

    /** States */
    const [withFullWidth, setWithFullWidth] = useState(false);
    const [withActiveAccordion, setWithActiveAccordion] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [useDividerAccordion, setUseDividerInAccordion] = useState(false);
    
    // Animation values
    const contentHeight = useSharedValue(0);
    const rotateValue = useSharedValue(0);

    /**
     * Initialize component state from props
     */
    useEffect(() => {
        setWithFullWidth(fullWidth);
        setWithActiveAccordion(activeAccordion);
        setAccordionOpen(accordionBeOpenDefault);
        setUseDividerInAccordion(useDividerInAccordion);
        
        // Set initial animation values based on accordion state
        if (activeAccordion) {
            contentHeight.value = accordionBeOpenDefault ? 1 : 0;
            rotateValue.value = accordionBeOpenDefault ? 1 : 0;
        }
    }, [fullWidth, activeAccordion, accordionBeOpenDefault, useDividerInAccordion]);
    
    /**
     * Toggle accordion open/close state
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
        return {
            transform: [{ rotate: `${rotateValue.value * 180}deg` }],
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
            ...(style as ViewStyle)
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
        }
    });

    return (
        <View style={componentStyle.cardContainer}>
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
        </View>
    );
}