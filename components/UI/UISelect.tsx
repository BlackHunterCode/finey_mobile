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
    // Propriedades para seleção múltipla
    multiple?: boolean;
    selectedValues?: any[];
    onMultipleChange?: (values: any[]) => void;
    selectAllByDefault?: boolean;
    minSelected?: number;
    maxSelected?: number;
    showSelectAll?: boolean;
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
    children,
    multiple = false,
    selectedValues = [],
    onMultipleChange,
    selectAllByDefault = false,
    minSelected = 0,
    maxSelected,
    showSelectAll = true
}: UISelectProps) {
    const { theme } = useAppTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
    const [multipleSelectedValues, setMultipleSelectedValues] = useState<any[]>([]);
    const modalHeight = Dimensions.get('window').height * 0.4;

    useEffect(() => {
        if (multiple) {
            if (selectAllByDefault && selectedValues.length === 0) {
                const allValues = options.filter(opt => !opt.disabled).map(opt => opt.value);
                setMultipleSelectedValues(allValues);
                onMultipleChange?.(allValues);
            } else {
                setMultipleSelectedValues(selectedValues);
            }
        } else if (value) {
            const option = options.find(opt => opt.value === value);
            if (option) setSelectedOption(option);
        }
    }, [value, options, selectedValues, multiple, selectAllByDefault]);

    const handleSelect = useCallback((option: SelectOption) => {
        if (option.disabled) return;
        
        if (multiple) {
            const isSelected = multipleSelectedValues.includes(option.value);
            let newValues: any[];
            
            if (isSelected) {
                // Verificar se pode desselecionar (não ultrapassar limite mínimo)
                if (multipleSelectedValues.length <= minSelected) {
                    return; // Não permite desselecionar
                }
                newValues = multipleSelectedValues.filter(val => val !== option.value);
            } else {
                // Verificar se pode selecionar (não ultrapassar limite máximo)
                if (maxSelected && multipleSelectedValues.length >= maxSelected) {
                    return; // Não permite selecionar mais
                }
                newValues = [...multipleSelectedValues, option.value];
            }
            
            setMultipleSelectedValues(newValues);
            onMultipleChange?.(newValues);
        } else {
            setSelectedOption(option);
            setIsOpen(false);
            onChange?.(option.value);
        }
    }, [onChange, onMultipleChange, multiple, multipleSelectedValues, minSelected, maxSelected]);

    const handleSelectAll = useCallback(() => {
        if (!multiple) return;
        const allValues = options.filter(opt => !opt.disabled).map(opt => opt.value);
        setMultipleSelectedValues(allValues);
        onMultipleChange?.(allValues);
    }, [options, multiple, onMultipleChange]);

    const handleDeselectAll = useCallback(() => {
        if (!multiple) return;
        if (minSelected > 0) return; // Não permite desselecionar todos se há mínimo
        setMultipleSelectedValues([]);
        onMultipleChange?.([]);
    }, [multiple, minSelected, onMultipleChange]);

    const getDisplayText = () => {
        if (multiple) {
            if (multipleSelectedValues.length === 0) {
                return placeholder;
            }
            if (multipleSelectedValues.length === options.length) {
                return "Todos selecionados";
            }
            return `${multipleSelectedValues.length} selecionado(s)`;
        }
        return selectedOption?.label || placeholder;
    };

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
        },
        selectAllContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
        },
        selectAllButton: {
            flex: 1,
            padding: 8,
            marginHorizontal: 4,
            backgroundColor: theme.colors.background,
            borderRadius: 6,
            alignItems: 'center'
        },
        selectAllText: {
            fontSize: 14,
            color: theme.colors.primary,
            fontWeight: '500'
        },
        checkbox: {
            width: 20,
            height: 20,
            borderWidth: 2,
            borderColor: theme.colors.border,
            borderRadius: 4,
            marginRight: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.background
        },
        optionTextMultiple: {
            flex: 1
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
                    {getDisplayText()}
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
                            <WRText style={styles.modalTitle}>
                                {multiple ? "Selecione as opções" : "Selecione uma opção"}
                            </WRText>
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

                        {multiple && showSelectAll && (
                            <View style={styles.selectAllContainer}>
                                <TouchableOpacity
                                    style={styles.selectAllButton}
                                    onPress={handleSelectAll}
                                    disabled={maxSelected != undefined && (multipleSelectedValues.length >= maxSelected)}
                                >
                                    <WRText style={styles.selectAllText}>Selecionar Todos</WRText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.selectAllButton}
                                    onPress={handleDeselectAll}
                                    disabled={minSelected > 0}
                                >
                                    <WRText style={styles.selectAllText}>Desselecionar Todos</WRText>
                                </TouchableOpacity>
                            </View>
                        )}

                        <ScrollView style={styles.optionsList}>
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.option,
                                        (multiple ? multipleSelectedValues.includes(option.value) : selectedOption?.value === option.value) && styles.selectedOption,
                                        option.disabled && styles.disabledOption
                                    ]}
                                    onPress={() => handleSelect(option)}
                                    disabled={option.disabled}
                                    activeOpacity={0.7}
                                >
                                    {multiple && (
                                        <View style={styles.checkbox}>
                                            {multipleSelectedValues.includes(option.value) && (
                                                <UIIcon
                                                    name="checkmark"
                                                    size={16}
                                                    color={theme.colors.primary}
                                                />
                                            )}
                                        </View>
                                    )}
                                    <WRText
                                        style={[
                                            styles.optionText,
                                            option.disabled && styles.disabledOptionText,
                                            multiple && styles.optionTextMultiple
                                        ]}
                                    >
                                        {option.label}
                                    </WRText>
                                    {!multiple && selectedOption?.value === option.value && (
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