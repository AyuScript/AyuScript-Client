<script setup lang="ts">
import type {BooleanSettings} from '../featureTypes';
import {loadFeature, saveFeature} from "../featureStorage";
import {type UnwrapRef} from "vue";

const {setting, saveKey} = defineProps<{ setting: UnwrapRef<BooleanSettings>, saveKey: string }>();
setting.value = loadFeature(saveKey, setting.default);
if (setting.enabled === undefined) {
  setting.enabled = true;
}
</script>

<template>
  <div class="setting-item">
    <label class="option-item label" :for="setting.id">{{ setting.name }}</label>
    <div class="option-item">
      <label :class="['toggle-switch', {'disabled': !setting.enabled}]">
        <input type="checkbox" v-model="setting.value" @change="saveFeature(saveKey, setting.value)"
               :disabled="!setting.enabled"/>
        <span class="toggle-slider"></span>
      </label>
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

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 28px;
  overflow: hidden;
  border-radius: 14px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2c3e50;
  transition: .2s;
  border-radius: 14px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .2s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(28px);
}

.toggle-switch.disabled {
  pointer-events: none;
  filter: brightness(0.5);
}
</style>