const gameWSSPatterns = [
  /^wss:\/\/[a-zA-Z0-9]+\.s\.m28n\.net(:443)?$/
];
let wsURL:string;
export function getWsURL(){
  return wsURL;
}
const nativeWebSocket = WebSocket;
export function patchWebsocket(){
  window.WebSocket = function(...args: ConstructorParameters<typeof WebSocket>) {
    const url = args[0] as string;
    const isGameServer = gameWSSPatterns.some(pattern => pattern.test(url));

    if (isGameServer) {
      const socket = new nativeWebSocket(...args);
      wsURL = socket.url;
      return socket;
    } else {
      const socket = new nativeWebSocket(...args);
      wsURL = socket.url;
      return socket;
    }
  } as unknown as typeof window.WebSocket;
  // @ts-ignore
  window.WebSocket.CONNECTING = 0;
  // @ts-ignore
  window.WebSocket.OPEN = 1;
  // @ts-ignore
  window.WebSocket.CLOSING = 2;
  // @ts-ignore
  window.WebSocket.CLOSED = 3;
}
