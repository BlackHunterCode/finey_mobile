/**
 * © 2025 Finey - Todos os Direitos Reservados.
 * 
 * Tela de Configurações.
 */

import AboutUserConfigurationScreen from '@/components/component_screens/configuration_screen/about-user-configuration-screen';
import Copyright from '@/components/component_screens/copyright';
import UIButton from '@/components/UI/UIButton';
import UICard from '@/components/UI/UICard';
import UIIcon from '@/components/UI/UIIcon';
import WRScreenContainer from '@/components/wrappers/WRScreenContainer';
import WRText from '@/components/wrappers/WRText';
import { useAuth } from '@/context/auth-context';
import { useNavigation } from '@/context/navigation-context';
import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ConfigurationScreen() {
  const { signOut } = useAuth();
  const { pushToSplashScreen } = useNavigation();
  const { theme, isDark } = useAppTheme();

  const renderIcon = (name: React.ComponentProps<typeof Ionicons>['name'], backgroundLightColor: string[]) => {
    return (
      isDark ? (
        <UIIcon 
          useGradient
          withBackground
          gradientColors={['#323232', '#111111']}
          name={name}
          color={theme.colors.primary}
          size={20}
        />
      ) : (
        <UIIcon 
          useGradient
          withBackground
          gradientColors={backgroundLightColor}
          name={name}
          color={"#FFF"}
          size={20}
        />
      )
    )
  }

  const styles = StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    textMutedCenter: {
      textAlign: 'center',
      color: theme.colors.muted,
      fontSize: 12
    },
    textCenter: {
      textAlign: 'center'
    }
  });

  return (
    <WRScreenContainer>
      <View>
        <WRText style={[styles.textCenter, { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }]}>Configurações</WRText>

        <AboutUserConfigurationScreen />
       
        <WRText style={[styles.textMutedCenter, { marginVertical: 15 }]}>
          Defina suas preferências e aproveite melhor o Finey
        </WRText>
       
        <UICard 
         style={{ marginBottom: 6, borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}
         href='/'
         openStack
         >
          <View style={[styles.rowContainer, { gap: 14 }]}>
            {renderIcon('lock-closed-sharp', ['#8DD0FF', '#0078CD'])}
            <WRText>Conta e Segurança</WRText>
          </View>
        </UICard>

        <UICard 
         style={{ marginBottom: 6, borderRadius: 0 }}
         href='/'
         openStack
         >
          <View style={[styles.rowContainer, { gap: 14 }]}>
            {renderIcon('notifications', ['#FEE2A5', '#FFC300'])}
            <WRText>Notificações</WRText>
          </View>
        </UICard>

        <UICard 
         style={{ marginBottom: 6, borderRadius: 0 }}
         href='/'
         openStack
         >
          <View style={[styles.rowContainer, { gap: 14 }]}>
            {renderIcon('git-branch', ['#D3FFB1', '#00CD00'])}
            <WRText>Integrações</WRText>
          </View>
        </UICard>

        <UICard 
         style={{ marginBottom: 6, borderRadius: 0 }}         
         href='/'
         openStack
         >
          <View style={[styles.rowContainer, { gap: 14 }]}>
            {renderIcon('sunny', ['#933BF2', '#570BA9'])}
            <WRText>Preferências</WRText>
          </View>
        </UICard>

        <UICard 
         style={{ marginBottom: 6, borderRadius: 0 }}          
         href='/'
         openStack
         >
          <View style={[styles.rowContainer, { gap: 14 }]}>
            {renderIcon('help-circle', ['#D0D0D0', '#737373'])}
            <WRText>Suporte</WRText>
          </View>
        </UICard>

        <UICard 
         style={{ marginBottom: 6, borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
         href='/'
         openStack
         >
          <View style={[styles.rowContainer, { gap: 14 }]}>
            {renderIcon('alert-circle', ['#F49595', '#F21800'])}
            <WRText>Sobre o Finey</WRText>
          </View>
        </UICard>

        <Copyright style={{ marginVertical: 15 }}/>

        <UIButton 
          text="Sair"
          hasBackground={false}
          textColor='#FF0000'
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