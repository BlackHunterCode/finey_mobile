import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import UIIcon from "./UIIcon";
import UIModal from "./UIModal";

interface DateRange {
    startDate: Date;
    endDate: Date;
}

interface UIDatePickerProps {
    /**
     * Data inicial selecionada (para modos month-year e date)
     */
    value?: Date;
    
    /**
     * Período selecionado (para modo date-range)
     */
    dateRange?: DateRange;
    
    /**
     * Função chamada quando a data é alterada (para modos month-year e date)
     */
    onChange?: (date: Date) => void;
    
    /**
     * Função chamada quando o período é alterado (para modo date-range)
     */
    onRangeChange?: (range: DateRange) => void;
    
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
     * Se true, exibe as setas de navegação para facilitar a rolagem
     * @default false
     */
    showNavigationArrows?: boolean;
    
    /**
     * Modo de seleção (month-year para mês/ano, date para data completa, date-range para período)
     */
    mode?: "month-year" | "date" | "date-range";
    
    /**
     * Formato de exibição da data selecionada
     */
    displayFormat?: string;
    
    /**
     * Se true, limita a seleção até a data atual
     */
    limitToPresent?: boolean;
    
    /**
     * Se true, não renderiza o modal interno (usado quando já está dentro de um modal)
     */
    noModal?: boolean;
    
    /**
     * Se true, exige confirmação através do botão "Salvar" antes de aplicar mudanças
     */
    requiresConfirmation?: boolean;
    
    /**
     * Se true, indica que está carregando dados após uma seleção
     */
    isLoading?: boolean;
}

/**
 * Componente para seleção de data com suporte para diferentes modos (mês/ano ou data completa)
 * @param props Propriedades do componente
 * @returns React.JSX.Element
 */
