/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Provedor e Contexto do tema do aplicativo.
 * 
 * É ESTRITAMENTE PROIBIDO ALTERAR ESTE ARQUIVO SEM AUTORIZAÇÃO PRÉVIA DE UM CODEOWNER.
 */

import { AppTheme, darkTheme, lightTheme } from "@/theme/theme";
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

interface ThemeContextType {
    theme: AppTheme;
    colorScheme: ColorSchemeName;
    toggleTheme: () => Promise<void>;
    isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: darkTheme,
    colorScheme: 'dark',
    toggleTheme: async () => {},
    isDark: true
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemScheme = Appearance.getColorScheme() as ColorSchemeName;
    console.log(systemScheme);
    const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemScheme || 'dark');
    const [theme, setTheme] = useState<AppTheme>(
        colorScheme === 'dark' ? darkTheme : lightTheme
    );
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            const stored = await SecureStore.getItemAsync('theme');
            if(stored === 'dark' || stored === 'light') {
                setColorScheme(stored);
            }
            setIsLoaded(true);
        })();
    }, []);

    useEffect(() => {
        setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    }, [colorScheme]);

    const toggleTheme = async () => {
        const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
        setColorScheme(newScheme);
        await SecureStore.setItemAsync('theme', newScheme);
    }
    
    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme, isDark: colorScheme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useAppTheme() {
    const context = useContext(ThemeContext);
    if(context === undefined) {
        throw new Error('useAppTheme must be used within a ThemeProvider');
    }
    return context;
}
