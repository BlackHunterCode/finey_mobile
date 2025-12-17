import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import BankTransactionsScreen from "@/components/component_screens/finance_screen/bank-transactions-screen";
import FinanceGreetingScreen from "@/components/component_screens/finance_screen/finance-greeting-screen";
import FinancialCommitmentsScreen from "@/components/component_screens/finance_screen/financial-commitments-screen";
import FinancialGoalsScreen from "@/components/component_screens/finance_screen/financial-goals-screen";
import { ScrollView, View, StyleSheet } from "react-native";

export default function FinanceScreen() {
    return (
        <WRScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <FinanceGreetingScreen />
                <BankTransactionsScreen />
                <View style={styles.separator} />
                <FinancialCommitmentsScreen />
                <View style={styles.separator} />
                <FinancialGoalsScreen />
            </ScrollView>
        </WRScreenContainer>
    )
}

const styles = StyleSheet.create({
    separator: {
        height: 16,
    }
});