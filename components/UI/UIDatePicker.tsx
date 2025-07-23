import { useAppTheme } from "@/context/theme-context";
import React, { useCallback, useEffect, useState } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import WRText from "@/components/wrappers/WRText";
import UIIcon from "./UIIcon";
import UIModal from "./UIModal";
import { format, addYears, subYears } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UIDatePickerProps {
    /**
     * Data inicial selecionada
     */
    value?: Date;
    
    /**
     * Função chamada quando a data é alterada
     */
    onChange?: (date: Date) => void;
    
    /**
     * Placeholder exibido quando nenhuma data está selecionada
     */
    placeholder?: string;
    
    /**
     * Estilo adicional para o componente
     */
    style?: StyleProp<ViewStyle>;
    
    /**
     * Se true, o componente fica desabilitado
     */
    disabled?: boolean;
    
    /**
     * Modo de seleção (month-year para mês/ano, date para data completa)
     */
    mode?: "month-year" | "date";
    
    /**
     * Formato de exibição da data selecionada
     */
    displayFormat?: string;
}

/**
 * Componente para seleção de data com suporte para diferentes modos (mês/ano ou data completa)
 * @param props Propriedades do componente
 * @returns React.JSX.Element
 */
export default function UIDatePicker({
    value = new Date(),
    onChange,
    placeholder = "Selecione uma data",
    style,
    disabled = false,
    mode = "month-year",
    displayFormat = mode === "month-year" ? "MMMM yyyy" : "dd/MM/yyyy"
}: UIDatePickerProps) {
    const { theme } = useAppTheme();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(value);
    const [viewDate, setViewDate] = useState<Date>(value);
    const [selectedYear, setSelectedYear] = useState<number>(value.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(value.getMonth());
    
    // Atualiza o estado interno quando a prop value muda
    useEffect(() => {
        if (value) {
            setSelectedDate(value);
            setViewDate(value);
            setSelectedYear(value.getFullYear());
            setSelectedMonth(value.getMonth());
        }
    }, [value]);
    
    // Formata a data para exibição
    const formattedDate = selectedDate 
        ? format(selectedDate, displayFormat, { locale: ptBR })
        : placeholder;
    
    // Abre o modal de seleção
    const handleOpenModal = useCallback(() => {
        if (!disabled) {
            setIsModalVisible(true);
        }
    }, [disabled]);
    
    // Fecha o modal de seleção
    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);
    
    // Confirma a seleção da data
    const handleConfirm = useCallback(() => {
        const newDate = new Date(selectedYear, selectedMonth, 1);
        setSelectedDate(newDate);
        onChange?.(newDate);
        handleCloseModal();
    }, [selectedYear, selectedMonth, onChange, handleCloseModal]);
    
    // Navega para o ano anterior
    const handlePrevYear = useCallback(() => {
        setSelectedYear(prev => prev - 1);
    }, []);
    
    // Navega para o próximo ano
    const handleNextYear = useCallback(() => {
        setSelectedYear(prev => prev + 1);
    }, []);
    
    // Renderiza os meses para seleção
    const renderMonths = useCallback(() => {
        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        
        return (
            <View style={styles.monthsGrid}>
                {months.map((month, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.monthItem,
                            selectedMonth === index && styles.selectedMonthItem
                        ]}
                        onPress={() => setSelectedMonth(index)}
                        activeOpacity={0.7}
                    >
                        <WRText
                            style={[
                                styles.monthText,
                                selectedMonth === index && styles.selectedMonthText
                            ]}
                        >
                            {month}
                        </WRText>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }, [selectedMonth]);
    
    const styles = StyleSheet.create({
        container: {
            width: "100%",
        },
        pickerButton: {
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            padding: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: disabled ? 0.5 : 1,
            ...(style as any)
        },
        dateText: {
            color: selectedDate ? theme.colors.text : theme.colors.muted,
            flex: 1,
            marginRight: 8,
            textTransform: "capitalize"
        },
        modalContent: {
            padding: 16
        },
        yearSelector: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16
        },
        yearText: {
            fontSize: 18,
            fontWeight: "600",
            color: theme.colors.text
        },
        yearButton: {
            padding: 8
        },
        monthsGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 16
        },
        monthItem: {
            width: "30%",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            alignItems: "center",
            backgroundColor: theme.colors.background
        },
        selectedMonthItem: {
            backgroundColor: theme.colors.primary
        },
        monthText: {
            color: theme.colors.text,
            fontSize: 14
        },
        selectedMonthText: {
            color: "#FFFFFF",
            fontWeight: "600"
        },
        buttonRow: {
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 16
        },
        button: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginLeft: 8
        },
        confirmButton: {
            backgroundColor: theme.colors.primary
        },
        cancelButton: {
            backgroundColor: theme.colors.border
        },
        buttonText: {
            color: theme.colors.text,
            fontWeight: "500"
        },
        confirmButtonText: {
            color: "#FFFFFF"
        }
    });
    
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={handleOpenModal}
                activeOpacity={0.7}
                disabled={disabled}
            >
                <WRText style={styles.dateText}>
                    {formattedDate}
                </WRText>
                <UIIcon
                    name="calendar-outline"
                    size={20}
                    color={theme.colors.text}
                />
            </TouchableOpacity>
            
            <UIModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                title="Selecione o mês e ano"
                size="medium"
            >
                <View style={styles.modalContent}>
                    <View style={styles.yearSelector}>
                        <TouchableOpacity
                            style={styles.yearButton}
                            onPress={handlePrevYear}
                            activeOpacity={0.7}
                        >
                            <UIIcon
                                name="chevron-back"
                                size={24}
                                color={theme.colors.text}
                            />
                        </TouchableOpacity>
                        
                        <WRText style={styles.yearText}>{selectedYear}</WRText>
                        
                        <TouchableOpacity
                            style={styles.yearButton}
                            onPress={handleNextYear}
                            activeOpacity={0.7}
                        >
                            <UIIcon
                                name="chevron-forward"
                                size={24}
                                color={theme.colors.text}
                            />
                        </TouchableOpacity>
                    </View>
                    
                    {renderMonths()}
                    
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleCloseModal}
                            activeOpacity={0.7}
                        >
                            <WRText style={styles.buttonText}>Cancelar</WRText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={handleConfirm}
                            activeOpacity={0.7}
                        >
                            <WRText style={[styles.buttonText, styles.confirmButtonText]}>Confirmar</WRText>
                        </TouchableOpacity>
                    </View>
                </View>
            </UIModal>
        </View>
    );
}