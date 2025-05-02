import Constants from 'expo-constants';

const lanHost: string | undefined = Constants.expoConfig?.extra?.LAN_HOST;

let host = "http://10.0.2.2:8080"  // localhost - default
if (lanHost) {
    host = `https://${lanHost}` // LAN host
}

export const BACKEND_URL = host;
export const API_VERSION = "/v1";
export const BASE_URL = BACKEND_URL + API_VERSION;
export const SECRET_KEY = "BlackHunterDefaultSecret";