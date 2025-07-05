<script setup lang="ts">
import type {KeyBindSettings} from '../featureTypes';
import {ref, type UnwrapRef} from "vue";
import {loadFeature, saveFeature} from "../featureStorage";

const {setting, saveKey} = defineProps<{ setting: UnwrapRef<KeyBindSettings>, saveKey: string }>();
setting.value = loadFeature(saveKey, setting.default);
const reBinding = ref(false);

function reBind() {
  reBinding.value = true;

  const listener = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      const allowCancel = setting.allowCancel;
      if (allowCancel) {
        reBinding.value = false;
        document.removeEventListener('keydown', listener);
        e.preventDefault();
        return;
      } else {
        return;
      }
    }
    const key = e.code;
    setting.value = key;
    reBinding.value = false;
    saveFeature(saveKey, key);
    e.stopImmediatePropagation();
    e.preventDefault();
    document.removeEventListener('keydown', listener);
  };
  document.addEventListener('keydown', listener);
}
</script>

<template>
  <div class="setting-item">
    <label class="option-item label" :for="setting.id">{{ setting.name }}</label>
    <div class="option-item" @click="reBind">
      <span>{{ reBinding ? '按任意键' : setting.value }}</span>
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