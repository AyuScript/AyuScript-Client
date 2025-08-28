import {dispatcher} from "@/commands/dispatcher.ts";
import {literal} from "@jsprismarine/brigadier";
import {addChatMessage} from "@/gameChat/gameChatUtility.ts";

dispatcher.register(
  literal('aaccept').executes(
    async () => {
      addChatMessage([
        {
          text: 'Joining squad 3v7f7v',
          r: 163,
          g: 196,
          b: 243
        }
      ]);
      return '/squad-join 3v7f7v';
    }
  )
)