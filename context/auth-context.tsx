/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Provedor e Contexto do autenticador do aplicativo.
 * 
 * É ESTRITAMENTE PROIBIDO ALTERAR ESTE ARQUIVO SEM AUTORIZAÇÃO PRÉVIA DE UM CODEOWNER.
 */

import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextData = {
  user: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      // apenas para desenvolvimento
      await SecureStore.deleteItemAsync('user'); 
    
      const storedUser = await SecureStore.getItemAsync('user');
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    }
    
    loadUser();
  }, []);

  async function signIn(email: string, password: string) {
    // Here you would implement real authentication logic
    await SecureStore.setItemAsync('user', email);
    setUser(email);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  }

  async function signUp(email: string, password: string) {
    // Registration logic
    await SecureStore.setItemAsync('user', email);
    setUser(email);
  }

  const value = {
    user,
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