export default function UIDatePicker({
    value,
    dateRange,
    onChange,
    onRangeChange,
    placeholder = "Selecione uma data",
    style,
    disabled = false,
    mode = "month-year",
    displayFormat = mode === "month-year" ? "MMMM yyyy" : mode === "date-range" ? "dd/MM/yyyy" : "dd/MM/yyyy",
    limitToPresent = false,
    noModal = false,
    requiresConfirmation = false,
    showNavigationArrows = false,
    isLoading = false
}: UIDatePickerProps) {
    const { theme } = useAppTheme();
    const [isModalVisible, setIsModalVisible] = useState(false);
    

    const defaultDate = value || new Date();
    const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
    const [viewDate, setViewDate] = useState<Date>(defaultDate);
    const [selectedYear, setSelectedYear] = useState<number>(defaultDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(defaultDate.getMonth());
    
    // Estados para modo date-range
    const [selectedRange, setSelectedRange] = useState<DateRange | null>(dateRange || null);
    const [rangeSelectionStep, setRangeSelectionStep] = useState<'start' | 'end'>('start');
    const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
    
    // Atualiza o estado interno quando a prop value muda
    useEffect(() => {
        if (value) {
            setSelectedDate(value);
            setViewDate(value);
            setSelectedYear(value.getFullYear());
            setSelectedMonth(value.getMonth());
        }
    }, [value?.getTime()]);
    
    // Atualiza o estado interno quando dateRange muda
    useEffect(() => {
        if (dateRange) {
            setSelectedRange(dateRange);
        }
    }, [dateRange?.startDate?.getTime(), dateRange?.endDate?.getTime()]);
    
    // Formata a data para exibição
    const formattedDate = mode === "date-range" 
        ? (selectedRange 
            ? `${format(selectedRange.startDate, "dd/MM", { locale: ptBR })} - ${format(selectedRange.endDate, "dd/MM", { locale: ptBR })}`
            : placeholder)
        : (selectedDate 
            ? format(selectedDate, displayFormat, { locale: ptBR })
            : placeholder);
    
    // Abre o modal de seleção
    const handleOpenModal = useCallback(() => {
        if (!disabled) {
            // Força um pequeno delay para garantir que o estado seja atualizado corretamente
            setTimeout(() => {
                setIsModalVisible(true);
            }, 50);
        }
    }, [disabled]);
    
    // Fecha o modal de seleção
    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);
    
    // Confirma a seleção da data
    const handleConfirm = useCallback(() => {
        if (mode === "date-range" && selectedRange) {
            onRangeChange?.(selectedRange);
        } else {
            const newDate = new Date(selectedYear, selectedMonth, 1);
            setSelectedDate(newDate);
            onChange?.(newDate);
        }
        handleCloseModal();
    }, [mode, selectedRange, selectedYear, selectedMonth, onChange, onRangeChange, handleCloseModal]);
    
    // Função para lidar com seleção de data no modo range com rolagem automática
    const handleDateSelect = useCallback((date: Date) => {
        if (mode !== "date-range") return;
        
        if (rangeSelectionStep === 'start') {
            setTempStartDate(date);
            setRangeSelectionStep('end');
            setSelectedRange(null);
            
            // Rola para mostrar a mensagem de seleção de data final
            setTimeout(() => {
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ y: 0, animated: true });
                }
            }, 100);
        } else {
            if (tempStartDate) {
                const startDate = tempStartDate <= date ? tempStartDate : date;
                const endDate = tempStartDate <= date ? date : tempStartDate;
                
                // Verifica limitToPresent para data final
                if (limitToPresent && endDate > new Date()) {
                    return;
                }
                
                const newRange = { startDate, endDate };
                setSelectedRange(newRange);
                setRangeSelectionStep('start');
                setTempStartDate(null);
                
                // Rola para mostrar os botões de ação
                setTimeout(() => {
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                }, 100);
                
                if (noModal && !requiresConfirmation) {
                    onRangeChange?.(newRange);
                }
            }
        }
    }, [mode, rangeSelectionStep, tempStartDate, limitToPresent, noModal, requiresConfirmation, onRangeChange]);
    
    // Reseta a seleção de período
    const handleResetRange = useCallback(() => {
        setSelectedRange(null);
        setTempStartDate(null);
        setRangeSelectionStep('start');
    }, []);
    
    // Verifica se uma data é válida (não futura se limitToPresent estiver ativo)
    const isDateValid = useCallback((year: number, month: number) => {
        if (!limitToPresent) return true;
        const currentDate = new Date();
        const selectedDate = new Date(year, month, 1);
        return selectedDate <= currentDate;
    }, [limitToPresent]);
    
    // Função para rolar suavemente para o topo com efeito de inércia suave
    const scrollToTop = useCallback(() => {
        if (scrollViewRef.current) {
            // Obtém a posição atual de rolagem
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
            
            // Indica que está rolando para atualizar o indicador visual
            setIsScrolling(true);
            setScrollDirection('up');
            
            // Após a animação, reseta o estado de rolagem
            setTimeout(() => {
                setIsScrolling(false);
                setScrollDirection(null);
            }, 350);
        }
    }, []);
    
    // Função para rolar suavemente para o calendário
    const scrollToCalendar = useCallback(() => {
        if (scrollViewRef.current && mode === "date-range") {
            // Rola para a posição aproximada do calendário
            scrollViewRef.current.scrollTo({ y: 150, animated: true });
            
            // Indica que está rolando para atualizar o indicador visual
            setIsScrolling(true);
            setScrollDirection('down');
            
            // Após a animação, reseta o estado de rolagem
            setTimeout(() => {
                setIsScrolling(false);
                setScrollDirection(null);
            }, 350);
        }
    }, [mode]);
    
    // Navega para o ano anterior
    const handlePrevYear = useCallback(() => {
        setSelectedYear(prev => prev - 1);
        // Rola para o topo para mostrar a mudança
        scrollToTop();
    }, [scrollToTop]);
    
    // Navega para o próximo ano
    const handleNextYear = useCallback(() => {
        if (limitToPresent) {
            const currentYear = new Date().getFullYear();
            if (selectedYear >= currentYear) return;
        }
        setSelectedYear(prev => prev + 1);
        // Rola para o topo para mostrar a mudança
        scrollToTop();
    }, [limitToPresent, selectedYear, scrollToTop]);
    
    // Navega para o mês anterior
    const handlePrevMonth = useCallback(() => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            handlePrevYear();
        } else {
            setSelectedMonth(prev => prev - 1);
        }
        // Rola para mostrar o calendário após a mudança
        setTimeout(() => scrollToCalendar(), 100);
    }, [selectedMonth, handlePrevYear, scrollToCalendar]);
    
    // Navega para o próximo mês com feedback tátil
    const handleNextMonth = useCallback(() => {
        if (limitToPresent) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            if (selectedYear === currentYear && selectedMonth >= currentMonth) return;
        }
        
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            handleNextYear();
        } else {
            setSelectedMonth(prev => prev + 1);
        }
        // Rola para mostrar o calendário após a mudança
        setTimeout(() => scrollToCalendar(), 100);
    }, [selectedMonth, selectedYear, limitToPresent, handleNextYear, scrollToCalendar]);
    
    // Renderiza os meses para seleção
    const renderMonths = useCallback(() => {
        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        
        return (
            <View style={styles.monthsGrid}>
                {months.map((month, index) => {
                    const isValid = isDateValid(selectedYear, index);
                    const isDisabled = !isValid;
                    
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.monthItem,
                                selectedMonth === index && styles.selectedMonthItem,
                                isDisabled && styles.disabledMonthItem
                            ]}
                            onPress={() => {
                                if (!isDisabled) {
                                    setSelectedMonth(index);
                                    // Se noModal=true e não requer confirmação, confirma imediatamente
                                    if (noModal && !requiresConfirmation) {
                                        const newDate = new Date(selectedYear, index, 1);
                                        onChange?.(newDate);
                                    }
                                }
                            }}
                            activeOpacity={isDisabled ? 1 : 0.7}
                            disabled={isDisabled}
                        >
                            <WRText
                                style={[
                                    styles.monthText,
                                    selectedMonth === index && styles.selectedMonthText,
                                    isDisabled && styles.disabledMonthText
                                ]}
                            >
                                {month}
                            </WRText>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }, [selectedMonth, selectedYear, isDateValid, noModal, requiresConfirmation, onChange]);
    
    // Renderiza o calendário para seleção de datas (modo date-range)
    const renderDateCalendar = useCallback(() => {
        const year = selectedYear;
        const month = selectedMonth;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        // Adiciona dias vazios no início
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
        }
        
        // Adiciona os dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isDisabled = limitToPresent && date > new Date();
            const isInRange = selectedRange && date >= selectedRange.startDate && date <= selectedRange.endDate;
            const isStartDate = selectedRange && date.getTime() === selectedRange.startDate.getTime();
            const isEndDate = selectedRange && date.getTime() === selectedRange.endDate.getTime();
            const isTempStart = tempStartDate && date.getTime() === tempStartDate.getTime();
            
            days.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.dayItem,
                        isInRange && styles.dayInRange,
                        (isStartDate || isEndDate) && styles.daySelected,
                        isTempStart && styles.dayTempSelected,
                        isDisabled && styles.dayDisabled
                    ]}
                    onPress={() => {
                        if (isDisabled) {
                            return;
                        }
                        handleDateSelect(date);
                    }}
                    disabled={isDisabled}
                    activeOpacity={0.5} // Mais responsivo
                    delayPressIn={0} // Sem atraso para resposta imediata
                    pressRetentionOffset={{top: 12, bottom: 12, left: 12, right: 12}} // Área maior para manter o toque
                    hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} // Área de toque maior
                >
                    <WRText
                        style={[
                            styles.dayText,
                            (isStartDate || isEndDate) && styles.daySelectedText,
                            isTempStart && styles.dayTempSelectedText,
                            isDisabled && styles.dayDisabledText
                        ]}
                    >
                        {day}
                    </WRText>
                </TouchableOpacity>
            );
        }
        
        return (
            <View>
                <View style={styles.weekDaysHeader}>
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                        <View key={index} style={styles.weekDayItem}>
                            <WRText style={styles.weekDayText}>{day}</WRText>
                        </View>
                    ))}
                </View>
                <View style={styles.daysGrid}>
                    {days} 
                </View>
             </View>
         );
    }, [selectedYear, selectedMonth, limitToPresent, selectedRange, tempStartDate, handleDateSelect]);
    
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
        pickerButtonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
        },
        pickerButtonDisabled: {
            opacity: 0.7,
        },
        dateRangeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        dateRangeSeparator: {
            marginHorizontal: 4,
        },
        dateText: {
            color: selectedDate ? theme.colors.text : theme.colors.muted,
            flex: 1,
            marginRight: 8,
            textTransform: "capitalize"
        },
        modalContent: {
            padding: 16,
            minHeight: 350, // Altura mínima maior para garantir espaço suficiente
            maxHeight: '90%', // Aumenta a altura máxima para mostrar mais conteúdo
            position: 'relative', // Para posicionar as setas flutuantes
        },
        scrollViewContent: {
            flexGrow: 1,
            paddingBottom: 50, // Mais espaço na parte inferior para garantir que haja conteúdo rolável
            paddingTop: 20, // Mais espaço no topo para garantir que haja conteúdo rolável
            paddingHorizontal: 8, // Mais espaço horizontal para melhor visualização
            minHeight: '120%', // Garante altura mínima maior que a tela para permitir rolagem fluida
        },
        yearSelector: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            paddingVertical: 8,
            paddingHorizontal: 4
        },
        yearText: {
            fontSize: 18,
            fontWeight: "600",
            color: theme.colors.text
        },
        yearButton: {
            padding: 8,
            borderRadius: 8
        },
        monthSelector: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            paddingVertical: 8,
            paddingHorizontal: 4
        },
        monthTextDateRange: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.text,
            textTransform: "capitalize"
        },
        monthsGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 16
        },
        monthItem: {
            width: "32%",
            padding: 14,
            marginBottom: 12,
            borderRadius: 12,
            alignItems: "center",
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2
        },
        selectedMonthItem: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
            transform: [{ scale: 1.02 }]
        },
        disabledMonthItem: {
            backgroundColor: theme.colors.muted + "30",
            borderColor: theme.colors.muted + "50",
            opacity: 0.6
        },
        monthText: {
            color: theme.colors.text,
            fontSize: 10
        },
        selectedMonthText: {
            color: "#FFFFFF",
            fontWeight: "700",
            fontSize: 10
        },
        disabledMonthText: {
            color: theme.colors.muted,
            opacity: 0.7
        },
        buttonRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 24,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border + "50",
            gap: 8
        },
        button: {
            flex: 1,
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 48,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2
        },
        confirmButton: {
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
            shadowOpacity: 0.3
        },
        cancelButton: {
            backgroundColor: theme.colors.card,
            borderWidth: 1.5,
            borderColor: theme.colors.border
        },
        resetButton: {
            backgroundColor: theme.colors.muted + "20",
            borderWidth: 1.5,
            borderColor: theme.colors.muted + "60"
        },
        buttonText: {
            color: theme.colors.text,
            fontWeight: "600",
            fontSize: 10
        },
        confirmButtonText: {
            color: "#FFFFFF",
            fontWeight: "700",
            fontSize: 10
        },
        // Estilos para calendário de datas (modo date-range)
        weekDaysHeader: {
            flexDirection: "row",
            marginBottom: 8
        },
        weekDayItem: {
            flex: 1,
            alignItems: "center",
            paddingVertical: 8
        },
        weekDayText: {
            fontSize: 12,
            fontWeight: "600",
            color: theme.colors.muted
        },
        daysGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingBottom: 10,
            marginBottom: 10,
            paddingHorizontal: 4, // Adiciona espaço horizontal para melhor visualização
        },
        dayItem: {
            width: "13.5%", // Ligeiramente menor para dar mais espaço entre os dias
            aspectRatio: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10, // Bordas mais arredondadas
            marginVertical: 4, // Mais espaço vertical entre os dias
            marginHorizontal: 1, // Espaço horizontal entre os dias
            padding: 2, // Mais padding para área de toque maior
        },
        dayInRange: {
            backgroundColor: theme.colors.primary + "15"
        },
        daySelected: {
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3
        },
        dayTempSelected: {
            backgroundColor: theme.colors.primary + "50",
            borderWidth: 2,
            borderColor: theme.colors.primary
        },
        dayDisabled: {
            opacity: 0.3
        },
        emptyDay: {
            width: "14.28%",
            aspectRatio: 1
        },
        dayText: {
            fontSize: 14,
            color: theme.colors.text
        },
        daySelectedText: {
            color: "#FFFFFF",
            fontWeight: "600"
        },
        dayTempSelectedText: {
            color: "#FFFFFF",
            fontWeight: "500"
        },
        dayDisabledText: {
            color: theme.colors.muted
        },
        rangeInfo: {
            padding: 16,
            backgroundColor: theme.colors.primary + "10",
            borderRadius: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme.colors.primary + "30"
        },
        rangeInfoText: {
            fontSize: 15,
            color: theme.colors.text,
            textAlign: "center",
            fontWeight: "500"
        },
        scrollIndicator: {
            alignItems: 'center',
            paddingVertical: 2, // Reduzido para ser menos intrusivo
            marginBottom: 1, // Reduzido para ocupar menos espaço
            opacity: 0.3, // Ainda mais discreto
        },
        scrollIndicatorBar: {
            width: 25, // Reduzido para ser menos visível
            height: 2, // Mais fino para ser menos intrusivo
            backgroundColor: theme.colors.muted + '20', // Mais transparente
            borderRadius: 4,
        },
        scrollIndicatorActive: {
            backgroundColor: theme.colors.primary + '30', // Mais transparente quando ativo
            width: 30, // Menor quando ativo para ser menos intrusivo
        },
        // Estilos para as setas flutuantes
        floatingArrow: {
            position: 'absolute',
            alignSelf: 'center',
            zIndex: 1000,
            backgroundColor: theme.colors.background + 'F0', // Fundo semi-transparente
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
            borderWidth: 1,
            borderColor: theme.colors.border + '40',
        },
        topArrow: {
            top: 10,
        },
        bottomArrow: {
            bottom: 10,
        },
    });
    
    // Referência para o ScrollView
    const scrollViewRef = useRef<ScrollView>(null);
    
    // Estado e handlers para garantir que o scroll funcione corretamente
    const [isScrolling, setIsScrolling] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
    
    // Detecta movimento de scroll e direção com otimização para performance
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        
        // Sempre atualiza o estado de rolagem para garantir que o scroll funcione
        setIsScrolling(true);
        
        // Determina a direção do scroll apenas se houver uma mudança significativa
        // Usando um threshold maior para reduzir atualizações desnecessárias
        const diff = offsetY - lastScrollY;
        if (Math.abs(diff) > 10) {
            const newDirection = diff > 0 ? 'down' : 'up';
            if (scrollDirection !== newDirection) {
                setScrollDirection(newDirection);
            }
            
            // Atualiza o último valor de scroll apenas quando há mudança significativa
            setLastScrollY(offsetY);
        }
        
        // Controla a visibilidade das setas de navegação com base na posição de rolagem, se habilitadas
        if (showNavigationArrows) {
            // Mostra a seta superior quando não estiver no topo
            setShowTopArrow(offsetY > 20);
            
            // Mostra a seta inferior quando não estiver no final
            // Adiciona uma margem para começar a mostrar a seta antes de chegar ao final
            const isNearBottom = offsetY + scrollViewHeight > contentHeight - 50;
            setShowBottomArrow(!isNearBottom);
        }
        
        // Limpa o timeout anterior se existir para evitar múltiplos resets
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        
        // Configura um novo timeout para resetar o estado de rolagem
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
            setScrollDirection(null);
        }, 800);
    };
    
    // Referência para timeout de scroll
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // Quando o scroll termina - mantém o scroll ativo por mais tempo
    const handleScrollEnd = () => {
        // Limpa o timeout anterior se existir
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        
        // Delay maior para manter o scroll ativo por mais tempo
        // Isso ajuda a evitar que o scroll fique inativo muito rapidamente
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
            setScrollDirection(null);
        }, 300); // Tempo reduzido para resposta mais rápida
    };
    
    // Simplificando a lógica de detecção de rolagem para melhorar a performance
    // e evitar interferências com o sistema de gestos nativo
    
    // Estado para controlar a visibilidade das setas de navegação
    const [showTopArrow, setShowTopArrow] = useState(false);
    const [showBottomArrow, setShowBottomArrow] = useState(true);
    
    // Referência para animação de flutuação
    const [arrowOffset, setArrowOffset] = useState(0);
    const arrowAnimationRef = useRef<number | null>(null);
    
    // Efeito para animar a flutuação das setas
    useEffect(() => {
        // Inicia a animação de flutuação
        startArrowAnimation();
        
        // Limpa a animação quando o componente é desmontado
        return () => {
            if (arrowAnimationRef.current) {
                clearTimeout(arrowAnimationRef.current);
            }
        };
    }, []);
    
    // Função para animar a flutuação das setas
    const startArrowAnimation = () => {
        let direction = 1;
        let currentOffset = 0;
        
        const animate = () => {
            currentOffset += 0.2 * direction;
            
            // Inverte a direção quando atinge os limites
            if (currentOffset >= 3 || currentOffset <= 0) {
                direction *= -1;
            }
            
            setArrowOffset(currentOffset);
            
            // Continua a animação
            arrowAnimationRef.current = setTimeout(animate, 50);
        };
        
        animate();
    };
    
    // Renderiza a seta superior flutuante
    const renderTopArrow = () => {
        if (!showTopArrow) return null;
        
        return (
            <TouchableOpacity 
                style={[styles.floatingArrow, styles.topArrow, { transform: [{ translateY: -arrowOffset }] }]}
                activeOpacity={0.7}
                onPress={() => {
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollTo({ y: 0, animated: true });
                    }
                }}
            >
                <UIIcon name="chevron-up" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
        );
    };
    
    // Renderiza a seta inferior flutuante
    const renderBottomArrow = () => {
        if (!showBottomArrow) return null;
        
        return (
            <TouchableOpacity 
                style={[styles.floatingArrow, styles.bottomArrow, { transform: [{ translateY: arrowOffset }] }]}
                activeOpacity={0.7}
                onPress={() => {
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                }}
            >
                <UIIcon name="chevron-down" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
        );
    };
    
    // Indicador visual de scroll ainda mais simplificado e discreto
    const renderScrollIndicator = () => {
        return (
            <TouchableOpacity 
                style={styles.scrollIndicator}
                activeOpacity={0.5} // Mais responsivo ao toque
                onPress={() => {
                    // Ao tocar no indicador, rola para o topo sem feedback tátil
                    // para evitar interferências com o sistema de gestos
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollTo({ y: 0, animated: true });
                    }
                }}
            >
                <View style={[styles.scrollIndicatorBar, isScrolling && styles.scrollIndicatorActive]} />
            </TouchableOpacity>
        );
    };
    
    const renderDatePicker = () => {
        return (
        <View style={styles.modalContent}>
            {renderScrollIndicator()}
            {/* Renderiza as setas flutuantes para navegação se habilitadas */}
            {showNavigationArrows && renderTopArrow()}
            {showNavigationArrows && renderBottomArrow()}
            <View style={{flex: 1, width: '100%', height: '100%'}} pointerEvents="box-none">
                <ScrollView 
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollViewContent} 
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    scrollEventThrottle={16} // Valor otimizado para melhor performance e resposta
                    bounces={true}
                    alwaysBounceVertical={true} // Permite bounce vertical para feedback visual
                    directionalLockEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    onScroll={handleScroll}
                    onMomentumScrollEnd={handleScrollEnd} // Detecta quando o scroll termina
                    onScrollBeginDrag={() => {
                        setIsScrolling(true);
                    }} 
                    onMomentumScrollBegin={() => setIsScrolling(true)} // Detecta início do momentum
                    scrollEnabled={true}
                    decelerationRate="normal" // Usa o valor padrão para comportamento mais previsível
                    overScrollMode="always" // Melhor feedback visual no Android
                    snapToAlignment="start" // Ajuda no posicionamento
                    style={{flex: 1, width: '100%', height: '100%'}} // Garante que o ScrollView ocupe todo o espaço disponível
                    contentInset={{top: 5, left: 0, bottom: 30, right: 0}} // Mais espaço para rolagem
                    scrollIndicatorInsets={{top: 5, left: 0, bottom: 30, right: 0}} // Ajusta o indicador de rolagem
                    automaticallyAdjustContentInsets={false} // Evita ajustes automáticos que podem interferir na rolagem
                    pointerEvents="auto" // Garante que o ScrollView receba todos os eventos de toque
                    >
                {mode === "date-range" && (
                    <View style={styles.rangeInfo}>
                        <WRText style={styles.rangeInfoText}>
                            {rangeSelectionStep === 'start' 
                                ? "Selecione a data inicial" 
                                : "Selecione a data final"}
                        </WRText>
                        {selectedRange && (
                            <WRText style={[styles.rangeInfoText, { marginTop: 4, fontWeight: '600' }]}>
                                {format(selectedRange.startDate, displayFormat, { locale: ptBR })} - {format(selectedRange.endDate, displayFormat, { locale: ptBR })}
                            </WRText>
                        )}
                    </View>
                )}
                
                <View style={styles.yearSelector}>
                    <TouchableOpacity
                        style={styles.yearButton}
                        onPress={handlePrevYear}
                        activeOpacity={0.6}
                        delayPressIn={0}
                        pressRetentionOffset={{top: 20, left: 20, bottom: 20, right: 20}}
                        hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
                    >
                        <UIIcon
                            name="chevron-back"
                            size={24}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        activeOpacity={0.7}
                        delayPressIn={0}
                        onPress={() => {
                            // Ao tocar no ano atual, rola para o topo
                                if (scrollViewRef.current) {
                                    scrollViewRef.current.scrollTo({ y: 0, animated: true });
                                }
                        }}
                    >
                        <WRText style={styles.yearText}>{selectedYear}</WRText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.yearButton}
                        onPress={handleNextYear}
                        activeOpacity={0.6}
                        delayPressIn={0}
                        pressRetentionOffset={{top: 20, left: 20, bottom: 20, right: 20}}
                        hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
                        disabled={limitToPresent && selectedYear >= new Date().getFullYear()}
                    >
                        <UIIcon
                            name="chevron-forward"
                            size={24}
                            color={limitToPresent && selectedYear >= new Date().getFullYear() ? theme.colors.muted : theme.colors.text}
                        />
                    </TouchableOpacity>
                </View>
                
                {mode === "date-range" && (
                    <View style={styles.monthSelector}>
                        <TouchableOpacity
                            style={styles.yearButton}
                            onPress={handlePrevMonth}
                            activeOpacity={0.6}
                            delayPressIn={0}
                            pressRetentionOffset={{top: 20, left: 20, bottom: 20, right: 20}}
                            hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
                        >
                            <UIIcon
                                name="chevron-back"
                                size={20}
                                color={theme.colors.text}
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            activeOpacity={0.7}
                            delayPressIn={0}
                            onPress={() => {
                                // Ao tocar no mês atual, rola para o calendário
                                if (scrollViewRef.current) {
                                    // Calcula a posição aproximada do calendário
                                    const calendarPosition = 200; // Posição estimada do calendário
                                    scrollViewRef.current.scrollTo({ y: calendarPosition, animated: true });
                                }
                            }}
                        >
                            <WRText style={styles.monthTextDateRange}>
                                {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][selectedMonth]}
                            </WRText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.yearButton}
                            onPress={handleNextMonth}
                            activeOpacity={0.6}
                            delayPressIn={0}
                            pressRetentionOffset={{top: 20, left: 20, bottom: 20, right: 20}}
                            hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
                            disabled={limitToPresent && selectedYear === new Date().getFullYear() && selectedMonth >= new Date().getMonth()}
                        >
                            <UIIcon
                                name="chevron-forward"
                                size={20}
                                color={limitToPresent && selectedYear === new Date().getFullYear() && selectedMonth >= new Date().getMonth() ? theme.colors.muted : theme.colors.text}
                            />
                        </TouchableOpacity>
                    </View>
                )}
                
                {mode === "date-range" ? renderDateCalendar() : renderMonths()}

                {(!noModal || requiresConfirmation) && (
                    <View style={styles.buttonRow}>
                        {mode === "date-range" && (
                            <TouchableOpacity
                                style={[styles.button, styles.resetButton]}
                                onPress={() => {
                                    handleResetRange();
                                }}
                                activeOpacity={0.6}
                                delayPressIn={0}
                                pressRetentionOffset={{top: 10, left: 10, bottom: 10, right: 10}}
                                hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                            >
                                <WRText style={styles.buttonText}>Limpar</WRText>
                            </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => {
                                handleCloseModal();
                            }}
                            activeOpacity={0.6}
                            delayPressIn={0}
                            pressRetentionOffset={{top: 10, left: 10, bottom: 10, right: 10}}
                            hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                        >
                            <WRText style={styles.buttonText}>Cancelar</WRText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={() => {
                                handleConfirm();
                            }}
                            activeOpacity={0.6}
                            delayPressIn={0}
                            pressRetentionOffset={{top: 10, left: 10, bottom: 10, right: 10}}
                            hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                            disabled={mode === "date-range" && !selectedRange}
                        >
                            <WRText style={[styles.buttonText, styles.confirmButtonText]}>
                                Salvar
                            </WRText>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
                </View>
        </View>
        );
    };

    if (noModal) {
        return renderDatePicker();
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.pickerButton, isLoading && styles.pickerButtonDisabled]}
                onPress={() => {
                    handleOpenModal();
                }}
                activeOpacity={0.6}
                delayPressIn={0}
                pressRetentionOffset={{top: 10, left: 10, bottom: 10, right: 10}}
                hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                disabled={disabled || isLoading}
            >
                <View style={styles.pickerButtonContent}>
                    {mode === "date-range" && selectedRange ? (
                        <View style={styles.dateRangeContainer}>
                            <WRText style={styles.dateText}>
                                {format(selectedRange.startDate, "dd/MM", { locale: ptBR })}
                            </WRText>
                            <WRText style={styles.dateRangeSeparator}>-</WRText>
                            <WRText style={styles.dateText}>
                                {format(selectedRange.endDate, "dd/MM", { locale: ptBR })}
                            </WRText>
                        </View>
                    ) : (
                        <WRText style={styles.dateText}>
                            {formattedDate}
                        </WRText>
                    )}
                    {isLoading ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                        <UIIcon
                            name="calendar-outline"
                            size={20}
                            color={theme.colors.text}
                        />
                    )}
                </View>
            </TouchableOpacity>
            
            <UIModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                title={mode === "date-range" ? "Selecionar período" : "Selecione o mês e ano"}
                size="large"
            >
                {renderDatePicker()}
            </UIModal>
        </View>
    );
}