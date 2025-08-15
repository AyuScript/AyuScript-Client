<script setup lang="ts">
import {useDetail} from "@/petalCountLogger.ts";
import {useI18n} from "vue-i18n";
import {getPlayerName} from "@/player.ts";
import {getImageUrl} from "@/florr/image.ts";
const { t } = useI18n();

const inventory = useDetail();
const keyedInventory = (() => {
  const result: Record<string, Record<number, number>> = {};
  if (!inventory.value) {
    return result;
  }
  for (let rarity = 0; rarity < 9; rarity++) {
    for (const petal in inventory.value[rarity]) {
      const count = inventory.value[rarity]![petal];
      if (count > 0) {
        if (!result[petal]) {
          result[petal] = {};
        }
        result[petal][rarity] = count;
      }
    }
  }
  return result;
})();
const renderedInventory = (() => {
  const result: {
    petalId: number;
    rarity: number;
    count: number;
    subCount: number;
  }[] = [];
  for (const petal in keyedInventory) {
    const rarityCounts = keyedInventory[petal];
    const rarityKeys = Object.keys(rarityCounts);
    const maxRarity = Math.max(...rarityKeys.map(Number));
    result.push({
      petalId: parseInt(petal),
      rarity: maxRarity,
      count: rarityCounts[maxRarity],
      subCount: maxRarity > 0 ? rarityCounts[maxRarity - 1] : 0,
    });
  }
  result.sort(
      (a, b) => t(`petalDisplay.${a.petalId}`).localeCompare(t(`petalDisplay.${b.petalId}`))
  );
  return result;
})();

function format(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toFixed(0);
}
</script>

<template>
  <div class="inventoryBox">
    <h1 class="title">
      Inventory of {{getPlayerName()}}
    </h1>
    <div class="container">
      <div class="item" v-for="item in renderedInventory">
        <img class="image" :src="getImageUrl(item.petalId, item.rarity)"/>
        <img v-if="item.rarity > 0 && item.subCount > 0"
             class="image"
             :src="getImageUrl(item.petalId, item.rarity - 1)"/>
        <span v-if="item.count > 0" class="tag one">
          x{{format(item.count)}}
        </span>
        <span v-if="item.subCount > 0" class="tag two">
          x{{format(item.subCount)}}
        </span>
      </div>
    </div>
    <span class="hint">Generated with AyuScript</span>
  </div>
</template>

<style scoped>
.inventoryBox {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  background-color: #6B9DD6;
  border: #5680AD solid 5px;
  border-radius: 3px;
  max-width: 1090px;
  flex-shrink: 0;
}
.title {
  position: relative;
  color: white;
  text-align: center;
  font-size: 20px;
  z-index: 1;
  margin-left: 50px;
  margin-right: 50px;
  paint-order: stroke fill;
  -webkit-text-stroke: 0.1em black;
}
.container {
  display: flex;
  gap: 10px;
  flex-direction: row;
  flex-wrap: wrap;
}
.item {
  position: relative;
  display: flex;
  flex-shrink: 0;
  width: 100px;
  height: 50px;
}
.image {
  width: 50px;
  height: 50px;
}
.tag {
  position: absolute;
  color: white;
  rotate: 20deg;
  font-size: 12px;
  paint-order: stroke fill;
  -webkit-text-stroke: 0.1em black;
}
.tag.one {
  left: 35px;
}
.tag.two {
  left: 85px;
}
.hint {
  position: relative;
  color: white;
  text-align: right;
  font-size: 10px;
  z-index: 1;
  margin-right: 3px;
  margin-bottom: 3px;
  paint-order: stroke fill;
  -webkit-text-stroke: 0.1em black;
}
</style>