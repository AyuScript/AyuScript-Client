import {Encryptor} from "./encryption.ts";

export default class XorEncryptor extends Encryptor{
  private key: Uint8Array;
  constructor(key: Uint8Array) {
    super();
    this.key = key;
  }
  async decrypt(data: Uint8Array) {
    return data.map((byte, index) => byte ^ this.key[index % this.key.length]);
  }

  async encrypt(data: Uint8Array) {
    return data.map((byte, index) => byte ^ this.key[index % this.key.length]);
  }
}