import { useAppTheme } from "@/context/theme-context";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Modal, ScrollView, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import WRText from "../wrappers/WRText";
import UIIcon from "./UIIcon";

export interface SelectOption {
    label: string;
    value: any;
    disabled?: boolean;
}

interface UISelectProps {
    options: SelectOption[];
    value?: any;
    placeholder?: string;
    onChange?: (value: any) => void;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>; 
}

/**
 * Componente de seleção customizável que segue o padrão de design da aplicação
 * @param props Propriedades do componente
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UISelect({
    options,
    value,
    placeholder = "Selecione uma opção",
    onChange,
    style,
    disabled = false,
    error = false,
    errorMessage = "",
    children
}: UISelectProps) {
    const { theme } = useAppTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
    const modalHeight = Dimensions.get('window').height * 0.4;

    useEffect(() => {
        if (value) {
            const option = options.find(opt => opt.value === value);
            if (option) setSelectedOption(option);
        }
    }, [value, options]);

    const handleSelect = useCallback((option: SelectOption) => {
        if (option.disabled) return;
        setSelectedOption(option);
        setIsOpen(false);
        onChange?.(option.value);
    }, [onChange]);

    const styles = StyleSheet.create({
        container: {
            width: '100%',
        },
        selectButton: {
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: 8,
            padding: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: disabled ? 0.5 : 1,
            ...(style as ViewStyle)
        },
        selectedText: {
            color: selectedOption ? theme.colors.text : theme.colors.muted,
            flex: 1,
            marginRight: 8
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        modalContent: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            width: '90%',
            maxHeight: modalHeight,
            padding: 16
        },
        optionsList: {
            marginTop: 8
        },
        option: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginBottom: 8,
            backgroundColor: theme.colors.background,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        selectedOption: {
            backgroundColor: theme.colors.primary + '20'
        },
        disabledOption: {
            opacity: 0.5
        },
        optionText: {
            color: theme.colors.text
        },
        disabledOptionText: {
            color: theme.colors.muted
        },
        errorText: {
            color: theme.colors.error,
            marginTop: 4,
            fontSize: 12
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text
        },
        closeButton: {
            padding: 8
        }
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => !disabled && setIsOpen(true)}
                activeOpacity={0.7}
                disabled={disabled}
            >
                <WRText style={styles.selectedText}>
                    {selectedOption?.label || placeholder}
                </WRText>
                <UIIcon
                    name="chevron-down"
                    size={20}
                    color={theme.colors.text}
                />
            </TouchableOpacity>

            {error && errorMessage && (
                <WRText style={styles.errorText}>{errorMessage}</WRText>
            )}

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <WRText style={styles.modalTitle}>Selecione uma opção</WRText>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsOpen(false)}
                            >
                                <UIIcon
                                    name="close"
                                    size={24}
                                    color={theme.colors.text}
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.optionsList}>
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.option,
                                        selectedOption?.value === option.value && styles.selectedOption,
                                        option.disabled && styles.disabledOption
                                    ]}
                                    onPress={() => handleSelect(option)}
                                    disabled={option.disabled}
                                    activeOpacity={0.7}
                                >
                                    <WRText
                                        style={[
                                            styles.optionText,
                                            option.disabled && styles.disabledOptionText
                                        ]}
                                    >
                                        {option.label}
                                    </WRText>
                                    {selectedOption?.value === option.value && (
                                        <UIIcon
                                            name="checkmark"
                                            size={20}
                                            color={theme.colors.primary}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}