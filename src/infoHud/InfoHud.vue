<script setup lang="ts">

import type {WebSocketService} from "../websocket.ts";
import {ref} from "vue";
import SummaryPanel from "./SummaryPanel.vue";
import {notices} from "./notice/notice.ts";
import NoticePanel from "./notice/NoticePanel.vue";
import SwitcherPanel from "@/infoHud/serverSwitcher/SwitcherPanel.vue";
import {eventBus} from "@/eventBus.ts";
import SuperPanelGroup from "@/infoHud/super/SuperPanelGroup.vue";
import GoalPanel from "@/infoHud/goal/GoalPanel.vue";
import SettingsPanel from "@/infoHud/settings/SettingsPanel.vue";

const { webSocketService } = defineProps<{
  webSocketService: WebSocketService,
}>();

const showSwitcher = ref(false);
eventBus.on("showSwitcher", ()=>{
  showSwitcher.value = !showSwitcher.value;
});
const showSettings = ref(false);
eventBus.on("showSettings", ()=>{
  showSettings.value = !showSettings.value;
});

</script>

<template>
  <div class="settingsPanel">
    <transition name="slide-down">
      <SettingsPanel v-show="showSettings"/>
    </transition>
  </div>
  <div class="infoHud">
    <SuperPanelGroup :webSocketService="webSocketService"/>
    <transition-group name="slide-fade">
      <NoticePanel
          v-for="notice in notices"
          :key="notice.id"
          :content="notice"
      />
    </transition-group>
    <GoalPanel/>
    <transition name="slide-down">
      <SwitcherPanel v-show="showSwitcher"/>
    </transition>
    <SummaryPanel :webSocketService="webSocketService" :switcherOptions="{ showSwitcher }"/>
  </div>
</template>

<style scoped>
.settingsPanel {
  position: fixed;
  right: calc(var(--unit) * 28.8);
  bottom: 0;
}
.infoHud {
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
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(calc(var(--unit) * 0.8));
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(calc(var(--unit) * 0.8));
}
</style>