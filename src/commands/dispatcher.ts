import {CommandDispatcher} from "@jsprismarine/brigadier";

export const dispatcher = new CommandDispatcher();

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