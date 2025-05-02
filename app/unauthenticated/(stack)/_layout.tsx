import { useAppTheme } from "@/context/theme-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function StackLayout() {
    const { theme, isDark } = useAppTheme();
    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Stack
                screenOptions={{
                    headerTitle:'',
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