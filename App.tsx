/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Componente entrypoint do aplicativo.
 * 
 * É ESTRITAMENTE PROIBIDO ALTERAR ESTE ARQUIVO SEM AUTORIZAÇÃO PRÉVIA DE UM CODEOWNER.
 */

import { useFonts } from "expo-font";
import { Text } from "react-native";
import RootLayout from "./app/_layout";
import { ThemeProvider } from "./context/theme-context";

export default function App() {
    /* Fontes do aplicativo */
    const [loaded] = useFonts({
        'SF-PRO-DISPLAY-REGULAR': require('./assets/fonts/sf-pro-display/SFPRODISPLAYREGULAR.OTF'),
        'SF-PRO-DISPLAY-MEDIUM': require('./assets/fonts/sf-pro-display/SFPRODISPLAYMEDIUM.OTF'),
        'SF-PRO-DISPLAY-BOLD': require('./assets/fonts/sf-pro-display/SFPRODISPLAYBOLD.OTF'),
        'SF-PRO-DISPLAY-ITALIC': require('./assets/fonts/sf-pro-display/SFPRODISPLAYLIGHTITALIC.OTF'),
    });

    if(!loaded) {
        return (
            <>
                <Text>Houve um erro ao carregar as fontes.</Text>
            </>
        )
    }

    return (
        <ThemeProvider>
            <RootLayout/>
        </ThemeProvider>
    );
}