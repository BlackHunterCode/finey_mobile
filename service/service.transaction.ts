import { BASE_URL } from "@/constants/contants.api";
import AuthResponse from "@/types/AuthResponse";
import { FinancialInstitutionData } from "@/types/FinancialInstitutionData";
import TotalTransactionPeriod from "@/types/TotalTransactionPeriod";
import axios from "axios";
import { getRequestHeader } from "./service.auth";

export async function loadTotalTransactionPeriod(
    transactions: FinancialInstitutionData[],
    referenceDate: Date,
    authObject: AuthResponse,
    considerCreditCard: boolean = false,
    startDate?: Date,
    endDate?: Date
): Promise<TotalTransactionPeriod | undefined> {
    const headers = getRequestHeader(authObject);
    const bankAccountIds = extractBankAccountIds(transactions, considerCreditCard);
 
    // Criando a URL base
    let url = `${BASE_URL}/finance/transactions/total-period`;
    
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
    
    console.log('Body:', requestBody);
    const response = await axios.post(url, requestBody, { headers });

    if (response.data.status !== 'success') {
        throw new Error('Failed to get total transactions period infos.');
    }

    const data: TotalTransactionPeriod = response.data.data;
    if(!data) {
        console.error('Não foi possível converter os dados de resposta do backend para o objeto.')
        return undefined;
    }

    console.log(data)
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