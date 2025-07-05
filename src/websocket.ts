import {ref, type Ref} from 'vue';
import type {Encryptor} from "./encryption/encryption.ts";
import NoneEncryptor from "./encryption/none.ts";

type Callback = (data: any) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval = 10000;
  private tryReconnect = true;
  private encryptor: Encryptor = new NoneEncryptor();

  public isConnected: Ref<boolean> = ref(false);
  public messages: Ref<any[]> = ref([]);

  private subscriptions: Map<string, Callback[]> = new Map();
  private closeSubscriptions: ((code: number, reason: string) => void)[] = [];
  private openSubscriptions: (() => void)[] = [];

  constructor(url: string) {
    this.url = url;
  }

  public setUrl(url: string) {
    this.url = url;
    this.connect();
  }

  public applyEncryptor(encryptor: Encryptor) {
    this.encryptor = encryptor;
  }

  public connect() {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.isConnected.value = true;
      this.openSubscriptions.forEach((callback) => callback());
    }

    this.ws.onclose = (event) => {
      this.isConnected.value = false;
      if (event.code >= 4500 && event.code <= 4999) {
        this.tryReconnect = false;
      }
      this.closeSubscriptions.forEach((callback) =>
        callback(event.code, event.reason)
      );
      if (this.tryReconnect) {
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    }

    this.ws.onmessage = async (event) => {
      try {
        const decrypted = this.encryptor.decrypt(event.data);
        this.messages.value.push(decrypted);
        const subscribers = this.subscriptions.get(decrypted.type);
        if (subscribers) {
          subscribers.forEach((cb) => cb(decrypted));
        }
      } catch (e) {
        // Wrong type of encryption
        console.error("Could not decrypt message from server. Check if the type of encryption is correct?");
      }
    }
  }

  public async sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const encryptedMessage = this.encryptor.encrypt(message);
      this.ws.send(encryptedMessage);
    } else {
      console.error('WebSocket is not open')
    }
  }

  public subscribe(type: string, callback: Callback) {
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, []);
    }
    this.subscriptions.get(type)?.push(callback);
  }

  public unsubscribe(type: string, callback: Callback) {
    const subs = this.subscriptions.get(type);
    if (subs) {
      this.subscriptions.set(type, subs.filter((cb) => cb !== callback));
    }
  }

  public subscribeClose(callback: (code: number, reason: string) => void) {
    this.closeSubscriptions.push(callback);
  }

  public unsubscribeClose(callback: (code: number, reason: string) => void) {
    this.closeSubscriptions = this.closeSubscriptions.filter((cb) => cb !== callback);
  }

  public subscribeOpen(callback: () => void) {
    this.openSubscriptions.push(callback);
  }

  public unsubscribeOpen(callback: () => void) {
    this.openSubscriptions = this.openSubscriptions.filter((cb) => cb !== callback);
  }
}
