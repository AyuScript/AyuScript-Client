<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue';
import {petalCountLogger, type Detail} from '../petalCountLogger';

interface Item {
  rarity: string
  petal: string
  count: number
  key: string
  imgUrl: string
}

const rarityOrder = [
  'Common',
  'Unusual',
  'Rare',
  'Epic',
  'Legendary',
  'Mythic',
  'Ultra',
  'Super',
  'Unique',
];

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
          detail[rarity][petal] - (firstDetail?.[rarity]?.[petal] ?? 0);
      if (count > 0) {
        updates.push({
          rarity,
          petal,
          count,
          key: `${petal}|${rarity}`,
          imgUrl: petalCountLogger.getImageUrl(rarity, petal)!,
        });
      }
    }
  }

  updates.sort((a, b) => {
    const rA = rarityOrder.indexOf(a.rarity);
    const rB = rarityOrder.indexOf(b.rarity);
    return rB - rA || a.petal.localeCompare(b.petal);
  });

  items.value = updates.slice(0, 24);
}

onMounted(() => {
  const interval = setInterval(updateItems, 50);
  onUnmounted(() => clearInterval(interval));
})
</script>

<template>
  <div id="collected-popup">
    <h2>Collected this run</h2>
    <div class="grid" id="popup-grid">
      <div
          v-for="item in items"
          :key="item.key"
          class="item"
          :data-key="item.key"
      >
        <img :src="item.imgUrl" :alt="item.petal" />
        <div v-if="item.count > 1" class="count-badge">x{{ item.count }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#collected-popup {
  position: fixed;
  bottom: calc(var(--unit) * 21.6);
  left: calc(var(--unit) * 8);
  width: calc(var(--unit) * 23);
  background: rgb(0, 0, 0, 0.4);
  border-radius: calc(var(--unit) * 0.5);
  padding: calc(var(--unit) * 1.5) calc(var(--unit) * 2);
  z-index: 9999;
  font-family: Game, sans-serif;
}

#collected-popup h2 {
  margin: 0;
  font-size: calc(var(--unit) * 2.2);
  text-align: center;
  color: white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, calc(var(--unit) * 5));
  gap: calc(var(--unit) * 1);
  justify-content: start;
}

.item {
  position: relative;
  width: calc(var(--unit) * 5);
  height: calc(var(--unit) * 5);
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
  text-shadow:
      0.025em 0 black,
      -0.025em 0 black,
      0 0.025em black,
      0 -0.025em black,
      0.025em 0.025em black,
      -0.025em -0.025em black,
      0.025em -0.025em black,
      -0.025em 0.025em black;
  rotate: 30deg;
}
</style>
