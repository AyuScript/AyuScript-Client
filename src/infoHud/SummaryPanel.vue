<script setup lang="ts">
import {WebSocketService} from "../websocket.ts";
import {ref} from "vue";
import {currentServerInfo} from "../player.ts";

interface OnlinePeoplePacket {
  type: 'onlineppl',
  content: {
    us: number,
    eu: number,
    as: number,
    idk: number
  }
}

const { webSocketService } = defineProps<{
  webSocketService: WebSocketService
}>();

const userInfo = ref({
  us: 0,
  eu: 0,
  as: 0,
  unknown: 0
});


webSocketService.subscribe('onlineppl', (data: OnlinePeoplePacket) => {
  userInfo.value = {
    us: data.content.us,
    eu: data.content.eu,
    as: data.content.as,
    unknown: data.content.idk,
  };
});

const fps = ref(0);
const timestamps: number[] = [];
const windowSize = 1000;

function update(now: number) {
  timestamps.push(now);

  while (timestamps.length > 0 && now - timestamps[0] > windowSize) {
    timestamps.shift();
  }

  fps.value = timestamps.length / (windowSize / 1000);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
</script>
<template>
  <div class="card">
    <div class="info">
      <div class="detail">
        <span>You're</span>
        <span :class="webSocketService.isConnected.value ? 'highlight' : 'error'">
          {{webSocketService.isConnected.value ? "Online" : "Offline"}}
        </span>
      </div>
      <div :class="['detail', {'highlight': currentServerInfo.region == 'US'}]">
        <span>US</span>
        <span>{{userInfo.us}}</span>
      </div>
      <div :class="['detail', {'highlight': currentServerInfo.region == 'EU'}]">
        <span>EU</span>
        <span>{{userInfo.eu}}</span>
      </div>
      <div :class="['detail', {'highlight': currentServerInfo.region == 'AS'}]">
        <span>AS</span>
        <span>{{userInfo.as}}</span>
      </div>
      <div class="detail">
        <span>Code</span>
        <span>{{currentServerInfo.serverId}}</span>
      </div>
      <div class="detail">
        <span>FPS</span>
        <span>{{fps.toFixed(0)}}</span>
      </div>
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
  align-content: center;
  justify-content: center;
  text-align: center;
  flex: 1;
  gap: calc(var(--unit) * 1.5);
}

.detail {
  display: flex;
  flex-direction: column;
}

.highlight {
  color: #3ef29d;
}

.error {
  color: #f23e3e;
}
</style>
