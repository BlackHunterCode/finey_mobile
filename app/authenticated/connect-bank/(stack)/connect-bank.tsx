import UIButton from "@/components/UI/UIButton";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { ToastType } from "@/constants/constants.toast";
import { useAuth } from "@/context/auth-context";
import { useNavigation } from "@/context/navigation-context";
import { useToast } from "@/context/toast-context";
import { connectToBank } from "@/service/service.financial-integrator";
import { Stack } from "expo-router";
import { JSX, useState } from "react";
import { Image } from "react-native";

export default function ConnectBankScreen() {
    const [bankWebView, setBankWebView] = useState<JSX.Element | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const { authObject } = useAuth();
    const { showToast } = useToast();
    const { pushToSplashScreen } = useNavigation();

    async function handleConnectBank() {
        try {
        setIsLoading(true);
        setHasError(false);
        
        const webViewComponent = await connectToBank({
            authObject: authObject,
            onSuccess: () => {
                setBankWebView(null);
                setIsLoading(false);
                showToast({
                    message: "Conexão com o banco realizada com sucesso!",
                    type: ToastType.SUCCESS
                });
                pushToSplashScreen({
                    onRouterSuccess: "../../(tabs)/home" as const,
                    message: "Redirecionando para a tela inicial...",
                    processingTime: 1500
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
            <Stack.Screen options={{ headerShown: true }} />
            {/* <Image /> */}
            <WRScreenContainer allContentCenter>
                <Image 
                    source={require("../../../../assets/images/hunter/hunter_rico.png")} 
                    alt="Hunter Rico"
                    style={{
                        width: 200,
                        height: 200,
                        opacity: 0.6
                    }}
                />
                <WRText style={{textAlign: 'center', marginBottom: 25}}><WRText style={{fontWeight: 'bold'}}>Hunter</WRText>, vimos que você ainda não conectou sua conta bancária. O que esta esperando?</WRText>
                <UIButton 
                    text="Conectar e mudar de vida." 
                    onPress={handleConnectBank} 
                    isLoading={isLoading}
                    error={hasError}
                />
            </WRScreenContainer>
        </>
    )
}