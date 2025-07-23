<script setup lang="ts">
import {getImageUrl} from "@/florr/image.ts";
import {rarityColor} from "@/florr/const.ts";

defineProps<{
  content: { rarity: number, id: number, used: number, crafted: number, time: number }
}>();
</script>
<template>
  <div class="card">
    <div class="info">
      <span class="title">{{$t('craft.title')}}</span>
      <span class="content" :style="{color: rarityColor[content.rarity]}">
        <img class="icon-box" :src="getImageUrl(content.id, content.rarity)"/>
        -{{content.used}}
        {{$t(`rarity.${content.rarity}`)}}
        {{$t(`petalDisplay.${content.id}`)}}
      </span>
      <span class="content" :style="{color: rarityColor[content.rarity + 1]}">
        <img class="icon-box" :src="getImageUrl(content.id, content.rarity + 1)"/>
        +{{content.crafted}}
        {{$t(`rarity.${content.rarity + 1}`)}}
        {{$t(`petalDisplay.${content.id}`)}}
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
  flex-direction: column;
  text-align: center;
  flex: 1;
}
.title {
  font-size: 1.2em;
  text-align: left;
  margin: 0.2em;
}
.icon-box {
  width: calc(var(--unit) * 4);
  height: calc(var(--unit) * 4);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: calc(var(--unit) * 1);
}
.content {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
}
</style>
