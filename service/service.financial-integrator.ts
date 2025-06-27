import { BASE_URL } from "@/constants/contants.api";
import AuthResponse from "@/types/AuthResponse";
import FinIntegratorConToken from "@/types/FinIntegratorConToken";
import { CryptUtil } from "@/utils/CryptoUtil";
import getFinancialIntegratorWebView from "@/webview/financial-integrations/FinancialIntegratorWebViewManager";
import axios from 'axios';
import Constants from 'expo-constants';
import { JSX } from "react";
import { getRequestHeader, isUserAuthenticated } from "./service.auth";

const secretKey: string | undefined = Constants.expoConfig?.extra?.PLUGGY_CRYPT_SECRET;
if (!secretKey) {
  // SECRET_KEY_AES is not defined in the environment variables
}

interface ConnectTokenAPI {
    readonly message: string;
    readonly dataAccess: string;
    readonly platform: string;
    readonly expiredAt: string;
}

interface ConnectToBankParams {
  authObject: AuthResponse | null;
  onSuccess: (itemId: string) => void;
  onError?: (error: any) => void;
};

interface ConnectTokenResponse {
  connectToken: string;
  dataAccess: string;
  platform: string;
  expiredAt: Date;
  message?: string;
  status?: string;
}

export async function getConnectToken(authObject: AuthResponse | null): Promise<ConnectTokenResponse | null> {
    if (!(await isUserAuthenticated())) {
        return null;
    }
    
    try {
        const headers = getRequestHeader(authObject);
        const response = await axios.post(
            `${BASE_URL}/integrations/financial-integrator/connect`, 
            {},
            { headers }
        );
        
        if (response.data.status !== 'success') {
            throw new Error('Failed to get connect token');
        }

        const responseData = response.data as { status: string; data: ConnectTokenAPI; message?: string };
        const connectTokenData = responseData.data;
        return {
            connectToken: connectTokenData.dataAccess,
            dataAccess: connectTokenData.dataAccess,
            platform: connectTokenData.platform,
            expiredAt: new Date(connectTokenData.expiredAt),
            message: connectTokenData.message,
            status: 'success'
        };
    } catch (error) {
        throw error;
    }
}

// In service.financial-integrator.ts
export async function connectToBank({
  authObject,
  onSuccess,
  onError,
}: ConnectToBankParams): Promise<JSX.Element | null> {
  try {
    const data = await getConnectToken(authObject);
    if (!data) {
      throw new Error('No data received from getConnectToken');
    }
    
    const connectToken = data.dataAccess;
    const platform = data.platform;
    
    if (!connectToken) {
      throw new Error('No connect token available');
    }


    
    if (!secretKey) {
      throw new Error('Chave de criptografia não configurada. Verifique as variáveis de ambiente.');
    }

    // Decrypt the token received from the API
    let decryptedToken: string;
    try {
      decryptedToken = CryptUtil.decrypt(connectToken, secretKey);
      // Token decrypted successfully
    } catch (error) {
      // Failed to decrypt token
      throw new Error('Falha ao descriptografar o token de conexão');
    }

    const financialIntegratorWebView = getFinancialIntegratorWebView(platform);
    

    
    return financialIntegratorWebView.connect({
    connectToken: decryptedToken,
    onSuccess: (itemId: string) => {
      onSuccess(itemId);
    },
    onError: (error: any) => {
      onError?.(error);
    },
  });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    onError?.(errorMessage);
    return null;
  }
}