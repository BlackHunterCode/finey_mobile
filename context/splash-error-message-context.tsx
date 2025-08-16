import React, { createContext, useContext, useState } from 'react';

interface SplashErrorMessageContextData {
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

const SplashErrorMessageContext = createContext<SplashErrorMessageContextData | undefined>(undefined);

export function SplashErrorMessageProvider({ children }: { children: React.ReactNode }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  return (
    <SplashErrorMessageContext.Provider value={{ errorMessage, setErrorMessage }}>
      {children}
    </SplashErrorMessageContext.Provider>
  );
}

export function useSplashErrorMessage() {
  const context = useContext(SplashErrorMessageContext);
  if (!context) {
    throw new Error('useSplashErrorMessage deve ser usado dentro de SplashErrorMessageProvider');
  }
  return context;
}
