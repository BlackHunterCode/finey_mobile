import { BASE_URL, SECRET_KEY } from "@/constants/contants.api";
import AuthChallenge from "@/types/AuthChallenge";
import AuthCredentials from "@/types/AuthCredentials";
import AuthResponse from "@/types/AuthResponse";
import axios from 'axios';
import { decode as atob } from 'base-64';
import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';

if (!global.atob) {
  global.atob = atob;
}

const DEVICE_ID = "dev";
const AUTH_OBJECT_KEY = "authObject";

export async function login(credentials: AuthCredentials): Promise<AuthResponse>  {
    try {
    // Obtém o desafio e gera a assinatura
    const { nonce, signature, deviceId } = await getChallenge();
    
    // Prepara o corpo da requisição
    const requestBody = {
      email: credentials.email,
      password: credentials.password
    };


    // Realiza a requisição de autenticação
    const response = await axios.post(
      `${BASE_URL}/public/auth`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId,
          'X-APP-Signature': signature,
          'X-Nonce': nonce
        }
      }
    );
    

    if (response.data.status !== 'success') {
      throw new Error('Falha na autenticação');
    }

    const authToken = response.data.data;
    return {
      nonce, signature, deviceId, authToken
    };
  } catch (error: any) {
    // Authentication error
    throw error;
  }
}

export async function getAuthObjectStore(): Promise<AuthResponse | null> {
  try {
    const authJson = await SecureStore.getItemAsync(AUTH_OBJECT_KEY);
    return authJson ? JSON.parse(authJson) : null;
  } catch (error) {
    console.error('Erro ao recuperar authObject:', error);
    return null;
  }
}

export async function saveAuthObjectStore(object: AuthResponse) {
  try {
    await SecureStore.setItem(AUTH_OBJECT_KEY, JSON.stringify(object));
  } catch (error) {
    console.error('Erro ao salvar authObject:', error);
  }
}

export async function deleteAuthObjectStore() {
  try {
    await SecureStore.deleteItemAsync(AUTH_OBJECT_KEY);
  } catch (error) {
    console.error('Erro ao remover authObject:', error);
  }
}

export function getRequestHeader(authObject: AuthResponse | null) {
  return {
      'Content-Type': 'application/json',
      'X-Device-ID': authObject?.deviceId,
      'X-APP-Signature': authObject?.signature,
      'X-Nonce': authObject?.nonce,
      'Authorization': `Bearer ${authObject?.authToken}` 
  }
}

export async function isUserAuthenticated(): Promise<boolean> {
  const authData = await getAuthObjectStore();
  return authData != null && isAuthTokenNotExpired(authData.authToken); 
}

function isAuthTokenNotExpired(token: string): boolean {
    try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    if (!payload.exp) return false;

    const now = Math.floor(Date.now() / 1000); // tempo atual em segundos
    return payload.exp > now;
  } catch (error) {
    // Error checking token
    return false;
  }
}

async function getChallenge(): Promise<AuthChallenge> {
  try {
    const response = await axios.get(`${BASE_URL}/public/challenge`, {timeout: 10000});
    
    if (response.data.status !== 'success') {
      throw new Error('Falha ao obter desafio');
    }
    
    const challenge = response.data.data;
    const nonce = challenge.nonce;
    const expiresAt = challenge.expiresAt;
    
    // Gera a assinatura HMAC
    const signature = generateSignature(nonce, SECRET_KEY);
    
    return {
      nonce,
      signature,
      expiresAt,
      deviceId: DEVICE_ID
    };
  } catch (error: any) {
    // Error getting challenge
    throw error;
  }
}

/**
 * Gera uma assinatura HMAC-SHA256 usando o nonce e a chave secreta
 * @param {string} nonce - O nonce obtido do desafio
 * @param {string} secretKey - A chave secreta para assinar
 * @returns {string} - A assinatura em formato Base64
 */
function generateSignature(nonce: string, secretKey: string): string {
  const hash = CryptoJS.HmacSHA256(nonce, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
}