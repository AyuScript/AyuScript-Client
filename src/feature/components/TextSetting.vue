<script setup lang="ts">
import type {TextSettings} from '../featureTypes';
import {loadFeature, saveFeature} from "../featureStorage";
import type {UnwrapRef} from "vue";

const {setting, saveKey} = defineProps<{ setting: UnwrapRef<TextSettings>, saveKey: string }>();
setting.value = loadFeature(saveKey, setting.default);
</script>

<template>
  <div class="setting-item">
    <label :for="setting.id">{{ setting.name }}</label>
    <input type="text" :id="setting.id" v-model="setting.value" @change="saveFeature(saveKey, setting.value)"/>
  </div>
</template>

<style scoped>
.setting-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
</style>
