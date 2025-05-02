import { BASE_URL } from "@/constants/contants.api";
import AuthResponse from "@/types/AuthResponse";
import { FinancialInstitutionData } from "@/types/FinancialInstitutionData";
import HomeScreenAnalysisData from "@/types/HomeScreenAnalysisData";
import axios from 'axios';
import Constants from 'expo-constants';
import { getRequestHeader } from "./service.auth";

const secretKey: string | undefined = Constants.expoConfig?.extra?.PLUGGY_CRYPT_SECRET;
if (!secretKey) {
  // SECRET_KEY_AES is not defined in the environment variables
}

export async function getHomeScreenAnalysisFromReferenceDate(
    transactions: FinancialInstitutionData[],
    referenceDate: Date,
    authObject: AuthResponse,
    considerCreditCard: boolean = false,
    startDate?: Date,
    endDate?: Date
): Promise<HomeScreenAnalysisData | null> {
     const headers = getRequestHeader(authObject);
    const bankAccountIds = extractBankAccountIds(transactions, considerCreditCard);
 
    // Criando a URL base
    let url = `${BASE_URL}/screens-mobile/home/analysis`;
    
    console.log('Enviando requisição POST para:', url);
    const formattedDate = referenceDate.toISOString().split('T')[0];
    
    const requestBody: any = { 
        bankAccountIds,
        referenceDateMonthYear: formattedDate
    };
    
    // Adiciona startDate e endDate se fornecidos (para período personalizado)
    if (startDate && endDate) {
        requestBody.startDate = startDate.toISOString().split('T')[0];
        requestBody.endDate = endDate.toISOString().split('T')[0];
    }
    
    const response = await axios.post(url, requestBody, { headers });
    console.log(`resposta crua: ${JSON.stringify(response.data)}`)

    if (response.data.status !== 'success') {
        throw new Error('Failed to get home screen analysis infos.');
    }

    const data: HomeScreenAnalysisData = response.data.data;
    if(!data) {
        console.error('Não foi possível converter os dados de resposta do backend para o objeto.')
        return null;
    }

    console.log(`response: ${JSON.stringify(data)}`)

    return data;
}


/* Métodos privados */
function extractBankAccountIds(transactions: FinancialInstitutionData[], considerCreditCard: boolean = false): string[] {
    return transactions.flatMap(t => {
        if (!Array.isArray(t.accounts)) {
            console.error('accounts não é um array!', t.accounts);
            return [];
        }
        return t.accounts
            .filter(pa => considerCreditCard || pa.type === 'BANK')
            .map(pa => pa.accountId)
            .filter(id => id)
    });
}