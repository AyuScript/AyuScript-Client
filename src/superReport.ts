import {currentServerInfo, getPlayerName} from "./player.ts";
import type {WebSocketService} from "./websocket.ts";
import {getString} from "./memory/utils.ts";

type Message = {timestamp: number, color: [number, number, number], message: string};
const keywords = [
  { description: "A Super", keyword: "A Super" },
  { description: "A tower", keyword: "A tower of thorns rises from the sands..." },
  { description: "You hear someone", keyword: "You hear someone whisper faintly...\"just... one more game...\"" },
  { description: "You hear lightning", keyword: "You hear lightning strikes coming from a far distance..." },
  { description: "Something mountain", keyword: "Something mountain-like appears in the distance..." },
  { description: "bright light", keyword: "There's a bright light in the horizon" },
  { description: "A big yellow spot", keyword: "A big yellow spot shows up in the distance..." },
  { description: "A buzzing noise", keyword: "A buzzing noise echoes through the sewer tunnels" },
  { description: "You sense ominous vibrations", keyword: "You sense ominous vibrations coming from a different realm..." }
];

let baseMemory: number | null = null;
function getChatMessage(){
  if (!window.Module.HEAP8 || !baseMemory) {
    return [];
  }
  const messageList:Message[] = [];
  for (let i = 0; i < window.Module.HEAP32[(baseMemory - 8)/4]; i++){
    const var0 = window.Module.HEAP32[(window.Module.HEAP32[((baseMemory+408*i)+12)/4]+8)/4];
    const timestamp = window.Module.HEAPF64[((baseMemory+408*i)+24)/8];
    const message = getString(window.Module.HEAPU8[var0+31]>=128?window.Module.HEAP32[(var0+20)/4]:var0+20);
    const color: [number, number, number] = [window.Module.HEAPU8[(var0+32)], window.Module.HEAPU8[(var0+33)], window.Module.HEAPU8[(var0+34)]];
    messageList.push({timestamp, color, message});
  }
  return messageList;
}

export function superReportInit(webSocketService: WebSocketService) {
  let lastMessages = new Set<string>();

  webSocketService.subscribe('memory', (data: { payload: { chat_array: number; }; }) => {
    baseMemory = data.payload.chat_array;
  })
  setInterval(() => {
    const messages = getChatMessage();
    const newMessages = messages.filter(
      ({timestamp, color, message}) =>
        !lastMessages.has("" + timestamp + color + message)
    );
    newMessages.forEach(message => {
      if (message.color[0] == 43 && message.color[1] == 255 && message.color[2] == 163 &&
        keywords.some(k => message.message.includes(k.description))) {
        webSocketService.sendMessage({
          type: 'report',
          server: currentServerInfo.value,
          message: message.message,
          timestamp: message.timestamp,
          name: getPlayerName()
        });
      }
    });

    lastMessages = new Set(
      messages.map(({timestamp, color, message}) =>
      "" + timestamp + color + message)
    );
  }, 100);
}