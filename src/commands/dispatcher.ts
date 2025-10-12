import {CommandDispatcher} from "@jsprismarine/brigadier";
import {writeString} from "@/memory/utils.ts";
import {canvasTextWidth} from "@/gameChat/gameChatUtility.ts";

class CommandManager {
  private commands: Map<string, {
    name: string,
    description: string,
    ptr: number
  }>;
  constructor() {
    this.commands = new Map();
  }
  registerCommand(name: string, description: string) {
    if (window.electron) {
      (async () => {
        // return;
        while (!window.Module?.HEAPU8) {
          await new Promise(r => setTimeout(r, 50));
        }

        const ptr = window.Module._malloc(68);
        const desPtr = window.Module._malloc(name.length + description.length + 2);
        const desPtr2 = window.Module._malloc(name.length + description.length + 5);

        window.Module.HEAPU32[ptr / 4] = desPtr;
        window.Module.HEAPU32[(ptr + 4) / 4] = 4;
        window.Module.HEAPU32[(ptr + 8) / 4] = 0;
        window.Module.HEAPF32[(ptr + 12) / 4] = canvasTextWidth(`/${name} - ${description}`);
        window.Module.HEAPU32[(ptr + 16) / 4] = 1;
        window.Module.HEAPU32[(ptr + 20) / 4] = 0;
        window.Module.HEAPU32[(ptr + 24) / 4] = 0;
        window.Module.HEAPU32[(ptr + 28) / 4] = 0;
        window.Module.HEAPU32[(ptr + 32) / 4] = desPtr2;
        window.Module.HEAPU32[(ptr + 36) / 4] = name.length + description.length + 5;
        window.Module.HEAPU32[(ptr + 40) / 4] = 2147483728;
        window.Module.HEAPU32[(ptr + 44) / 4] = 0x00f3c4a3; // color
        window.Module.HEAPU32[(ptr + 48) / 4] = 0;
        window.Module.HEAPU32[(ptr + 52) / 4] = 1039516303;

        window.Module.HEAPF32[(ptr + 56) / 4] = 14.00;

        window.Module.HEAPU32[(ptr + 60) / 4] = 264;
        window.Module.HEAPU32[(ptr + 64) / 4] = 0;
        writeString(name, desPtr);
        writeString(description, desPtr + name.length + 1);
        writeString(`/${name} - ${description}`, desPtr2);

        this.commands.set(name, { name, description, ptr });
      })()
    } else {
      this.commands.set(name, {ptr: 0, name, description});
    }
  }
  getAllCommands() {
    return this.commands;
  }
}

export const commandManager = new CommandManager();

export const dispatcher = new CommandDispatcher();


if (window.electron) {
  (async () => {
    while (!window.Module?.HEAPU8) {
      await new Promise(r => setTimeout(r, 50));
    }

    let firstPtr = 0;
    window.Module.asm.registerHookPre(440);

    window.ayuHooks.pre_79 = (arg0: number, arg1: number) => {
      if (!firstPtr) {
        firstPtr = arg1;
      }
      if (arg1 == firstPtr) {
        for (const [, { ptr }] of commandManager.getAllCommands()) {
          window.Module.asm[79]?.(arg0, ptr);
        }
      }
    };
  })();
}


document.addEventListener("keydown", async (e) => {
  if (e.key !== "Enter") {
    return;
  }

  const target = e.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return;
  }

  if (!target.classList.contains("textInput")) {
    return;
  }

  const value = target.value.trim();
  if (!value.startsWith("/")) {
    return;
  }

  if (dispatcher.parse(value.slice(1), null)) {
    const result = await (dispatcher.execute(dispatcher.parse(value.slice(1), null))[0]);
    if (typeof result === 'string') {
      target.value = result;
    } else {
      target.value = '';
    }
  }
}, true);