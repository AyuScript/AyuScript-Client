export abstract class Encryptor {
  abstract decrypt(data: string): Promise<any>;
  abstract encrypt(data: any): Promise<string>;
}