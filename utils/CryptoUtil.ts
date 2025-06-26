// utils/CryptUtil.ts

import CryptoJS from 'crypto-js';

export class CryptUtil {
  /**
   * Criptografa uma string usando AES.
   *
   * @param data - Texto a ser criptografado
   * @param secretKey - Chave secreta (precisa ter exatamente 16, 24 ou 32 caracteres)
   * @returns Texto criptografado em Base64
   */
  static encrypt(data: string, secretKey: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString(); // retorna em Base64
  }

  /**
   * Descriptografa uma string AES em Base64.
   *
   * @param encryptedData - Texto criptografado em Base64
   * @param secretKey - Mesma chave usada para criptografar
   * @returns Texto descriptografado
   */
  static decrypt(encryptedData: string, secretKey: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
