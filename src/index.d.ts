import type {Cp6, Florrio, ModuleType} from "@/florr";

export interface AyuScriptAPI {
  addon: {
    mergeI18n: (lang: string, langData: Record<string, string>) => undefined;
    notice: (content: string) => undefined;
  }
}

export interface AyuHooks {
  [key: string]: Function;
}

declare global {
  export interface Window {
    ayuScriptApi: AyuScriptAPI;
    ayuHooks: AyuHooks;

    electron: true | undefined;

    florrio: Florrio;
    Module: ModuleType;
    cp6: Cp6;
    versionHash: string;
  }
}