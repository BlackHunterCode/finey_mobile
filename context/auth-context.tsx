/**
 * © 2025 Black Hunter - Todos os Direitos Reservados.
 * 
 * Provedor e Contexto do autenticador do aplicativo.
 * 
 * É ESTRITAMENTE PROIBIDO ALTERAR ESTE ARQUIVO SEM AUTORIZAÇÃO PRÉVIA DE UM CODEOWNER.
 */

import { deleteAuthObjectStore, getAuthObjectStore, login, saveAuthObjectStore } from '@/service/service.auth';
import AuthResponse from '@/types/AuthResponse';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextData = {
  authObject: AuthResponse | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authObject, setAuthObject] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      // apenas para desenvolvimento
     await deleteAuthObjectStore();
    
      const storedAuthToken = await getAuthObjectStore();
      if (storedAuthToken) {
        setAuthObject(storedAuthToken);
      }
      setLoading(false);
    }
    
    loadUser();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const authResponse: AuthResponse = await login({email, password});
      await saveAuthObjectStore(authResponse);
      setAuthObject(authResponse);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    await deleteAuthObjectStore();
    setAuthObject(null);
  }


  const value = {
    authObject,
    loading,
    signIn,
    signOut
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