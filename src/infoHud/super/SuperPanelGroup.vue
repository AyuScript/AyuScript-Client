<script setup lang="ts">

import SuperPanel from "@/infoHud/super/SuperPanel.vue";
import {ref} from "vue";
import type {WebSocketService} from "@/websocket.ts";
import {S2CSuper, S2CSupers} from "@/proto/s2c.ts";
import {eventBus} from "@/eventBus.ts";
import {connectToServer, type Matrix, useServers} from "@/florr/server.ts";
import {currentServerInfo} from "@/player.ts";

const { webSocketService } = defineProps<{
  webSocketService: WebSocketService,
}>();

const servers = useServers();

const superList = ref<S2CSuper[]>([]);

webSocketService.subscribe('supers', (data: S2CSupers) => {
  superList.value = data.supers;
});

const tracing = ref('');
eventBus.on('trace', code => {
  tracing.value = code as string;
});
let lastTrace = 0;
setInterval(() => {
  if (tracing.value && currentServerInfo.value.serverId != tracing.value && Date.now() - lastTrace > 5000) {
    for (const group of Object.values(servers.value[currentServerInfo.value.map as Matrix])) {
      if (tracing.value in group) {
        lastTrace = Date.now();
        connectToServer(tracing.value);
        return;
      }
    }
  }
}, 100);
</script>

<template>
  <transition-group name="slide-fade">
    <SuperPanel v-for="s in superList" :key="s.id+s.region+s.loc+s.time+s.code"
                :mob-id="s.id"
                :region="s.region"
                :loc="s.loc"
                :time="s.time"
                :code="s.code"
                :tracing="tracing"></SuperPanel>
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