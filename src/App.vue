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
import {superReportInit} from "./superReport.ts";
import SuperList from "./infoHud/SuperList.vue";
import CollectDisplayEntry from "./collectDisplay/CollectDisplayEntry.vue";
import {useI18n} from "vue-i18n";
const { t } = useI18n();

const webSocketServerAddress = import.meta.env.SERVER;
const webSocketService = new WebSocketService(webSocketServerAddress);
petalCountLoggerInit(webSocketService);
superReportInit(webSocketService);
patchWebsocket();
webSocketService.subscribeOpen(() => {
  let name: string;
  try {
    name = getPlayerName();
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
webSocketService.subscribe('newVersion', (data) => {
  if(data.content.version!==VERSION){
    showWarnBanner(t("notice.newVersion", {version: data.content.version}), 3500);
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
});
</script>
<template>
  <MouseNoEffect>
    <WarnBannerManager/>
    <SuperList :webSocketService="webSocketService"/>
  </MouseNoEffect>
  <ServerSwitcher/>
  <CollectDisplayEntry/>
</template>