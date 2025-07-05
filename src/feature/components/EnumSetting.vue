<script setup lang="ts">
import type {EnumSettings} from '../featureTypes';
import {loadFeature, saveFeature} from "../featureStorage";
import type {UnwrapRef} from "vue";

const {setting, saveKey} = defineProps<{ setting: UnwrapRef<EnumSettings>, saveKey: string }>();
setting.value = loadFeature(saveKey, setting.default);
</script>

<template>
  <div class="setting-item">
    <label class="option-item label" :for="setting.id">{{ setting.name }}</label>
    <div class="option-item select-wrapper">
      <select v-model="setting.value" @change="saveFeature(saveKey, setting.value)">
        <option v-for="option in setting.options" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.setting-item {
  display: flex;
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

.select-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  font-size: 1.05rem;
  height: 30px !important;
  flex-shrink: 0;
  position: relative;
  color: white;
}

.select-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: #2c3e50;
  color: white;
  border: none;
  padding: 5px 40px 5px 10px;
  font-size: 1.05rem;
  border-radius: 8px;
  height: 30px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease;
  outline: none;
}

.select-wrapper::after {
  content: '▼';
  position: absolute;
  right: 30px;
  pointer-events: none;
  font-size: 0.8rem;
  color: #ccc;
}

</style>

