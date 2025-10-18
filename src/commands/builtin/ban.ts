import {commandManager, dispatcher} from "@/commands/dispatcher.ts";
import {literal} from "@jsprismarine/brigadier";
import {addChatMessage} from "@/gameChat/gameChatUtility.ts";

dispatcher.register(
  literal('ban').executes(
    async () => {
      addChatMessage([
        {
          text: 'Banned',
          r: 163,
          g: 196,
          b: 243
        }
      ]);
    }
  )
);

commandManager.registerCommand('ban', 'Ban someone in chat');