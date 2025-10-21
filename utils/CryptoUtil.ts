// utils/CryptUtil.ts

import CryptoJS from 'crypto-js';

export class CryptUtil {
  static encrypt(data: string, secretKey: string): string {
    if (!secretKey) throw new Error('Secret key is required for encryption');

    // Usa exatamente os primeiros 16 bytes
    const key = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16));

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(data), // precisa ser WordArray
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }

  static decrypt(encryptedData: string, secretKey: string | undefined): string {
    if (!secretKey) throw new Error('Secret key is required for decryption');

    const key = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16));

    const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedData);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedWordArray } as any,
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
