<script setup lang="ts">
import "./assets/global.css";

import {WebSocketService} from "./websocket.js";
import MouseNoEffect from "./components/MouseNoEffect.vue";
import {currentServerInfo, getPlayerId, getPlayerName} from "./player";
import {nextTick, onMounted} from "vue";
import {patchWebsocket} from "./gameWebsocket.ts";
import InfoHud from "./infoHud/InfoHud.vue";
import {useI18n} from "vue-i18n";
import {notice} from "@/infoHud/notice/notice.ts";
import NoneEncryptor from "@/encryption/none.ts";
import {injectAPI} from "@/memory/wasmExtraction.ts";
import {petalCountLoggerInit} from "@/petalCountLogger.ts";
import Api from "@/Api.vue";
import '@/commands/builtin';
const { t } = useI18n();

const webSocketServerAddress = import.meta.env.VITE_SERVER;
const webSocketService = new WebSocketService(webSocketServerAddress);
switch (import.meta.env.VITE_ENCRYPTION) {
  case 'none':
    webSocketService.applyEncryptor(new NoneEncryptor());
    break;
}
injectAPI().then(({ inventory }) => {
  petalCountLoggerInit(inventory);
});
patchWebsocket();
webSocketService.subscribeOpen(() => {
  webSocketService.sendMessage({
    handshake: {
      version: VERSION,
      playerId: getPlayerId(),
      playerName: getPlayerName()
    }
  });
});
webSocketService.subscribe('newVersion', (data) => {
  if(data.content.version!==VERSION){
    notice(t("notice.newVersion", {version: data.content.version}));
  }
});
webSocketService.subscribe('broadcast', (data) => {
  notice(data.message);
});
setInterval(() => {
  webSocketService.sendMessage({
    heartbeat: {
      playerId : getPlayerId(),
      playerName : getPlayerName(),
      region: currentServerInfo.value.region,
      map: currentServerInfo.value.map,
      serverId: currentServerInfo.value.serverId,
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
  <Api/>
  <MouseNoEffect>
    <InfoHud :webSocketService="webSocketService"/>
  </MouseNoEffect>
</template>