import { BASE_URL } from "@/constants/contants.api";
import AuthResponse from "@/types/AuthResponse";
import { CryptUtil } from "@/utils/CryptoUtil";
import { PluggyConnector } from "@/webview/financial-integrations/PluggyWebView";
import axios from 'axios';
import Constants from 'expo-constants';
import { getRequestHeader, isUserAuthenticated } from "./service.auth";

const secretKey: string | undefined = Constants.expoConfig?.extra?.PLUGGY_CRYPT_SECRET;

export async function savePluggyItemId(
  authObject: AuthResponse | null, 
  itemId: string,
  connector: PluggyConnector | null
): Promise<void> {
  if (!(await isUserAuthenticated())) {
    throw new Error('Usuário não autenticado');
  }  

  if (!secretKey) {
    throw new Error('Chave de criptografia não configurada. Verifique as variáveis de ambiente.');
  }

  try {
    if(!connector) {
      throw new Error('Ocorreu um problema inesperado ao pegar o connector.');
    }

    if(!connector.id) {
      throw new Error('Ocorreu um problema inesperado ao pegar o id de conexão.');
    }

    let itemIdEncrypted = CryptUtil.encrypt(itemId, secretKey);
    let connectorIdEncrypted = CryptUtil.encrypt(connector.id.toString(), secretKey);
    let imageUrlEncrypted = CryptUtil.encrypt(connector.imageUrl, secretKey);
    let nameEncrypted = CryptUtil.encrypt(connector.name, secretKey);
    const headers = getRequestHeader(authObject);
    await axios.post(
      `${BASE_URL}/integrations/financial-integrator/pluggy/save-item-id`, 
      { 
        itemId: itemIdEncrypted,
        connectorId: connectorIdEncrypted,
        imageUrl: imageUrlEncrypted,
        name: nameEncrypted
      }, 
      { headers }
    );
  } catch (error: any) {
    if(error.request && error.request.response) {
      throw new Error(error.request.response);
    } else {
      throw error;
    }
  }
}