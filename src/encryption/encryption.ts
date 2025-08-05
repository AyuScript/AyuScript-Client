export abstract class Encryptor {
  abstract decrypt(data: Uint8Array): Promise<Uint8Array>;
  abstract encrypt(data: Uint8Array): Promise<Uint8Array>;
}