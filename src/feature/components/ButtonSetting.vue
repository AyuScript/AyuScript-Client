<script setup lang="ts">

import type {UnwrapRef} from "vue";
import type {ButtonSettings} from "../featureTypes.ts";
const {setting} = defineProps<{ setting: UnwrapRef<ButtonSettings>, saveKey: string }>();
</script>

<template>
  <div class="setting-item">
    <label class="option-item label" :for="setting.id">{{ setting.name }}</label>
    <div class="option-item" @click="setting.function()">
      <span>{{ setting.buttonText }}</span>
    </div>
  </div>
</template>

<style scoped>
.setting-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0,0,0,0.3);
  border-radius: 10px;
  font-size: 1.05rem;
  height: 30px !important;
  flex-shrink: 0;
}
.label {
  flex-grow: 1;
  margin-right: 40px;
}
</style>