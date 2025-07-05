<script setup lang="ts">
import "./assets/global.css";

import {WebSocketService} from "./websocket.js";
import WarnBannerManager from "./WarnBannerManager.vue";
import MouseNoEffect from "./components/MouseNoEffect.vue";
import {petalCountLoggerInit} from "./petalCountLogger";
import {currentServerInfo, getPlayerId, getPlayerName} from "./player";
import {nextTick, onMounted} from "vue";
import ServerSwitcher from "./ServerSwitcher.vue";
import {showWarnBanner} from "./warnBanner.ts";
import {patchWebsocket} from "./gameWebsocket.ts";
import {loadFeature} from "./feature/featureStorage.ts";
import {superReportInit} from "./superReport.ts";
import SuperList from "./infoHud/SuperList.vue";
import CollectDisplayEntry from "./collectDisplay/CollectDisplayEntry.vue";

const webSocketServerAddress = import.meta.env.SERVER;
const webSocketService = new WebSocketService(webSocketServerAddress);
petalCountLoggerInit(webSocketService);
superReportInit(webSocketService);
patchWebsocket();
webSocketService.subscribeOpen(() => {
  let name: string;
  try {
    name = atob(localStorage['cached_account_data']).split('\x00')[3]; // Get player's name from localStorage
  } catch (e) {
    name = "EMPTY";
  }
  webSocketService.sendMessage({
    type: 'handshake',
    version: VERSION,
    playerName: name,
    playerId: getPlayerId()
  });
});
webSocketService.subscribe('updateRequired', (data) => {
  if(data.content.goupdate!==VERSION){
    showWarnBanner(`发现新版本,版本号${data.content.goupdate},请尽快更新`, 3500);
  }
});
webSocketService.subscribe('broadcast', (data) => {
  showWarnBanner(data.content, data.time ?? 8000);
});
setInterval(() => {
  webSocketService.sendMessage({
    type: 'online',
    content: {
      playerName : getPlayerName(),
      playerId : getPlayerId(),
      region: currentServerInfo.value.region,
      map: currentServerInfo.value.map,
      serverId: currentServerInfo.value.serverId,
      version: VERSION,
    }
  });
}, 5000);
onMounted(() => {
  nextTick(() => {
    webSocketService.connect();
  });
  showWarnBanner('Made by Crystal_awa', 8000);
  showWarnBanner(`当前版本:${VERSION}`, 8000);
  showWarnBanner(`按下${loadFeature('keyBind/openMenu', 'AltLeft')}键打开设置界面`, 8000);
});
</script>
<template>
  <MouseNoEffect>
    <WarnBannerManager/>
    <SuperList :webSocketService="webSocketService"/>
  </MouseNoEffect>
  <ServerSwitcher/>
  <Feature/>
  <CollectDisplayEntry v-show="collectOpen"/>
</template>