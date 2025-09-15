/**
 * © 2025 Finey - Todos os Direitos Reservados.
 * 
 * Layout de navegação por tabs para a área autenticada.
 */

import { useAppTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout() {
    const { theme, isDark } = useAppTheme();
    
    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Tabs
                screenOptions={{
                    headerTitle: '',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: theme.colors.background
                    },
                    headerTintColor: theme.colors.primary,
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.text,
                    tabBarStyle: {
                        backgroundColor: theme.colors.background,
                        borderTopColor: theme.colors.border
                    }
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home-outline" size={size} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="learn"
                    options={{
                        title: 'Aprenda',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="school-outline" size={size} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="configuration"
                    options={{
                        title: 'Configurações',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="settings-outline" size={size} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="teste"
                    options={{
                        title: 'Teste',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="settings-outline" size={size} color={color} />
                        )
                    }}
                />
            </Tabs>
        </>
    );
}