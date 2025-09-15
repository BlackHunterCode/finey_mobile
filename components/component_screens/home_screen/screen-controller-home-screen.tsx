import UIDatePicker from "@/components/UI/UIDatePicker";
import UIIcon from "@/components/UI/UIIcon";
import UIList, { ListItem } from "@/components/UI/UIList";
import UIModal from "@/components/UI/UIModal";
import WRText from "@/components/wrappers/WRText";
import { ToastType } from "@/constants/constants.toast";
import { useAuth } from "@/context/auth-context";
import { useReferenceDate } from "@/context/reference-date-context";
import { useTargetBanks } from "@/context/target-bank-context";
import { useAppTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";
import { useTotalTransactionPeriod } from "@/context/transaction/total-transaction-period-context";
import { loadTotalTransactionPeriod } from "@/service/service.transaction";
import { getUserInfo } from "@/service/service.user";
import UserInfo from "@/types/UserInfo";
import { CryptUtil } from "@/utils/CryptoUtil";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Constants from 'expo-constants';
import { useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";


export default function ScreenControllerHomeScreen() {
    const secretKey: string | undefined = Constants.expoConfig?.extra?.PLUGGY_CRYPT_SECRET;
    if (!secretKey) {
        throw new Error('Chave de criptografia não configurada. Verifique as variáveis de ambiente.');
    }

    const { selectedBanks, setSelectedBanks } = useTargetBanks();
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [periodType, setPeriodType] = useState<'month-year' | 'custom'>('month-year');
    const { referenceDate, setReferenceDate, customDateRange, setCustomDateRange } = useReferenceDate();
    const { theme } = useAppTheme();
    const { authObject } = useAuth();
    const { showToast } = useToast();
    const { setTotalTransactionPeriod } = useTotalTransactionPeriod();

    const formatReferenceDate = () => {
        if (periodType === 'custom' && customDateRange) {
            return `${format(customDateRange.startDate, 'dd/MM', { locale: ptBR })} - ${format(customDateRange.endDate, 'dd/MM', { locale: ptBR })}`;
        }
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
            marginBottom: 16,
        },
        periodTypeButton: {
            flex: 1,
            padding: 12,
            borderRadius: 8,
            backgroundColor: theme.colors.card,
            alignItems: 'center',
        },
        periodTypeButtonActive: {
            backgroundColor: theme.colors.primary
        },
        periodTypeText: {
            fontSize: 12,
        },
        rowContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: "100%"
        }
    });

    const getBankListItems = (): ListItem[] => {
        return selectedBanks?.map((bank) => ({
            label: CryptUtil.decrypt(bank.institutionName, secretKey),
            value: bank.institutionId,
            image: {uri: CryptUtil.decrypt(bank.institutionImageUrl, secretKey)},
        })) || [];
    }

    const handleBankSelectionChange = (selectedBankIds: string[]) => {
        if (!selectedBanks) return;
        const selectedBankObjects = selectedBanks.filter(bank => selectedBankIds.includes(bank.institutionId));
        setSelectedBanks(selectedBankObjects);
    }

    const getSelectedBankIds = (): string[] => {
        return selectedBanks.map(bank => bank.institutionId);
    }

    async function handleReferenceDateOnChange(date: Date) {
        setIsLoadingData(true);
        setIsModalVisible(false);
        try {
            await loadTransactionData(date);
            setReferenceDate(date);
        } catch (error) {
            // Erro já tratado em loadTransactionData
        } finally {
            setIsLoadingData(false);
        }
    }

    async function handleCustomDateRangeChange(range: { startDate: Date; endDate: Date }) {
        setIsLoadingData(true);
        setIsModalVisible(false);
        try {
            await loadTransactionData(referenceDate, range.startDate, range.endDate);
            setCustomDateRange(range);
        } catch (error) {
            // Erro já tratado em loadTransactionData
        } finally {
            setIsLoadingData(false);
        }
    }

    async function loadTransactionData(refDate: Date, startDate?: Date, endDate?: Date) {
        let userInfo: UserInfo | null = null;
        try {
            userInfo = await getUserInfo(authObject);
        } catch(err: any) {
            showToast({
                message: "Ocorreu um erro ao puxar os dados do usuário. O suporte foi acionado.",
                type: ToastType.ERROR,
                suport: {
                    errorObject: err
                }
            })
            return;
        }
    
        if(!userInfo) {
            showToast({
                message: "Ocorreu um erro ao puxar os dados do usuário. Contate o suporte.",
                type: ToastType.ERROR
            })
            return;
        }

        if(!authObject) {
            showToast({
                message: "Ocorreu um erro ao puxar os dados de autenticação. Contate o suporte.",
                type: ToastType.ERROR
            })
            return;
        }

        try {
            const result = await loadTotalTransactionPeriod(
                userInfo.connectedBanks,
                refDate,
                authObject,
                true, // considera os cartões de crédito
                startDate,
                endDate
            );
            
            if (result) {
                setTotalTransactionPeriod(result);
            }
        } catch(err: any) {
            showToast({
                message: "Erro ao carregar dados das transações.",
                type: ToastType.ERROR,
                suport: {
                    errorObject: err
                }
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <WRText style={styles.dateReference}>Data de referência</WRText>
                {
                    selectedBanks && selectedBanks.length > 0 && (
                        <>
                            <WRText style={styles.dateReference}>Bancos conectados</WRText>
                        </>
                    )
                }
            </View>
            <View style={[styles.rowContainer, { marginTop: 8 }]}>
                <TouchableOpacity 
                    style={styles.dropdownTrigger}
                    onPress={() => setIsModalVisible(true)}
                    disabled={isLoadingData}
                >
                    <WRText style={styles.dateReference}>{formatReferenceDate()}</WRText>
                    {isLoadingData ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                        <WRText>
                            <UIIcon name="calendar" size={20} />
                        </WRText>
                    )}
                </TouchableOpacity>

                <UIModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    title="Selecionar período"
                    size="medium"
                >
                    <View style={styles.periodTypeContainer}>
                        <TouchableOpacity 
                            style={[styles.periodTypeButton, periodType === 'month-year' && styles.periodTypeButtonActive]}
                            onPress={() => setPeriodType('month-year')}
                        >
                            <WRText style={[styles.periodTypeText, periodType === 'month-year' && {color: theme.colors.background}]}>Mês/Ano</WRText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.periodTypeButton, periodType === 'custom' && styles.periodTypeButtonActive]}
                            onPress={() => setPeriodType('custom')}
                        >
                            <WRText style={[styles.periodTypeText, periodType === 'custom' && {color: theme.colors.background}]}>Período Personalizado</WRText>
                        </TouchableOpacity>
                    </View>
                    
                    {periodType === 'month-year' ? (
                        <UIDatePicker
                            value={referenceDate}
                            onChange={async (date) => {
                                await handleReferenceDateOnChange(date);
                            }}
                            mode="month-year"
                            displayFormat="MMMM yyyy"
                            limitToPresent
                            noModal
                            requiresConfirmation
                            isLoading={isLoadingData}
                        />
                    ) : (
                        <UIDatePicker
                            dateRange={customDateRange || undefined}
                            onRangeChange={async (range) => {
                                await handleCustomDateRangeChange(range);
                            }}
                            mode="date-range"
                            displayFormat="dd/MM/yyyy"
                            limitToPresent={true}
                            noModal={true}
                            requiresConfirmation
                            isLoading={isLoadingData}
                        />
                    )}
                </UIModal>
                { 
                    selectedBanks && selectedBanks.length > 0 && (
                        <View style={{width: "30%"}}>
                            <UIList
                                items={getBankListItems()}
                                selectable={true}
                                selectedValues={getSelectedBankIds()}
                                onSelectionChange={handleBankSelectionChange}
                                placeholder=""
                                selectAllByDefault={true}
                                minSelected={1}
                                showSelectAll={true}
                                title="Bancos"
                                showImages
                            />
                        </View>
                    )
                }
            </View>
        </View>
    )
}