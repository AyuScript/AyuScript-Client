import {Encryptor} from "./encryption.ts";

const encoder = new TextEncoder();

async function getKey(seed: string) {
  const data = encoder.encode(seed);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export default class AesGcmEncryptor extends Encryptor {
  key: string;
  constructor(key: string) {
    super();
    this.key = key;
  }
  async encrypt(payload: any) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getKey(this.key);
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
        tagLength: 128
      },
      key,
      encoder.encode(JSON.stringify(payload))
    );

    const encryptedArray = new Uint8Array(encryptedBuffer);
    const tagPosition = encryptedArray.length - 16;
    const ciphertext = encryptedArray.slice(0, tagPosition);
    const authTag = encryptedArray.slice(tagPosition);

    const uint8ToBase64 = (arr: Uint8Array) => btoa(String.fromCharCode(...arr));
    return JSON.stringify({
      iv: uint8ToBase64(iv),
      ciphertext: uint8ToBase64(ciphertext),
      tag: uint8ToBase64(authTag)
    });
  }

  async decrypt(encryptedStr: string) {
    const packet = JSON.parse(encryptedStr);
    const iv = Uint8Array.from(atob(packet.iv), c => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(atob(packet.ciphertext), c => c.charCodeAt(0));
    const tag = Uint8Array.from(atob(packet.tag), c => c.charCodeAt(0));

    const key = await getKey(this.key);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      new Uint8Array([...ciphertext, ...tag])
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  }
}