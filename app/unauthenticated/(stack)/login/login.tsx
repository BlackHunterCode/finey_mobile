/**
 * 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Tela de Login.
 */

import UIButton from "@/components/UI/UIButton";
import WRScreenContainer from "@/components/wrappers/WRScreenContainer";
import WRText from "@/components/wrappers/WRText";
import { ToastType } from "@/constants/constants.toast";
import { useAuth } from "@/context/auth-context";
import { useNavigation } from "@/context/navigation-context";
import { useReferenceDate } from "@/context/reference-date-context";
import { useAppTheme } from "@/context/theme-context";
import { useToast } from "@/context/toast-context";
import { useTotalTransactionPeriod } from "@/context/transaction/total-transaction-period-context";
import { getAuthObjectStore } from "@/service/service.auth";
import { loadTotalTransactionPeriod } from "@/service/service.transaction";
import { getUserInfo } from "@/service/service.user";
import AuthResponse from "@/types/AuthResponse";
import UserInfo from "@/types/UserInfo";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('takashi.yui@gmail.com');
    const [password, setPassword] = useState('DarkLover123');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { signIn } = useAuth();
    const { theme, isDark } = useAppTheme();
    const { showToast } = useToast();
    const { pushToSplashScreen } = useNavigation();
    const { referenceDate } = useReferenceDate();
    const { setTotalTransactionPeriod } = useTotalTransactionPeriod();

    const handlePriorities = async (authResponse: AuthResponse) => {
      let userInfo: UserInfo | null = null;
      try {
        userInfo = await getUserInfo(authResponse);
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
    
      if(userInfo.connectedBanks.length === 0) {
        pushToSplashScreen({
          onRouterSuccess: '../../../authenticated/connect-bank/(stack)/connect-bank' as const,
          processingTime: 4500
        });
      }
      else {
        pushToSplashScreen({
          onRouterSuccess: '../../../authenticated/(tabs)/home' as const,
          onProcess: async () => {
            const result = await loadTotalTransactionPeriod(
              userInfo.connectedBanks,
              referenceDate,
              authResponse,
              true // considera os cartões de crédito.
            );
            if (result) {
              setTotalTransactionPeriod(result);
            }
          },
          processingTime: 4500
        });
      }
    } 

    const handleLogin = async () => {
      if (!email || !password) {
        Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
        return;
      }
      
      try {
        setIsLoading(true);
        setHasError(false);

        await signIn(email, password);
        
        const freshAuth = await getAuthObjectStore();
        if(!freshAuth) {
          throw new Error('Erro ao realizar o login.');
        }
        await handlePriorities(freshAuth);
      } catch (error) {
        setHasError(true);
        showToast({
          message: "Não foi possível se conectar ao servidor.",
          type: ToastType.ERROR,
          action: {
            label: "Suporte",
            onPress: () => {
              Alert.alert("Chamar webview de suporte")
            }
          },
          duration: 8000
        })
      } finally {
        setIsLoading(false);
      }
    };

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    return (
      <>
        <WRScreenContainer style={[{ backgroundColor: theme.colors.background }]}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <WRText style={[styles.title, { color: theme.colors.primary }]}>
                  Bem-vindo de volta!
                </WRText>
                <WRText style={[styles.subtitle, { color: theme.colors.muted }]}>
                  Faça login para continuar
                </WRText>
              </View>

              <View style={styles.form}>
                <View style={[
                  styles.inputContainer, 
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
                ]}>
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor={theme.colors.muted}
                    value={email}
                    onChangeText={setEmail}
                    style={[styles.input, { color: theme.colors.text }]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={[
                  styles.inputContainer, 
                  { 
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    marginTop: 16
                  }
                ]}>
                  <TextInput
                    placeholder="Senha"
                    placeholderTextColor={theme.colors.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    style={[styles.input, { color: theme.colors.text }]}
                  />
                  <TouchableOpacity 
                    onPress={togglePasswordVisibility}
                    style={styles.visibilityIcon}
                  >
                    <WRText style={{ color: theme.colors.primary }}>
                      {isPasswordVisible ? 'Esconder' : 'Mostrar'}
                    </WRText>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.forgotPassword}
                  onPress={() => {}}
                >
                  <WRText style={{ color: theme.colors.primary, fontSize: 14 }}>
                    Esqueceu sua senha?
                  </WRText>
                </TouchableOpacity>

                <UIButton
                  text="Entrar"
                  onPress={handleLogin}
                  isLoading={isLoading}
                  error={hasError}
                  style={styles.loginButton}
                  textColor={isDark ? theme.colors.background : theme.colors.text}
                  size="large"
                />
              </View>

              <View style={styles.footer}>
                <WRText style={{ color: theme.colors.muted }}>
                  Não tem uma conta?{' '}
                </WRText>
                <Link href={"../register/register"} asChild>
                  <Pressable>
                    <WRText style={{ color: theme.colors.primary, fontWeight: '600' }}>
                      Cadastre-se
                    </WRText>
                  </Pressable>
                </Link>
              </View>
            </View>
          </KeyboardAvoidingView>
        </WRScreenContainer>
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    width: '100%',
    paddingVertical: 16,
  },
  visibilityIcon: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});