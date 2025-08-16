import Copyright from "@/components/component_screens/copyright";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { useAppTheme } from "@/context/theme-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function LoggedOutScreen() {
    const { theme, isDark } = useAppTheme();
    const router = useRouter();

    const handleLogin = () => {
        router.push("./login/login");
    };

    const handleRegister = () => {
        router.push("./register/register");
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: true, headerStyle: { backgroundColor: theme.colors.background } }} />
            <WRScreenContainer style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.content}>
                    {/* Logo/Branding */}
                    <View style={styles.logoContainer}>
                        <View style={[styles.logo, { backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
                            <WRText style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>FN</WRText>
                        </View>
                        <WRText style={[styles.title, { color: theme.colors.primary }]}>
                            Finey
                        </WRText>
                        <WRText style={[styles.subtitle, { color: theme.colors.muted }]}>
                            Sua carteira digital segura e prática
                        </WRText>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity 
                            onPress={handleLogin}
                            style={styles.primaryButton}
                        >
                            <LinearGradient
                                colors={theme.colors.primaryGradient as [string, string]}
                                style={styles.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <WRText style={styles.primaryButtonText}>
                                    Entrar
                                </WRText>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={handleRegister}
                            style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
                        >
                            <WRText style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
                                Criar Conta
                            </WRText>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <Copyright style={{ marginBottom: 24 }}/>
                </View>
            </WRScreenContainer>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 24,
    },
    buttonsContainer: {
        width: '100%',
        marginBottom: 40,
    },
    primaryButton: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white', 
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    }
});