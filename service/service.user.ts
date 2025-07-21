import { BASE_URL } from "@/constants/contants.api";
import AuthResponse from "@/types/AuthResponse";
import UserInfo from "@/types/UserInfo";
import axios from "axios";
import { getRequestHeader, isUserAuthenticated } from "./service.auth";

export async function getUserInfo(authObject: AuthResponse | null): Promise<UserInfo | null> {
    if (!(await isUserAuthenticated())) {
        return null;
    }
    
    try {
        const headers = getRequestHeader(authObject);
        const response = await axios.get(
            `${BASE_URL}/user/info`, 
            { headers }
        );

        if (response.data.status !== 'success') {
            throw new Error('Failed to get user infos.');
        }
        return response.data.data as UserInfo;
    } catch(err: any) {
        throw err;
    }
}