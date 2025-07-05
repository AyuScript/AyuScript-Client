// FeatureTypes.ts
import type {Component, Ref} from "vue";

export type BaseSettings<T = any> = {
  id: string
  name: string
  description?: string
  value?: Ref<T>
  default?: T
}

export type BooleanSettings = BaseSettings<boolean> & {
  type: 'boolean'
  enabled?: Ref<boolean>
}

export type ButtonSettings = BaseSettings<boolean> & {
  type: 'button'
  function: Function
  buttonText: string
}

export type NumberSettings = BaseSettings<number> & {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

export type EnumSettings = BaseSettings<string> & {
  type: 'enum'
  options: { id: string, name: string }[]
}

export type TextSettings = BaseSettings<string> & {
  type: 'text'
}

export type KeyBindSettings = BaseSettings<string> & {
  type: 'keyBind'
  allowCancel?: boolean
}

export type FeatureSetting =
  | BooleanSettings
  | ButtonSettings
  | NumberSettings
  | EnumSettings
  | TextSettings
  | KeyBindSettings

export type FeatureSettingsGroup = {
  id: string
  type: 'settings'
  title?: string
  settings: FeatureSetting[]
  position: number
} | {
  id: string
  type: 'component'
  title?: string
  component: Component
  props?: Record<string, any>
  position: number
}
