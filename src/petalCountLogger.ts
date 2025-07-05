import type {Petal, Utils} from "./florr";
import {WebSocketService} from "./websocket";

const rarityNames = ['Common', 'Unusual', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Ultra', 'Super', 'Unique'];
type RarityNames = typeof rarityNames[number];
type KRarityNames = RarityNames[];
export type Summary = Partial<Record<RarityNames, number>>;
export type Detail = Partial<Record<RarityNames, Record<string, number>>>;
let florrioUtils!: Utils;
let petals!: Petal[];
let petalSids!: string[];
let petalIdMap!: Record<string, number>;
let rarityCount!: number;
let kRarityNames!: KRarityNames;
let rarityIndexMap!: Record<RarityNames, number>;
const imageCache: Record<string, string> = {};
new Promise(async resolve => {
  while (!(florrioUtils = window.florrio?.utils)) {
    await new Promise(r => setTimeout(r, 100));
  }
  petals = florrioUtils.getPetals();
  petalSids = petals.map(p => p.sid);
  petalIdMap = Object.fromEntries(petals.map(p => [p.sid, p.id]));
  rarityCount = petals.find(p => Array.isArray(p.allowedDropRarities))?.allowedDropRarities.length || 9;
  kRarityNames = ['Common', 'Unusual', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Ultra', 'Super', 'Unique'].slice(0, rarityCount) as KRarityNames;
  rarityIndexMap = Object.fromEntries(kRarityNames.map((n, i) => [n, i]));
  resolve(null);
});

async function startLogger(inventoryBase: number) {
  setInterval(() => {
    const heap = window.Module?.HEAPU32;
    if (!heap) return;
    const summary: Summary = {}, detail: Detail = {};
    kRarityNames.forEach(r => {
      summary[r] = 0;
      detail[r] = Object.fromEntries(petalSids.map(sid => [sid, 0]));
    });
    petalSids.forEach((sid, p) => {
      for (let r = 0; r < rarityCount; r++) {
        const idx = inventoryBase + p * rarityCount + r;
        const count = heap[idx] || 0;
        summary[kRarityNames[r]]! += count;
        detail[kRarityNames[r]]![sid] = count;
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
  getImageUrl: (rarityName: string, sid: string) => string | null,
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
  },
  getImageUrl(rarityName, sid) {
    const idx = rarityIndexMap[rarityName];
    const id = petalIdMap[sid];
    if (idx == null || id == null) return null;
    const key = `${rarityName}_${sid}`;
    if (imageCache[key]) return imageCache[key];
    const url = florrioUtils.generatePetalImage(100, id, idx, 1);
    return imageCache[key] = url;
  }
};

export function petalCountLoggerInit(webSocketService: WebSocketService) {
  webSocketService.subscribe('memory', (data: { payload: { di: number; }; }) => {
    const { di } = data.payload;
    startLogger(di);
  })
}