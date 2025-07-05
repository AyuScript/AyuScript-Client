// warnBanner.ts
import {reactive} from 'vue';

interface Banner {
  id: string
  text: string
  slot: number
  duration: number
}

export const banners = reactive<Banner[]>([]);

const timeouts: Record<string, ReturnType<typeof setTimeout>> = {};

export function showWarnBanner(text: string, duration: number) {
  if (banners.find(b => b.text === text)) return;

  const id = crypto.randomUUID();
  const slot = findAvailableSlot(banners);

  banners.push({id, text, slot, duration});

  timeouts[id] = setTimeout(() => {
    const index = banners.findIndex(b => b.id === id);
    if (index !== -1) banners.splice(index, 1);
    delete timeouts[id];
  }, duration + 1000);
}

function findAvailableSlot(banners: Banner[]) {
  const used = new Set(banners.map(b => b.slot));
  let slot = 0;
  while (used.has(slot)) slot++;
  return slot;
}
