/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Provedor e Contexto para gerenciamento de navegação com tela de splash no aplicativo.
 */

import SplashScreen from '@/components/component_screens/splash_screen/splash';
import { splashPhrases } from '@/constants/constants.app-phrases';
import { Href } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';

interface NavigationContextData {
  pushToSplashScreen: (params: {
    onRouterSuccess?: Href;
    onRouterError?: Href;
    message?: string;
    onProcess?: () => Promise<void> | void;
    processingTime?: number;
  }) => void;
  hideSplashScreen: () => void;
}

const NavigationContext = createContext<NavigationContextData | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [splashParams, setSplashParams] = useState<{
    onRouterSuccess?: Href;
    onRouterError?: Href;
    message?: string;
    onProcess?: () => Promise<void> | void;
    processingTime?: number;
  }>({});

  const pushToSplashScreen = (params: {
    onRouterSuccess?: Href;
    onRouterError?: Href;
    message?: string;
    onProcess?: () => Promise<void> | void;
    processingTime?: number;
  }) => {
    setSplashParams({
      ...params,
      onRouterError: params.onRouterError || '/unauthenticated/_error',
    });
    setShowSplash(true);
  };

  const hideSplashScreen = () => {
    setShowSplash(false);
  };

  return (
    <NavigationContext.Provider value={{ pushToSplashScreen, hideSplashScreen }}>
      {children}
      {showSplash && (
        <SplashScreen 
          onRouterSuccess={splashParams.onRouterSuccess}
          onRouterError={splashParams.onRouterError}
          message={splashParams.message || splashPhrases[Math.floor(Math.random() * splashPhrases.length)]}
          onProcess={splashParams.onProcess}
        />
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