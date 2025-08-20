import {CommandDispatcher} from "@jsprismarine/brigadier";

export const dispatcher = new CommandDispatcher();

document.addEventListener("keydown", (e) => {
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
  console.log(value);
  if (!value.startsWith("/")) {
    return;
  }

  if (dispatcher.parse(value.slice(1), null)) {
    dispatcher.execute(dispatcher.parse(value.slice(1), null));
    target.value = "";
  }
}, true);