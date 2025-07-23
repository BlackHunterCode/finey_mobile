/**
 * © 2025 Finey - Todos os Direitos Reservados.
 * 
 * Tela de Configurações.
 */

import UIButton from '@/components/UI/UIButton';
import WRScreenContainer from '@/components/wrappers/WRScreenContainer';
import WRText from '@/components/wrappers/WRText';
import { useAuth } from '@/context/auth-context';
import { useNavigation } from '@/context/navigation-context';
import React from 'react';
import { View } from 'react-native';

export default function ConfigurationScreen() {
  const { signOut } = useAuth();
  const { pushToSplashScreen } = useNavigation();

  return (
    <WRScreenContainer>
      <View>
        <WRText>Configuration Screen</WRText>

        <UIButton 
          text="Sair"
          hasBackground={false}
          size="medium"
          onPress={() => { 
            signOut(); 
            pushToSplashScreen({
              onRouterSuccess: "../../unauthenticated/(stack)/logged-out" as const,
              message: "Volte sempre!",
              processingTime: 5500
            });
          }}
        />
      </View>
    </WRScreenContainer>
  );
}