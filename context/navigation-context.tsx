/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Provedor e Contexto para gerenciamento de navegação com tela de splash no aplicativo.
 */

import SplashScreen from '@/components/component_screens/splash_screen/splash';
import { Href, router } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';
import { splashPhrases } from '@/constants/constants.app-phrases';

interface NavigationContextData {
  pushToSplashScreen: (params: {
    onRouterSuccess?: Href;
    onRouterError?: Href;
    message?: string;
    onProcess?: () => void;
    processingTime?: number;
  }) => void;
}

const NavigationContext = createContext<NavigationContextData | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [splashParams, setSplashParams] = useState<{
    onRouterSuccess?: Href;
    onRouterError?: Href;
    message?: string;
    onProcess?: () => void;
    processingTime?: number;
  }>({});

  const pushToSplashScreen = (params: {
    onRouterSuccess?: Href;
    onRouterError?: Href;
    message?: string;
    onProcess?: () => void;
    processingTime?: number;
  }) => {
    setSplashParams(params);
    setShowSplash(true);
    
    // Executa o processamento se fornecido
    if (params.onProcess) {
      try {
        params.onProcess();
        // Após o processamento, navega para a rota de sucesso se fornecida
        if (params.onRouterSuccess) {
          setTimeout(() => {
            setShowSplash(false);
            if (params.onRouterSuccess) {
              router.replace(params.onRouterSuccess);
            }
          }, params.processingTime || 2000);
        }
      } catch (error) {
        // Em caso de erro, navega para a rota de erro se fornecida
        if (params.onRouterError) {
          setTimeout(() => {
            setShowSplash(false);
            if (params.onRouterError) {
              router.replace(params.onRouterError);
            }
          }, params.processingTime || 2000);
        }
      }
    } else {
      // Se não houver processamento, apenas navega após o tempo definido
      if (params.onRouterSuccess) {
        setTimeout(() => {
          setShowSplash(false);
          if (params.onRouterSuccess) {
            router.replace(params.onRouterSuccess);
          }
        }, params.processingTime || 2000);
      }
    }
  };

  return (
    <NavigationContext.Provider value={{ pushToSplashScreen }}>
      {showSplash ? (
        <SplashScreen 
          onRouterSuccess={splashParams.onRouterSuccess}
          onRouterError={splashParams.onRouterError}
          message={splashParams.message || splashPhrases[Math.floor(Math.random() * splashPhrases.length)]}
          onProcess={splashParams.onProcess}
        />
      ) : (
        children
      )}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}