import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { LinearGradient } from "expo-linear-gradient";
import { Href } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface SplashScreenProps {
    onRouterSuccess?: Href;
    onRouterError?: Href;
    message?: string;
    onProcess?: () => void;
}

export default function SplashScreen({ message }: SplashScreenProps) {
    const { theme } = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LinearGradient
                colors={theme.colors.primaryGradient as [string, string]}
                style={styles.logoContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <WRText style={styles.logoText}>FN</WRText>
            </LinearGradient>
            
            <WRText style={[styles.title, { color: theme.colors.primary }]}>
                Finey
            </WRText>
            
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <WRText style={[styles.loadingText, { color: theme.colors.muted }]}>
                    {message || "Carregando..."}
                </WRText>
            </View>

              <View style={styles.footer}>
                <WRText style={[styles.footerText, { color: theme.colors.muted }]}>
                    Utilizamos criptografia de ponta a ponta.
                </WRText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    logoText: {
        fontSize: 40,
        fontWeight: "bold",
        color: "white",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 40,
    },
    loadingContainer: {
        alignItems: "center",
        marginBottom: 15
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center'
    },
     footer: {
        alignItems: 'center',
        marginBottom: 24,
    },
      footerText: {
        fontSize: 15,
        textAlign: 'center',
        opacity: 0.7,
    }
});