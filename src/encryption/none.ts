import {Encryptor} from "./encryption.ts";

export default class NoneEncryptor extends Encryptor{
  async decrypt(data: string) {
    return JSON.parse(data);
  }

  async encrypt(data: any) {
    return JSON.stringify(data);
  }
}