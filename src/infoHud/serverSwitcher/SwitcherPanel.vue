<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {getWsURL} from '@/gameWebsocket.ts';
import {currentServerInfo} from "@/player.ts";
import {eventBus} from "@/eventBus.ts";

const matrixs = [
  'Garden', 'Desert', 'Ocean', 'Jungle', 'Ant Hell', 'Hel', 'Sewers', 'Factory', 'Pyramid'
] as const;
type Matrix = typeof matrixs[number];
type Region = 'NA' | 'EU' | 'AS';

const servers = ref(
    Object.fromEntries(matrixs.map(name => [name, {
      NA: {},
      EU: {},
      AS: {}
    }])) as Record<Matrix, Record<Region, Record<string, number>>>
);

const totalServers = matrixs.length;
const wssArr = ref<string[]>([]);

function regionToName(code: string) {
  return code === 'NA' ? 'US' : code === 'EU' ? 'EU' : code === 'AS' ? 'AS' : code;
}

function updateServers() {
  for (let i = 0; i < totalServers; i++) {
    fetch(`https://api.n.m28.io/endpoint/florrio-map-${i}-green/findEach/`)
        .then(res => res.json())
        .then(data => {
          const matrix = matrixs[i];
          if (!servers.value[matrix]) servers.value[matrix] = {NA: {}, EU: {}, AS: {}};

          const timestamp = Math.floor(Date.now() / 1000);
          servers.value[matrix].NA[data.servers['vultr-miami'].id] = timestamp;
          servers.value[matrix].EU[data.servers['vultr-frankfurt'].id] = timestamp;
          servers.value[matrix].AS[data.servers['vultr-tokyo'].id] = timestamp;
        });
  }

  const now = Math.floor(Date.now() / 1000);
  for (const biome of matrixs) {
    for (const region of ['NA', 'EU', 'AS'] as Region[]) {
      for (const id of Object.keys(servers.value[biome][region])) {
        if (now - servers.value[biome][region][id] > 5 * 60) {
          delete servers.value[biome][region][id];
        }
      }
    }
  }
}

function getServerId() {
  const ws = getWsURL();
  if (!ws) return;
  const match = ws.match(/wss:\/\/([a-z0-9]+)\.s\.m28n\.net\//);
  if (!match) return;

  const currentId = match[1];
  for (const biome of matrixs) {
    for (const region of ['NA', 'EU', 'AS'] as Region[]) {
      if (servers.value[biome][region][currentId]) {
        currentServerInfo.value = {
          region: regionToName(region),
          map: biome,
          serverId: currentId
        };
        return;
      }
    }
  }
  currentServerInfo.value = {region: '', map: '', serverId: ''};
}

function connectToServer(serverId: string) {
  if (window.cp6 && typeof window.cp6.forceServerID === 'function') {
    window.cp6.forceServerID(serverId);
  }
}

onMounted(() => {
  updateServers();
  getServerId();

  setInterval(() => {
    updateServers();
    getServerId();
  }, 5000);

  setInterval(() => {
    const ws = getWsURL();
    if (ws) {
      wssArr.value.unshift(ws);
      if (wssArr.value.length > 2) wssArr.value.splice(2);
      if (wssArr.value[0] !== wssArr.value[1]) {
        updateServers();
        getServerId();
      }
    }
  }, 1000);

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