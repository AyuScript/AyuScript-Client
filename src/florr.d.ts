import {Utils} from "./petalCountLogger";

interface Cp6 {
  disconnect: () => void;
  forceServerID: (string) => void;
  simulateContextLoss: () => void;
}

type ModuleType = {
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
} | {
  HEAP8: undefined;
  HEAP16: undefined;
  HEAP32: undefined;
  HEAPU8: undefined;
  HEAPU16: undefined;
  HEAPU32: undefined;
  HEAPF32: undefined;
  HEAPF64: undefined;
}

interface Florrio {
  utils: Utils;
}

export interface Utils {
  calculateDropChance: (mobId: number, mobRarity: number, dropRarity: number) => number;
  generateMobImage: (size: number, mobId: number, mobRarity: number, variant: number) => string;
  generatePetalImage: (size: number, petalId: number, petalRarity: number, variant: number) => string;
  getAssemblerMatrix: (assemblerId: number) => number[][];
  getMobs: () => Mob[];
  getPetals: () => Petal[];
  getTalents: () => Talent[];
  uploadCustomLang: (langData: Record<string, string>) => Promise<void>;
}

type TooltipEntry = [string, number];

interface MobRarity {
  tooltip: TooltipEntry[];
}

export interface Mob {
  id: number;
  sid: string;
  rarities: PetalRarity[];
}

interface PetalRarity {
  droppable?: boolean;
  shoppable?: boolean;
  reloadTime?: number;
  tooltip: TooltipEntry[];
}

export interface Petal {
  allowedDropRarities: number[];
  id: number;
  sid: string;
  rarities: PetalRarity[];
}


declare global {
  export interface Window {
    florrio: Florrio;
    Module: ModuleType;
    cp6: Cp6;
    versionHash: string;
  }
}