import { BASE_URL } from "@/constants/contants.api";
import AuthResponse from "@/types/AuthResponse";
import { FinancialInstitutionData } from "@/types/FinancialInstitutionData";
import FinancialScore, { FinancialScoreEncrypted } from "@/types/FinancialScore";
import HomeScreenAnalysisData from "@/types/HomeScreenAnalysisData";
import { CryptUtil } from "@/utils/CryptoUtil";
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
    considerCreditCard: boolean = true,
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

export async function getFinancialScoreAnalysisFromReferenceDate(
    transactions: FinancialInstitutionData[],
    referenceDate: Date,
    authObject: AuthResponse,   
    considerCreditCard: boolean = true,
    startDate?: Date,
    endDate?: Date
): Promise<FinancialScore | null> {
    const headers = getRequestHeader(authObject);
    const bankAccountIds = extractBankAccountIds(transactions, considerCreditCard);
 
    // Criando a URL base
    let url = `${BASE_URL}/finance/analysis/financial-score`;
    
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
    
    if (response.data.status !== 'success') {
        throw new Error('Failed to get financial score analysis infos.');
    }

    const dataEncrypted: FinancialScoreEncrypted = response.data.data;
    if(!dataEncrypted) {
        console.error('Não foi possível converter os dados de resposta do backend para o objeto.')
        return null;
    }

    console.log(`response: ${JSON.stringify(dataEncrypted)}`)

    // Decrypt the data
    const data: FinancialScore = decryptFinancialScore(dataEncrypted);
    
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

function decryptFinancialScore(scoreEncrypted: FinancialScoreEncrypted): FinancialScore {
    const { period, score, details, percentage, insights } = scoreEncrypted;

    return {
        period: CryptUtil.decrypt(period, secretKey) as string,
        score: Number(CryptUtil.decrypt(score, secretKey)),
        details: CryptUtil.decrypt(details, secretKey) as string,
        percentage: CryptUtil.decrypt(percentage, secretKey) as string,
        daysOfControl: Number(CryptUtil.decrypt(scoreEncrypted.daysOfControl, secretKey)),
        insights: insights.map(i => ({
            title: CryptUtil.decrypt(i.title, secretKey) as string,
            subtitle: CryptUtil.decrypt(i.subtitle, secretKey) as string,
            icon: CryptUtil.decrypt(i.icon, secretKey) as string,
            actionableText: CryptUtil.decrypt(i.actionableText, secretKey) as string,
            actionableLink: CryptUtil.decrypt(i.actionableLink, secretKey) as string,
        }))
    }
}