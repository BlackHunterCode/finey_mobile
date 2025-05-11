/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Tela de Login.
 */

import WRText from "@/components/wrappers/WRText";
import { useAuth } from "@/context/auth-context";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();
  
    const handleLogin = async () => {
      try {
        await signIn(email, password);
        router.replace('../../../authenticated/(tabs)/home');
      } catch (error) {
        Alert.alert('Erro', 'Falha no login: ' + error);
      }
    };

    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                <WRText style={{ fontSize: 24, marginBottom: 20 }}>Login</WRText>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
                />
                <TextInput
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
                />
                <Button title="Entrar" onPress={handleLogin} />
                <Link href={"../register/register"} asChild>
                    <WRText style={{ marginTop: 15, color: 'blue' }}>Criar uma conta</WRText>
                </Link>
            </View>
        </>
    )
}