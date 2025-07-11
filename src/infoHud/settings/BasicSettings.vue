<script setup lang="ts">

import {information} from "@/storage/globals.ts";
import CopyImage from "@/components/CopyImage.vue";
import Inventory from "@/infoHud/inventory/Inventory.vue";
import {eventBus} from "@/eventBus.ts";
import {ref} from "vue";
const showInventory = ref(false);

function copyInventory() {
  showInventory.value = false;
  setTimeout(() => {
    showInventory.value = true;
  }, 500);
  setTimeout(() => {
    eventBus.emit('copyInventory');
  }, 10000);
}
</script>

<template>
  <div>
    <h3>{{$t('settings.basic.title')}}</h3>
    <div>
      <span>
        {{$t('settings.basic.information')}}
      </span>
      <select v-model="information">
        <option
            v-for="i in ['fps', 'ping']"
            :key="i"
            :value="i"
        >
          {{$t(`summary.info.${i}`)}}
        </option>
      </select>
    </div>
    <button @click="copyInventory">
      {{$t('settings.basic.copyInventory')}}
    </button>
    <CopyImage v-if="showInventory" copyKey="Inventory">
      <Inventory/>
    </CopyImage>
  </div>
</template>

<style scoped>

</style>