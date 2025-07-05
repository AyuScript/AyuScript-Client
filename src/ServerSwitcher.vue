<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {getWsURL} from './gameWebsocket';
import {currentServerInfo} from "./player.ts";
import {switchServerKey} from "./feature/features.ts";

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
const position = '-240px';
const showMenu = ref(false);
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
        if (showMenu.value) {
          showMenu.value = true;
          setTimeout(() => (showMenu.value = false), 3000);
        }
      }
    }
  }, 1000);

  document.addEventListener('keydown', (e) => {
    if (e.code === switchServerKey.value) {
      showMenu.value = !showMenu.value;
    }
  })

  setTimeout(() => (showMenu.value = false), 3000);
})
</script>

<template>
  <div class="serverSwitcherContainer" :style="{ top: showMenu ? '0px' : position }">
    <div>
      Click on a server code to connect.<br/>
      Press {{switchServerKey}} to toggle this menu.<br/>
      Server Switcher by Furaken<br/>
    </div>

    <div v-if="currentServerInfo.map !== ''">
      {{ currentServerInfo.region }} - {{ currentServerInfo.map }}
      <table style="margin: 0 auto;">
        <tbody>
        <tr v-for="(serversByRegion, region) in servers[currentServerInfo.map as Matrix]" :key="region">
          <td>『 {{ regionToName(region) }} 』</td>
          <td v-for="serverId in Object.keys(serversByRegion)" :key="serverId" style="min-width: 50px">
              <span
                  class="server-id"
                  :style="{ cursor: 'pointer', color: serverId === currentServerInfo.serverId ? '#29ffa3' : '#ababab' }"
                  @click="connectToServer(serverId)"
              >
                {{ serverId }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      无法获取当前服务器信息，请刷新页面。
    </div>
  </div>
</template>

<style>
.serverSwitcherContainer {
  width: 500px;
  height: auto;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 10px;
  margin: 0 auto;
  color: white;
  text-align: center;
  font-family: Ubuntu, sans-serif;
  padding: 12px;
  cursor: default;
  transition: all 1s ease-in-out
}

.server-id:hover {
  color: #aaccff !important;
}
</style>