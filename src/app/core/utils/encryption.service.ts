import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private secretKey = 'your-secret-key'; // Replace with your own key

  constructor() {}

  /**
   * Encrypts the data using AES encryption
   * @param data - The data to encrypt (can be string or object)
   * @returns Encrypted string
   */
  encrypt(data: any): string {
    const jsonData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonData, this.secretKey).toString();
  }

  /**
   * Decrypts the encrypted data
   * @param encryptedData - The encrypted string
   * @returns Decrypted data
   */
  decrypt(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }

  SaveItem(key: string, value: any) {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      'secret-key'
    ).toString();
    sessionStorage.setItem(key, encryptedData);
  }

  GetItem(key: string) {
    const item = sessionStorage.getItem(key);
    if (item) {
      const decryptedData = CryptoJS.AES.decrypt(item, 'secret-key').toString(
        CryptoJS.enc.Utf8
      );
      return JSON.parse(decryptedData);
    }
    return null;
  }
}
