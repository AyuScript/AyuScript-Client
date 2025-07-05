import {ref} from "vue";

interface Banner {
  id: string
  text: string
  slot: number
  duration: number
}

export const notices = ref<Banner[]>([]);

const timeouts: Record<string, ReturnType<typeof setTimeout>> = {};

export function notice(text: string, duration: number = 5000) {
  if (notices.value.find(b => b.text === text)) return;

  const id = crypto.randomUUID();
  const slot = findAvailableSlot(notices.value);

  notices.value.push({id, text, slot, duration});

  timeouts[id] = setTimeout(() => {
    const index = notices.value.findIndex(b => b.id === id);
    if (index !== -1) notices.value.splice(index, 1);
    delete timeouts[id];
  }, duration + 1000);
}

function findAvailableSlot(banners: Banner[]) {
  const used = new Set(banners.map(b => b.slot));
  let slot = 0;
  while (used.has(slot)) slot++;
  return slot;
}
