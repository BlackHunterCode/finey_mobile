/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Provedor e Contexto do autenticador do aplicativo.
 * 
 * É ESTRITAMENTE PROIBIDO ALTERAR ESTE ARQUIVO SEM AUTORIZAÇÃO PRÉVIA DE UM CODEOWNER.
 */

import { login } from '@/service/service.auth';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextData = {
  authToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

const AUTH_TOKEN = "authToken";

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      // apenas para desenvolvimento
      await SecureStore.deleteItemAsync(AUTH_TOKEN); 
    
      const storedAuthToken = await SecureStore.getItemAsync(AUTH_TOKEN);
      if (storedAuthToken) {
        setAuthToken(storedAuthToken);
      }
      setLoading(false);
    }
    
    loadUser();
  }, []);

  async function signIn(email: string, password: string) {
    const token: string = await login({email, password});
    await SecureStore.setItemAsync(AUTH_TOKEN, token);
    setAuthToken(token);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(AUTH_TOKEN);
    setAuthToken(null);
  }

  async function signUp(email: string, password: string) {
    // Registration logic
    await SecureStore.setItemAsync(AUTH_TOKEN, email);
    setAuthToken(email);
  }

  const value = {
    authToken,
    loading,
    signIn,
    signOut,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}