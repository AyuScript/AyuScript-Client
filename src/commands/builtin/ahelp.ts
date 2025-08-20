import {dispatcher} from "@/commands/dispatcher.ts";
import {literal} from "@jsprismarine/brigadier";
import {addChatMessage} from "@/gameChat/gameChatUtility.ts";

dispatcher.register(
  literal('ahelp').executes(
    async () => {
      addChatMessage([
        {
          text: '------- AyuScript Help -------',
          r: 163,
          g: 196,
          b: 243
        }
      ]);
      addChatMessage([
        {
          text: '/ahelp - Show this help message',
          r: 163,
          g: 196,
          b: 243
        }
      ]);
    }
  )
)