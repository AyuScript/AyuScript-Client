<script setup lang="ts">
import "./assets/global.css";

import {WebSocketService} from "./websocket.js";
import MouseNoEffect from "./components/MouseNoEffect.vue";
import {petalCountLoggerInit} from "./petalCountLogger";
import {currentServerInfo, getPlayerId, getPlayerName} from "./player";
import {nextTick, onMounted} from "vue";
import {patchWebsocket} from "./gameWebsocket.ts";
import {superReportInit} from "./superReport.ts";
import InfoHud from "./infoHud/InfoHud.vue";
import CollectDisplayEntry from "./collectDisplay/CollectDisplayEntry.vue";
import {useI18n} from "vue-i18n";
import {notice} from "./infoHud/notice/notice.ts";
import AesGcmEncryptor from "@/encryption/aes-gcm.ts";
import NoneEncryptor from "@/encryption/none.ts";
const { t } = useI18n();

const webSocketServerAddress = import.meta.env.VITE_SERVER;
const webSocketService = new WebSocketService(webSocketServerAddress);
switch (import.meta.env.VITE_ENCRYPTION) {
  case 'none':
    webSocketService.applyEncryptor(new NoneEncryptor());
    break;
  case 'aes-gcm':
    webSocketService.applyEncryptor(new AesGcmEncryptor(import.meta.env.VITE_ENCRYPTION_KEY));
    break;
}
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
    notice(t("notice.newVersion", {version: data.content.version}));
  }
});
webSocketService.subscribe('broadcast', (data) => {
  notice(data.content, data.time ?? 8000);
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
notice(t("notice.loaded"));
</script>
<template>
  <MouseNoEffect>
    <InfoHud :webSocketService="webSocketService"/>
  </MouseNoEffect>
  <CollectDisplayEntry/>
</template>