<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import {petalCountLogger, type Detail} from '@/petalCountLogger';
import {getImageUrl} from "@/florr/image.ts";
import {useI18n} from "vue-i18n";

interface Item {
  rarity: number
  petal: number
  count: number
  key: string
  imgUrl: string
}

const { t } = useI18n();

let firstRetrieve = true;
let firstDetail: Detail | undefined;
const items = ref<Item[]>([]);

function updateItems() {
  const detail = petalCountLogger?.getDetail();
  if (!detail) return;

  if (firstRetrieve) {
    firstDetail = detail;
    firstRetrieve = false;
    return;
  }

  const updates: Item[] = [];

  for (const rarity in detail) {
    for (const petal in detail[rarity]) {
      const count =
          detail[rarity][petal]! - (firstDetail?.[rarity]?.[petal] ?? 0);
      if (count > 0) {
        updates.push({
          rarity: parseInt(rarity),
          petal: parseInt(petal),
          count,
          key: `${petal}|${rarity}`,
          imgUrl: getImageUrl(parseInt(petal), parseInt(rarity))!,
        });
      }
    }
  }

  updates.sort((a, b) => {
    return (b.rarity - a.rarity) || t(`petalDisplay.${a.petal}`).localeCompare(t(`petalDisplay.${b.petal}`));
  });

  items.value = updates.slice(0, 20);
}

onMounted(() => {
  const interval = setInterval(updateItems, 50);
  onUnmounted(() => clearInterval(interval));
})
</script>

<template>
  <div class="card">
    <span class="title">{{$t('collect.title')}}</span>
    <div class="grid" id="popup-grid">
      <div
          v-for="item in items"
          :key="item.key"
          class="item scale-in"
          :data-key="item.key"
      >
        <img :src="item.imgUrl" :alt="$t(`petal.${item.petal}`)" />
        <div v-if="item.count > 1" class="count-badge">x{{ item.count }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  border-radius: calc(var(--unit) * 0.6);
  padding: calc(var(--unit) * 1);
  width: calc(var(--unit) * 25);
  margin: calc(var(--unit) * 0.8);
  font-size: calc(var(--unit) * 1.5);
}

.title {
  font-size: 1.2em;
  text-align: left;
  margin: 0.2em 0.2em 0.6em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, calc(var(--unit) * 4));
  gap: calc(var(--unit) * 0.8);
  justify-content: start;
}

.item {
  position: relative;
  width: calc(var(--unit) * 4);
  height: calc(var(--unit) * 4);
}

.item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.count-badge {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  font-size: calc(var(--unit) * 1.5);
  height: 20%;
  rotate: 30deg;
  paint-order: stroke fill;
  -webkit-text-stroke: 0.1em black;
}

.scale-in {
  animation: scaleIn 0.6s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
