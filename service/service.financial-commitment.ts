import { BASE_URL } from "@/constants/contants.api";
import AuthResponse from "@/types/AuthResponse";
import FinancialCommitment, { FinancialCommitmentEncrypted } from "@/types/FinancialCommitment";
import { CryptUtil } from "@/utils/CryptoUtil";
import axios from 'axios';
import Constants from 'expo-constants';
import { getRequestHeader } from "./service.auth";

const secretKey: string | undefined = Constants.expoConfig?.extra?.PLUGGY_CRYPT_SECRET;
if (!secretKey) {
  // SECRET_KEY_AES is not defined in the environment variables
}

export async function getAllFinancialCommitments(authObject: AuthResponse | null): Promise<FinancialCommitment[]> {
  return await listAllFinancialCommitmentsByEndpoint(authObject, 'list-all');
}

export async function getAllUpCommingFinancialCommitments(authObject: AuthResponse | null): Promise<FinancialCommitment[]> {
  return await listAllFinancialCommitmentsByEndpoint(authObject, 'list-up-coming');
}

async function listAllFinancialCommitmentsByEndpoint(authObject: AuthResponse | null, endpoint: string): Promise<FinancialCommitment[]> {
  try {
    const response = await axios.get(`${BASE_URL}/finance/financial-commitment/${endpoint}`, {
      headers: getRequestHeader(authObject),
      timeout: 10000
    });
    
    if (response.data.status !== 'success') {
      throw new Error(`Falha ao obter compromisso financeiro pelo endpoint ${endpoint}`);
    }
    
    const financialCommitmentEncrypted: FinancialCommitmentEncrypted[] = response.data.data;
    const financialCommitments: FinancialCommitment[] = financialCommitmentEncrypted.map(decryptFinancialCommitment);
    
    return financialCommitments;
  } catch (error: any) {
    // Error getting financial commitment
    throw error;
  }
}

function decryptFinancialCommitment(financialCommitmentEncrypted: FinancialCommitmentEncrypted): FinancialCommitment {
  return {
    id: financialCommitmentEncrypted.id,
    name: CryptUtil.decrypt(financialCommitmentEncrypted.nameEncrypted, secretKey),
    description: CryptUtil.decrypt(financialCommitmentEncrypted.descriptionEncrypted, secretKey),
    type: CryptUtil.decrypt(financialCommitmentEncrypted.typeEncrypted, secretKey),
    cronExpression: CryptUtil.decrypt(financialCommitmentEncrypted.cronExpressionEncrypted, secretKey),
    value: Number(CryptUtil.decrypt(financialCommitmentEncrypted.valueEncrypted, secretKey)),
  };
}