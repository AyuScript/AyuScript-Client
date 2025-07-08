import {useStorage} from "@/storage/storage.ts";

export interface Goal {
  petalId: number
  petalRarity: number
  goal: number
}


export const goals = useStorage<Goal[]>('goals', []);
export const information = useStorage<'fps'|'ping'>('information', 'fps');