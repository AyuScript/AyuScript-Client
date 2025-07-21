<script setup lang="ts">
import {WebSocketService} from "../websocket.ts";
import {ref} from "vue";
import {currentServerInfo} from "../player.ts";
import {eventBus} from "@/eventBus.ts";
import {information} from "@/storage/globals.ts";

interface OnlinePeoplePacket {
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
  as: 0
});


webSocketService.subscribe('onlinePeople', (data: OnlinePeoplePacket) => {
  userInfo.value = {
    us: data.content.us,
    eu: data.content.eu,
    as: data.content.as
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

const ping = ref(0);
setInterval(()=>{
  const start = performance.now();
  fetch(`https://${currentServerInfo.value.serverId}.s.m28n.net/`)
      .then(response => response.json())
      .then(_ => {
        const end = performance.now();
        ping.value = (end - start) ;
      });
}, 5000);

const getPingColor = (ping: number) => {
  if (ping < 1000) return 'good';
  if (ping < 1500) return 'warn';
  return 'bad';
};
const getFpsColor = (fps: number) => {
  if (fps > 50) return 'good';
  if (fps > 30) return 'warn';
  return 'bad';
};

function toggleInformation() {
  information.value = information.value === 'fps' ? 'ping' : 'fps';
}
</script>
<template>
  <div class="card">
    <div class="info">
      <div class="detail code"
           @click="eventBus.emit('showSettings')">
        <span>You're</span>
        <span :class="webSocketService.isConnected.value ? 'highlight' : 'error'">
          {{webSocketService.isConnected.value ? "Online" : "Offline"}}
        </span>
      </div>
      <div :class="['detail', 'code', {'highlight': currentServerInfo.region == 'US'}]"
           @click="eventBus.emit('showSwitcher')">
        <span>US</span>
        <span>{{userInfo.us}}</span>
      </div>
      <div :class="['detail', 'code', {'highlight': currentServerInfo.region == 'EU'}]"
           @click="eventBus.emit('showSwitcher')">
        <span>EU</span>
        <span>{{userInfo.eu}}</span>
      </div>
      <div :class="['detail', 'code', {'highlight': currentServerInfo.region == 'AS'}]"
           @click="eventBus.emit('showSwitcher')">
        <span>AS</span>
        <span>{{userInfo.as}}</span>
      </div>
      <div class="detail code"
           @click="eventBus.emit('showSwitcher')">
        <span>Code</span>
        <span>{{currentServerInfo.serverId}}</span>
      </div>
      <div class="detail code" v-if="information === 'fps'" @click="toggleInformation">
        <span>{{$t("summary.info.fps")}}</span>
        <span :class="getFpsColor(fps)">{{fps.toFixed(0)}}</span>
      </div>
      <div class="detail code" v-if="information === 'ping'" @click="toggleInformation">
        <span>{{$t("summary.info.ping")}}</span>
        <span :class="getPingColor(ping)">{{ping.toFixed(0)}}</span>
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

.code {
  pointer-events: auto;
  cursor: pointer;
}

.highlight {
  color: #3ef29d;
}

.error {
  color: #f23e3e;
}
.good {
  color: #3ef29d;
}
.warn {
  color: #ffd700;
}
.bad {
  color: #f23e3e;
}
</style>
