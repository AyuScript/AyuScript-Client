<script setup lang="ts">
import {currentServerInfo} from "../player.ts";

const { mobId } = defineProps<{
  mobId: number,
  name: string,
  location: string,
  time: string,
  code?: string,
  tracing?: string,
}>();
function getImageUrl(): string {
  return window.florrio.utils.generateMobImage(128,mobId,7,1);
}
</script>
<template>
  <div class="card">
    <img class="icon-box" :src="getImageUrl()" />

    <div class="info">
      <div class="title">{{name}}</div>
      <div class="location">{{location}}</div>
      <div class="details">
        <span class="time">{{time}}</span>
        <span class="code">{{code}}</span>
      </div>
    </div>

    <button :class="['trace-button', {disabled: !code, traced: currentServerInfo.serverId == code}]"
            :disabled="!code || currentServerInfo.serverId == code">
      {{currentServerInfo.serverId == code ? "Traced" : "Trace"}}
    </button>
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
}

.icon-box {
  width: calc(var(--unit) * 5);
  height: calc(var(--unit) * 5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: calc(var(--unit) * 0.8);
}

.info {
  flex: 1;
}

.title {
  font-weight: bold;
  font-size: calc(var(--unit) * 1.5)
}

.location {
  font-size: calc(var(--unit) * 1.2);
  color: white;
}

.details {
  font-size: calc(var(--unit) * 1.2);
  display: flex;
  gap: calc(var(--unit) * 1);
  font-family: monospace;
}

.trace-button {
  background-color: #3ef29d;
  border: #23CF84 solid calc(var(--unit) * 0.5);
  color: white;
  font-size: calc(var(--unit) * 1.2);
  font-weight: bolder;
  padding: calc(var(--unit) * 0.6) calc(var(--unit) * 1.2);
  border-radius: calc(var(--unit) * 0.6);
  cursor: pointer;
  transition: filter 0.2s;
  pointer-events: auto;
}

.trace-button.disabled {
  filter: grayscale(1);
  cursor: default;
}

.trace-button.traced {
  filter: hue-rotate(-80deg);
  cursor: default;
}

.trace-button:hover:not(.disabled):not(.traced) {
  filter: brightness(1.05);
}

</style>
