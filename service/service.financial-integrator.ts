import { BASE_URL } from "@/constants/contants.api";
import AuthResponse from "@/types/AuthResponse";
import FinIntegratorConToken from "@/types/FinIntegratorConToken";
import axios from 'axios';
import { getRequestHeader, isUserAuthenticated } from "./service.auth";

interface ConnectTokenAPI {
    readonly message: string;
    readonly dataAccess: string;
    readonly platform: string;
    readonly expiredAt: string;
}

export async function getConnectToken(authObject: AuthResponse | null): Promise<FinIntegratorConToken | undefined> {
    if(await isUserAuthenticated()) {
        try {
            const headers = getRequestHeader(authObject);
            console.log(`Headers: ${JSON.stringify(headers)}`);
            const response = await axios.post(
              `${BASE_URL}/integrations/financial-integrator/connect`, 
              {}, // Empty request body
              { headers } // Pass headers in the config object
            );
            if(response.data.status !== 'success') {
                throw new Error('Falha na obtenção do connect token.');
            }

            const connectTokenData: ConnectTokenAPI = response.data.data;
            const res = {
                message: connectTokenData.message,
                dataAccess: connectTokenData.dataAccess,
                platform: connectTokenData.platform,
                expiredAt: new Date(connectTokenData.expiredAt)
            };
            console.log(res);
            return res; 
        } catch(error: any) {
            console.error('Erro ao obter desafio:', error.message);
            if (error.response) {
                console.error('Resposta do servidor:', error.response.data);
            }
            throw error;
        }
    } else {
        // redirecionar o usuário com uma mensagem dizendo que a sessão dele expirou
    }
}