import { useAppTheme } from "@/context/theme-context";
import { Props } from "@/types/JSXTypes";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode, useRef, useState } from "react";
import { Modal, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import WRText from "../wrappers/WRText";

interface UIDropdownProps extends Props {
    trigger: ReactNode;
    dropdownStyle?: StyleProp<ViewStyle>;
}

/**
 * Componente de dropdown customizável que segue o padrão de design da aplicação
 * @param props Propriedades do componente
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UIDropdown({
    trigger,
    children,
    style,
    dropdownStyle
}: UIDropdownProps) {
    const { theme } = useAppTheme();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);
    const [triggerPosition, setTriggerPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const toggleDropdown = () => {
        if (triggerRef.current) {
            triggerRef.current.measure((_fx, _fy, width, height, px, py) => {
                setTriggerPosition({ x: px, y: py, width, height });
            });
        }
        setIsOpen(!isOpen);
    };

    const styles = StyleSheet.create({
        container: {
            position: 'relative',
            alignSelf: 'flex-start',
            ...(style as ViewStyle)
        },
        modalOverlay: {
            flex: 1,
        },
        dropdown: {
            position: 'absolute',
            backgroundColor: theme.colors.card,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.text,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            minWidth: 150,
            zIndex: 1000,
        },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity ref={triggerRef} onPress={toggleDropdown} activeOpacity={0.7}>
                {trigger}
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="none"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
                    <View style={[styles.dropdown, {
                        top: triggerPosition.y + triggerPosition.height + 8,
                        left: triggerPosition.x
                    }, dropdownStyle]}>
                        {children}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

interface DropdownItemProps extends Props {
    onPress?: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
    isDivider?: boolean;
}

export const UIDropdownItem = ({ children, onPress, icon, style, isDivider = false }: DropdownItemProps) => {
    const { theme } = useAppTheme();

    const styles = StyleSheet.create({
        item: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            ...(style as ViewStyle)
        },
        itemText: {
            color: theme.colors.text,
            marginLeft: icon ? 12 : 0,
            flex: 1,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: 8,
        }
    });

    if (isDivider) {
        return <View style={styles.divider} />;
    }

    return (
        <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
            {icon && <Ionicons name={icon} size={20} color={theme.colors.text} />}
            <WRText style={styles.itemText}>{children}</WRText>
        </TouchableOpacity>
    );
};