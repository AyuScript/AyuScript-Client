<script setup lang="ts">
import {useDetail} from "@/petalCountLogger.ts";
import {ref, watch} from "vue";
import CraftPanel from "@/infoHud/craft/CraftPanel.vue";
import {notices} from "@/infoHud/notice/notice.ts";
import NoticePanel from "@/infoHud/notice/NoticePanel.vue";
import SuperPanelGroup from "@/infoHud/super/SuperPanelGroup.vue";

const detail = useDetail();
const crafts = ref<{ rarity: number, id: number, used: number, crafted: number, time: number }[]>([]);
watch(detail, (newDetail, oldDetail) => {
  for (const rarity in oldDetail) {
    const oldRecord = oldDetail[+rarity];
    const newRecord = newDetail![+rarity];

    if (!oldRecord || !newRecord) continue;

    for (const id in oldRecord) {

      if (newRecord[id] !== undefined && newRecord[id] < oldRecord[id]) {
        crafts.value.push({
          rarity: +rarity,
          id: +id,
          used: oldRecord[id] - newRecord[id],
          crafted: newDetail![+rarity + 1]![id] - oldDetail[+rarity + 1]![id],
          time: Date.now()
        });
      }
    }
  }
}, {deep: true});
setInterval(() => {
  const now = Date.now();
  const arr = crafts.value;

  for (let i = arr.length - 1; i >= 0; i--) {
    if (now - arr[i].time > 6000) {
      arr.splice(i, 1);
    }
  }
}, 100);
</script>

<template>
  <transition-group name="slide-fade">
    <CraftPanel v-for="craft in crafts"
                :key="craft.time"
                :content="craft"/>
  </transition-group>
</template>

<style scoped>
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