export abstract class Encryptor {
  abstract decrypt(data: string): any;
  abstract encrypt(data: any): string;
}