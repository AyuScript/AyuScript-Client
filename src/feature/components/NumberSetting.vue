<script setup lang="ts">
import type {NumberSettings} from '../featureTypes';
import {loadFeature, saveFeature} from "../featureStorage";
import type {UnwrapRef} from "vue";

const {setting, saveKey} = defineProps<{ setting: UnwrapRef<NumberSettings>, saveKey: string }>();
setting.value = loadFeature(saveKey, setting.default);
</script>

<template>
  <div class="setting-item">
    <label :for="setting.id">{{ setting.name }}</label>
    <input
        type="number"
        :id="setting.id"
        v-model.number="setting.value"
        :min="setting.min"
        :max="setting.max"
        :step="setting.step || 1"
        @change="saveFeature(saveKey, setting.value)"
    />
  </div>
</template>

<style scoped>
.setting-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
</style>

