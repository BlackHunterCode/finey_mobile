import { useAppTheme } from "@/context/theme-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ConnectBankStackLayout() {
    const { theme, isDark } = useAppTheme();
    return (
        <>
            <StatusBar
                translucent={false} // Desative translucent
                backgroundColor={theme.colors.background} // Cor de fundo da status bar
            />
            <Stack
                screenOptions={{
                    headerTitle: '',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: theme.colors.background
                    },
                    headerTintColor: theme.colors.primary
                }}
            />
        </>
    )
}