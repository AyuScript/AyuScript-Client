import type {Petal, Utils} from "./florr";
import {ref} from "vue";

export type Summary = Partial<Record<number, number>>;
export type Detail = Partial<Record<number, Record<string, number>>>;
let florrioUtils!: Utils;
let petals!: Petal[];
let petalSids!: number[];
new Promise(async resolve => {
  while (!(florrioUtils = window.florrio?.utils)) {
    await new Promise(r => setTimeout(r, 100));
  }
  petals = florrioUtils.getPetals();
  petalSids = petals.map(p => p.id);
  resolve(null);
});

async function startLogger(inventoryBase: number) {
  setInterval(() => {
    const heap = window.Module?.HEAPU32;
    if (!heap) return;
    if (!petalSids) return;
    const summary: Summary = {}, detail: Detail = {};
    for (let r = 0; r < 9; r++) {
      summary[r] = 0;
      detail[r] = Object.fromEntries(petalSids.map(sid => [sid, 0]));
    }
    petalSids.forEach((sid, p) => {
      for (let r = 0; r < 9; r++) {
        const idx = inventoryBase + p * 9 + r;
        const count = heap[idx] || 0;
        summary[r]! += count;
        detail[r]![sid] = count;
      }
    });
    petalCountLogger.summary = summary;
    petalCountLogger.detail = detail;
    petalCountLogger.lastUpdate = Date.now();
  }, 50);
}

export const petalCountLogger: {
  summary?: Summary,
  detail?: Detail,
  lastUpdate?: number,
  getSummary: () => Summary | undefined,
  getDetail: () => Detail | undefined,
  getLastUpdate: () => number | undefined,
} = {
  summary: undefined,
  detail: undefined,
  lastUpdate: undefined,
  getSummary() {
    return this.summary;
  },
  getDetail() {
    return this.detail;
  },
  getLastUpdate() {
    return this.lastUpdate;
  }
};

export function useDetail() {
  const detail = ref(petalCountLogger.getDetail());
  setInterval(() => {
    detail.value = petalCountLogger.getDetail();
  }, 50);
  return detail;
}

export function petalCountLoggerInit(inventory: number) {
  startLogger(inventory);
}