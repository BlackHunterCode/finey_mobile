/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Tela de Cadastro.
 */

import WRText from '@/components/wrappers/WRText';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function RegisterScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <WRText>Tela de Cadastro</WRText>
            <Link href={"../login/login"} asChild>
            <WRText style={{ marginTop: 15, color: 'blue' }}>Já tenho uma conta</WRText>
            </Link>
        </View>
    );
}