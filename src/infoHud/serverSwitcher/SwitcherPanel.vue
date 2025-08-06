<script setup lang="ts">
import {onMounted} from 'vue';
import {currentServerInfo} from "@/player.ts";
import {eventBus} from "@/eventBus.ts";
import {connectToServer, type Matrix, useServers} from "@/florr/server.ts";

const servers = useServers();

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Backquote') {
      eventBus.emit('showSwitcher');
    }
  })
})
</script>

<template>
  <div class="card">
    <div class="info">
      <div class="region" v-for="(serversByRegion, region) in servers[currentServerInfo.map as Matrix]" :key="region">
        <span class="serverId" v-for="serverId in Object.keys(serversByRegion)"
              :key="serverId"
              :style="{ cursor: 'pointer', color: serverId === currentServerInfo.serverId ? '#3ef29d' : '#ffffff' }"
              @click="connectToServer(serverId)">
          {{ serverId }}
        </span>
      </div>
      <span class="region map">
        {{ currentServerInfo.map }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  border-radius: calc(var(--unit) * 0.6);
  padding: calc(var(--unit) * 1);
  width: calc(var(--unit) * 25);
  margin: calc(var(--unit) * 0.8);
  font-size: calc(var(--unit) * 1.5);
}

.info {
  display: flex;
  width: 100%;
  flex-direction: row;
  text-align: center;
  flex: 1;
  padding-left: calc(var(--unit) * 5.9);
}

.region {
  display: flex;
  flex-direction: column;
  min-width: calc(var(--unit) * 3.5);
}

.serverId {
  pointer-events: auto;
  cursor: pointer;
  font-size: 0.8em;
  min-width: calc(var(--unit) * 3.5);
}

.map {
  font-size: 0.8em;
  min-width: calc(var(--unit) * 5.5);
}
</style>