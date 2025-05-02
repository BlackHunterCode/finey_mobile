export default interface AuthChallenge {
    readonly nonce: string;
    readonly signature: string;
    readonly expiresAt: number; 
    readonly deviceId: string;
}