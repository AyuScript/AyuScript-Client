<script setup lang="ts">

import SuperPanel from "./SuperPanel.vue";
import type {WebSocketService} from "../websocket.ts";
import {computed, ref} from "vue";
import type {Mob} from "../florr";
import { superNames } from "./superNames.ts";
import SummaryPanel from "./SummaryPanel.vue";

interface SuperPacket {
  content: {
    first: string,
    second: string
  }[]
}

const { webSocketService } = defineProps<{
  webSocketService: WebSocketService,
}>();
const superList = ref<{
  first: string,
  second: string
}[]>([]);
const displayList = computed(() => {
  return superList.value.filter(item => parseInfo(item.second));
});
let mobs: Mob[];
new Promise(async resolve => {
  while (!window.florrio?.utils) {
    await new Promise(r => setTimeout(r, 100));
  }
  mobs = window.florrio.utils.getMobs();
  resolve(null);
});
function getIdOfMob(name: string) {
  const mob = mobs.find(mob => superNames[mob.sid] === name);
  return mob ? mob.id : 1;
}
function parseInfo(input: string) {
  const normalReg = /^(\w+) Super ([A-Za-z ]+?)\(([A-Za-z ]+)\|([0-9a-z]{4})\)$/;
  const notInReg = /^(\w+) Super ([A-Za-z ]+?)(\(not in .+\))?$/;
  if (input.includes("defeated")) {
    return null;
  }
  if (notInReg.test(input)) {
    const match = input.match(notInReg);
    if (!match) return null;

    const [, region, name] = match;

    return {
      region,
      name,
    };
  } else if (normalReg.test(input)) {
    const match = input.match(normalReg);
    if (!match) return null;

    const [, region, name, location, code] = match;

    return {
      region,
      name,
      location,
      code,
    };
  } else {
    return null;
  }
}

webSocketService.subscribe('superpingMessage', (data: SuperPacket) => {
  superList.value = data.content;
});

webSocketService.subscribe('superpingModify', (data: SuperPacket) => {
  superList.value = data.content;
});

</script>

<template>
  <div class="superContainer">
    <transition-group name="slide-fade">
      <SuperPanel v-for="message in displayList" :key="message.first+message.second"
                  :mob-id="getIdOfMob(parseInfo(message.second)!.name)"
                  :name="parseInfo(message.second)!.name"
                  :location="parseInfo(message.second)!.region + ' ' + (parseInfo(message.second)!.location ?? '')"
                  :time="message.first"
                  :code="parseInfo(message.second)!.code"></SuperPanel>
    </transition-group>
    <SummaryPanel :webSocketService="webSocketService"/>
  </div>
</template>

<style scoped>
.superContainer {
  position: fixed;
  right: 0;
  bottom: 0;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>