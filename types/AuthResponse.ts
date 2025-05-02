export default interface AuthResponse {
    readonly nonce: string;
    readonly signature: string;
    readonly deviceId: string;
    readonly authToken: string;
}