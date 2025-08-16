import WRText from "@/components/wrappers/WRText";
import { useNavigation } from '@/context/navigation-context';
import { useSplashErrorMessage } from '@/context/splash-error-message-context';
import { useAppTheme } from "@/context/theme-context";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface SplashScreenProps {
    onRouterSuccess?: Href;
    onRouterError?: Href;
    message?: string;
    onProcess?: () => Promise<void> | void;
    processingTime?: number;
}

function extractErrorMessage(error: any): string {
    if (!error) return 'Erro desconhecido ao processar operação.';
    if (typeof error === 'string') return error;
    if (error.response && error.response.data && typeof error.response.data.message === 'string') {
        return error.response.data.message;
    }
    if(error._response) return JSON.stringify(error._response);
    //if (typeof error.message === 'string') return error.message;
    return JSON.stringify(error);
}

export default function SplashScreen({ message, onProcess, onRouterSuccess, onRouterError, processingTime = 2000 }: SplashScreenProps) {
    const { theme } = useAppTheme();
    const router = useRouter();
    const { hideSplashScreen } = useNavigation();
    const { setErrorMessage } = useSplashErrorMessage();

    useEffect(() => {
        let isMounted = true;
        async function runOnProcess() {
            console.log("SplashScreen: Iniciando runOnProcess");
            try {
                if (onProcess) {
                    console.log("SplashScreen: Executando onProcess");
                    await onProcess();
                    console.log("SplashScreen: onProcess finalizado");
                }
                setTimeout(() => {
                    if (isMounted && onRouterSuccess) {
                        console.log("SplashScreen: Redirecionando para", onRouterSuccess);
                        setErrorMessage(null);
                        hideSplashScreen();
                        router.replace(onRouterSuccess);
                    }
                }, processingTime);
            } catch (error: any) {
                console.log("SplashScreen: Erro no onProcess", error);
                console.log(extractErrorMessage(error))
                setErrorMessage(extractErrorMessage(error));
                setTimeout(() => {
                    if (isMounted && onRouterError) {
                        console.log("SplashScreen: Redirecionando para rota de erro", onRouterError);
                        setTimeout(() => {
                            hideSplashScreen();
                            router.replace(onRouterError);
                        }, 100); // Delay para garantir atualização do contexto
                    }
                }, processingTime);
            }
        }
        runOnProcess();
        return () => { isMounted = false; };
    }, [onProcess, onRouterSuccess, onRouterError, processingTime]);

    return (
        <View style={[styles.container, styles.overlay, { backgroundColor: theme.colors.background }]}>
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
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