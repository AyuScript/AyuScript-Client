import {Encryptor} from "./encryption.ts";

export default class NoneEncryptor extends Encryptor{
  decrypt(data: string): any {
    return JSON.parse(data);
  }

  encrypt(data: any): string {
    return JSON.stringify(data);
  }
}