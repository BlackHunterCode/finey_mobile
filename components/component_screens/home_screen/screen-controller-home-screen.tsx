import UIDatePicker from "@/components/UI/UIDatePicker";
import UIIcon from "@/components/UI/UIIcon";
import UIModal from "@/components/UI/UIModal";
import WRText from "@/components/wrappers/WRText";
import { useReferenceDate } from "@/context/reference-date-context";
import { useAppTheme } from "@/context/theme-context";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ScreenControllerHomeScreen() {
    const { referenceDate, setReferenceDate } = useReferenceDate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { theme } = useAppTheme();

    const formatReferenceDate = () => {
        return format(referenceDate, 'MMMM yyyy', { locale: ptBR });
    };

    const styles = StyleSheet.create({
        container: {
            marginBottom: 15
        },
        dateReference: {
            fontWeight: 'bold',
            fontSize: 13,
        },
        dropdownTrigger: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 8,
            borderRadius: 8,
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            borderWidth: 0.5,
        },
        modalContent: {
            padding: 16,
        },
        periodTypeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 8,
        },
        periodTypeButton: {
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: theme.colors.card,
            alignItems: 'center',
        },
        periodTypeButtonActive: {
            backgroundColor: theme.colors.primary,
        },
        periodTypeText: {
            fontSize: 14,
            color: '#000',
        },
        rowContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <WRText style={styles.dateReference}>Data de referência</WRText>
                <WRText style={styles.dateReference}>Bancos conectados</WRText>
            </View>
            <View style={[styles.rowContainer, { marginTop: 8 }]}>
                <TouchableOpacity 
                    style={styles.dropdownTrigger}
                    onPress={() => setIsModalVisible(true)}
                >
                    <WRText style={styles.dateReference}>{formatReferenceDate()}</WRText>
                    <UIIcon name="calendar" size={20} />
                </TouchableOpacity>

                <UIModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    title="Selecionar mês/ano de referência"
                    size="small"
                >
                    <View style={styles.modalContent}>
                        <UIDatePicker
                            value={referenceDate}
                            onChange={(date) => {
                                setReferenceDate(date);
                                setIsModalVisible(false);
                            }}
                            mode="month-year"
                        />
                    </View>
                </UIModal>
            </View>
        </View>
    )
}