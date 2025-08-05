import {Encryptor} from "./encryption.ts";

export default class NoneEncryptor extends Encryptor{
  async decrypt(data: Uint8Array) {
    return data;
  }

  async encrypt(data: Uint8Array) {
    return data;
  }
}