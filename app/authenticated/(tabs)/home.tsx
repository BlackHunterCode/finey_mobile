/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Tela Home.
 */

import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function HomeScreen() {
    const { isDark } = useAppTheme();
    const [ useDarkMode, setUseDarkMode ] = useState(false);
    useEffect(() => {
        setUseDarkMode(isDark);
    }, [isDark])
    return (
        <View 
            style={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center'
            }}
        >
            <WRText>Tela de home! (To logado)</WRText>
            <WRText>{useDarkMode ? "Usando Thema Escuro" : "Usando Tema Claro!"}</WRText>
        </View>
    )
}