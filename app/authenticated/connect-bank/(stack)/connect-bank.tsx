import IntroSlideConnectBankScreen from "@/components/component_screens/connect-bank_screen/intro-slide-connect-bank-screen";
import UIButton from "@/components/UI/UIButton";
import UICard from "@/components/UI/UICard";
import UIPageMan, { UIPageManController } from "@/components/UI/UIPageMan";
import UIReviewsCarousel from "@/components/UI/UIReviewsCarousel";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { ToastType } from "@/constants/constants.toast";
import { useAuth } from "@/context/auth-context";
import { useNavigation } from "@/context/navigation-context";
import { useReferenceDate } from "@/context/reference-date-context";
import { useAppTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";
import { useTotalTransactionPeriod } from "@/context/transaction/total-transaction-period-context";
import { connectToBank } from "@/service/service.financial-integrator";
import { loadTotalTransactionPeriod } from "@/service/service.transaction";
import { getUserInfo } from "@/service/service.user";
import { AppTheme } from "@/theme/theme";
import UserInfo from "@/types/UserInfo";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function ConnectBankScreen() {
    const [bankWebView, setBankWebView] = useState<JSX.Element | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [activeTabId, setActiveTabId] = useState<string>('intro');

    const { authObject } = useAuth();
    const { showToast } = useToast();
    const { pushToSplashScreen } = useNavigation();
    const { referenceDate } = useReferenceDate();
    const { setTotalTransactionPeriod } = useTotalTransactionPeriod();
    const { theme, isDark } = useAppTheme();
    const pagerRef = useRef<UIPageManController | null>(null);

    const tabs = useMemo(() => ([
        { id: "intro", title: "●", content: (<IntroSlideConnectBankScreen />) },
        { 
            id: "fit", title: "●", content: (
                <View style={styles.slide}>
                    <AnimatedTitle theme={theme}>Como o Finey mudou minha vida financeira 💸</AnimatedTitle>
                    <UICard style={{ width: '92%', marginTop: 16 }}>
                        <WRText style={{ fontWeight: '700', marginBottom: 6 }}>Organização que gera resultados</WRText>
                        <WRText style={{ opacity: 0.8 }}>
                            Com o Finey eu passei a ver claramente para onde meu dinheiro vai.
                            Em 3 meses, reduzi gastos supérfluos, eliminei tarifas esquecidas e
                            comecei a investir com segurança. Meu fluxo de caixa nunca foi tão saudável.
                        </WRText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                            <WRText style={{ opacity: 0.7 }}>Avaliação dos usuários</WRText>
                            <WRText style={{ fontWeight: '700' }}>4,9/5 ⭐</WRText>
                        </View>
                    </UICard>
                    <View style={{ width: '100%', marginTop: 16 }}>
                        <UIReviewsCarousel 
                            reviews={[
                                { author: 'Ana', rating: 5, text: 'Economizei 18% só organizando categorias no Finey.' },
                                { author: 'Carlos', rating: 5, text: 'Identifiquei 12 assinaturas esquecidas com os insights.' },
                                { author: 'Marina', rating: 5, text: 'Criei metas visuais e mantive motivação para poupar.' },
                                { author: 'João', rating: 4, text: 'Controlei impulsos de compra e sobrou dinheiro para investir.' },
                            ]}
                        />
                    </View>
                </View>
            ) 
        },
        { 
            id: "bad", title: "●", content: (
                <View style={styles.slide}>
                    <AnimatedTitle theme={theme}>Sem organização, o dinheiro escapa 📉</AnimatedTitle>
                    <WRText style={[styles.subtitle, { marginTop: 8 }, { color: theme.colors.text }]}>Sem um controle claro, você pode perder até <WRText style={{ color: '#FF8A00', fontWeight: '800' }}>20% da renda</WRText> com gastos desnecessários e tarifas. O Finey te mostra onde cortar sem sofrimento.</WRText>
                </View>
            )
        },
        { 
            id: "good", title: "●", content: (
                <View style={[styles.slide, { paddingHorizontal: 13 }]}>
                    <AnimatedTitle theme={theme}>Com o Finey, você recupera o controle ✅</AnimatedTitle>
                    <WRText style={[styles.subtitle, { marginTop: 8 }, { color: theme.colors.text }]}>Usuários do Finey têm <WRText style={{ color: '#2BD97B', fontWeight: '800' }}>3x mais chances</WRText> de cumprir metas e economizam em média <WRText style={{ color: '#2BD97B', fontWeight: '800' }}>15%</WRText> com decisões mais inteligentes.</WRText>
                </View>
            )
        },
        {
            id: "pluggy",
            title: "●",
            content: (
                <View style={[styles.slide]}>
                    <AnimatedTitle theme={theme}>Conectamos via Pluggy 🔌🏦</AnimatedTitle>
                    <WRText style={[styles.subtitle, { color: theme.colors.text }]}>Usamos o Pluggy para buscar seus dados bancários com seu consentimento, garantindo integração moderna e confiável.</WRText>
                </View>
            )
        },
        {
            id: "security",
            title: "●",
            content: (
                <View style={styles.slide}>
                    <AnimatedTitle theme={theme}>Segurança de ponta a ponta 🔐</AnimatedTitle>
                    <WRText style={[styles.subtitle, { color: theme.colors.text }]}>Aplicamos criptografia de ponta a ponta. É 100% seguro conectar sua conta e você pode desconectar quando quiser 🛡️</WRText>
                </View>
            )
        },
        { 
            id: "connect", title: "●", content: (
                <View style={styles.slide}>
                    <AnimatedTitle theme={theme}>Pronto para avançar?</AnimatedTitle>
                    <WRText style={[styles.subtitle, { color: theme.colors.text }]}>Conecte sua conta bancária com segurança e aproveite todo o potencial do Finey.</WRText>
                    <View style={{ width: '92%', marginTop: 16 }}>
                        <UIButton
                            text="Conectar sua conta bancária"
                            icon="lock-closed"
                            onPress={handleConnectBank}
                            isLoading={isLoading}
                            error={hasError}
                            style={{ width: '100%' }}
                        />
                    </View>
                </View>
            )
        }
    ]), []);

    async function handleConnectBank() {
        try {
        setIsLoading(true);
        setHasError(false);
        
        const webViewComponent = await connectToBank({
            authObject: authObject,
            onSuccess: async () => {
                let userInfo: UserInfo | null = null;
                try {
                  userInfo = await getUserInfo(authObject);
                } catch(err: any) {
                  showToast({
                    message: "Ocorreu um erro ao puxar os dados do usuário. O suporte foi acionado.",
                    type: ToastType.ERROR,
                    suport: {
                      errorObject: err
                    }
                  })
                }
          
                if(!userInfo) {
                  showToast({
                    message: "Ocorreu um erro ao puxar os dados do usuário. Contate o suporte.",
                    type: ToastType.ERROR
                  })
                  return;
                }

                if(!authObject) {
                    showToast({
                        message: "Ocorreu um erro ao puxar os dados de autenticação. Contate o suporte.",
                        type: ToastType.ERROR
                    })
                    return;
                }

                setBankWebView(null);
                setIsLoading(false);
                showToast({
                    message: "Conexão com o banco realizada com sucesso!",
                    type: ToastType.SUCCESS
                });
                pushToSplashScreen({
                    onRouterSuccess: "/authenticated/(tabs)/home",
                    message: "Redirecionando para a tela inicial...",
                    onProcess: async () => {
                        const result = await loadTotalTransactionPeriod(
                            userInfo.connectedBanks,
                            referenceDate,
                            authObject,
                            true // considera os cartões de crédito.
                        );
                        if (result) {
                            setTotalTransactionPeriod(result);
                        }
                    },
                    processingTime: 5500
                })
            },
            onError: (err) => {
            if(err && err != 'closed') {
                setIsLoading(false);
                setHasError(true);
                
                let message = "Erro ao conectar com o banco.";
                if(err.message) {
                message = "Erro: " + err.message;
                }

                showToast({
                    message: message,
                    type: ToastType.ERROR,
                    action: {
                        label: "TENTAR NOVAMENTE",
                        onPress: handleConnectBank
                    },
                    suport: {
                        errorObject: err
                    }
                });
            } else if(!err) {
                // Exibir toast de erro genérico
                showToast({
                    message: "Erro ao conectar com o banco. Ocorreu algum erro inesperado ou a sessão de conexão expirou.",
                    type: ToastType.ERROR,
                    action: {
                        label: "TENTAR NOVAMENTE",
                        onPress: handleConnectBank
                    }
                });
            }
            setBankWebView(null);
            },
        });

        if (webViewComponent) {
            setBankWebView(webViewComponent);
            setIsLoading(false);
        }
        } catch (error) {
        setIsLoading(false);
        setHasError(true);
        showToast({
            message: "Erro ao conectar com o banco",
            type: ToastType.ERROR
        });
        }
    }

    if (bankWebView) return bankWebView;

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <WRScreenContainer asView style={{paddingHorizontal: 0}}>
                <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <LinearGradient
                        colors={isDark ? ['#000', '#1b1b1bff'] : [theme.colors.background, theme.colors.card]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0.6 }}
                        style={styles.bgGradient}
                    />
                    <UIPageMan 
                        ref={pagerRef}
                        tabs={tabs}
                        scrollableTabs={false}
                        centerTabs
                        showIndicator={false}
                        hideTabsHeader={true}
                        showNavigationArrows={true}
                        style={{ flex: 1 }}
                        tabsContainerStyle={{ borderBottomWidth: 0, paddingVertical: 0 }}
                        tabStyle={{ paddingVertical: 4, paddingHorizontal: 8 }}
                        tabTextStyle={{ opacity: 0.6 }}
                        activeTabTextStyle={{ opacity: 1 }}
                        onTabChange={(id) => setActiveTabId(id)}
                    />

                    <View style={[styles.footer, { alignItems: 'center' }] }>
                        <View style={{ flexDirection: 'row', columnGap: 8 }}>
                            {tabs.map((t) => (
                                <View
                                    key={t.id}
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        position: 'relative',
                                        bottom: 50,
                                        backgroundColor: t.id === activeTabId ? theme.colors.primary : theme.colors.border,
                                        opacity: t.id === activeTabId ? 1 : 0.6
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </WRScreenContainer>
        </>
    )
}

function AnimatedTitle({ theme, children }: { theme: AppTheme, children: React.ReactNode }) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(10);
    useEffect(() => {
        opacity.value = withTiming(1, { duration: 600 });
        translateY.value = withTiming(0, { duration: 600 });
    }, [opacity, translateY]);
    const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));
    return <Animated.Text style={[styles.title, style, {color: theme.colors.text}]}>{children as any}</Animated.Text>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    slide: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingHorizontal: 18
    },
    emojiLayer: {
        ...StyleSheet.absoluteFillObject,
    },
    emoji: {
        position: 'absolute',
        fontSize: 36,
        opacity: 0.25,
    },
    emojiSm: {
        fontSize: 28,
    },
    emojiLg: {
        fontSize: 56,
    },
    emojiXLg: {
        fontSize: 86,
    },
    bgGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    glass: {
        width: '92%',
        borderRadius: 18,
        padding: 16,
        backgroundColor: '#FFFFFF10',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        opacity: 0.8,
    },
    footer: {
        paddingHorizontal: 0,
    }
});
