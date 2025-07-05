<script setup lang="ts">
import type {FeatureSetting} from './featureTypes';

import BooleanSetting from './components/BooleanSetting.vue';
import ButtonSetting from "./components/ButtonSetting.vue";
import NumberSetting from './components/NumberSetting.vue';
import EnumSetting from './components/EnumSetting.vue';
import TextSetting from './components/TextSetting.vue';
import KeyBindSetting from './components/KeyBindSetting.vue';

defineProps<{
  settings: FeatureSetting[]
  saveKey: string
}>();

const typeMap = {
  boolean: BooleanSetting,
  button: ButtonSetting,
  number: NumberSetting,
  enum: EnumSetting,
  text: TextSetting,
  keyBind: KeyBindSetting,
};

function getComponent(type: FeatureSetting['type']) {
  return typeMap[type];
}
</script>

<template>
  <div class="main-content">
    <div v-for="setting in settings" class="mb-4">
      <component :is="getComponent(setting.type)" :setting="setting as any" :save-key="saveKey + '/' + setting.id"/>
    </div>
  </div>
</template>

<style>
.main-content {
  flex: 1;
  grid-area: main;
  padding: 25px 20px;
  overflow-y: scroll;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100% - 50px);
  scrollbar-width: none;
}
</style>
