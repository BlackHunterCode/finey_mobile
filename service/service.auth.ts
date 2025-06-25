import AuthChallenge from "@/types/AuthChallenge";
import AuthCredentials from "@/types/AuthCredentials";
import axios from 'axios';
import CryptoJS from 'crypto-js';

const BACKEND_URL = "http://10.0.2.2:8080"
const API_VERSION = "/v1";
const BASE_URL = BACKEND_URL + API_VERSION;
const SECRET_KEY = "BlackHunterDefaultSecret";
const DEVICE_ID = "dev";

export async function login(credentials: AuthCredentials): Promise<string>  {
    try {
    // Obtém o desafio e gera a assinatura
    const { nonce, signature, deviceId } = await getChallenge();
    
    // Prepara o corpo da requisição
    const requestBody = {
      email: credentials.email,
      password: credentials.password
    };

    console.log(`Enviando login para: ${BASE_URL}/public/auth`)
    console.log(`Com body: ${JSON.stringify(requestBody)}`)
    console.log(`Com headers: ${JSON.stringify({
      'Content-Type': 'application/json',
      'X-Device-ID': deviceId,
      'X-APP-Signature': signature,
      'X-Nonce': nonce
    })}`)
    
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
    
    const token = response.data.data;
    console.log('Autenticação bem-sucedida!');
    console.log(`Token JWT: ${token}`);
    
    return token;
  } catch (error: any) {
    console.error('Erro na autenticação:', error.message);
    if (error.response) {
      console.error('Resposta do servidor:', error.response.data);
    }
    throw error;
  }
}

async function getChallenge(): Promise<AuthChallenge> {
  try {
    console.log(`Enviando desafio para: ${BASE_URL}/public/challenge`)
    const response = await axios.get(`${BASE_URL}/public/challenge`);
    
    if (response.data.status !== 'success') {
      throw new Error('Falha ao obter desafio');
    }
    
    const challenge = response.data.data;
    const nonce = challenge.nonce;
    const expiresAt = challenge.expiresAt;
    
    console.log('Desafio obtido com sucesso:');
    console.log(`Nonce: ${nonce}`);
    console.log(`Expira em: ${new Date(expiresAt).toLocaleString()}`);
    
    // Gera a assinatura HMAC
    const signature = generateSignature(nonce, SECRET_KEY);
    
    console.log(`Assinatura gerada: ${signature}`);
    
    return {
      nonce,
      signature,
      expiresAt,
      deviceId: DEVICE_ID
    };
  } catch (error: any) {
    console.error('Erro ao obter desafio:', error.message);
    if (error.response) {
      console.error('Resposta do servidor:', error.response.data);
    }
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