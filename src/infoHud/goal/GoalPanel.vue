<script setup lang="ts">
import {useDetail} from "@/petalCountLogger.ts";
import {ref} from "vue";
import GoalProgress from "@/infoHud/goal/GoalProgress.vue";
import {goals} from "@/storage/globals.ts";

const rarityColor = ['#7EEF6D', '#FFE65D', '#4D52E3', '#861FDE', '#DE1F1F', '#1FDBDE', '#FF2B75', '#2BFFA3', '#555555'];
const craftCount = [6.40625, 10.3125, 18.125, 33.75, 65, 127.5, 252.5, NaN, NaN];
const show = ref(false);
function getImageUrl(petalId: number, petalRarity: number): string {
  return window.florrio.utils.generatePetalImage(128, petalId, petalRarity, 1);
}
const detail = useDetail();
const interval = setInterval(()=>{
  if (detail.value) {
    show.value = true;
    clearInterval(interval);
  }
});
</script>

<template>
  <div class="card" v-if="show && goals.length">
    <div v-for="goal in goals" class="info">
      <img class="icon-box" :src="getImageUrl(goal.petalId, goal.petalRarity)"/>
      <div class="goal">
        <div class="goalText">
          <span :style="{color: rarityColor[goal.petalRarity]}">
            {{detail![goal.petalRarity]![goal.petalId]}}
          </span>
          <span v-if="goal.petalRarity >= 1">+</span>
          <span v-if="goal.petalRarity >= 1"
                :style="{color: rarityColor[goal.petalRarity - 1]}">
            {{(detail![goal.petalRarity - 1]![goal.petalId]
              / craftCount[goal.petalRarity - 1]).toFixed(1)}}
          </span>
          <span v-if="goal.petalRarity >= 2">+</span>
          <span v-if="goal.petalRarity >= 2"
                :style="{color: rarityColor[goal.petalRarity - 2]}">
            {{(detail![goal.petalRarity - 2]![goal.petalId]
              / craftCount[goal.petalRarity - 1]
              / craftCount[goal.petalRarity - 2]).toFixed(1)}}
          </span>
          <span>
            /{{goal.goal}}
          </span>
        </div>
        <span>
          {{((detail![goal.petalRarity]![goal.petalId] +
             (goal.petalRarity >= 1 ? detail![goal.petalRarity - 1]![goal.petalId]
             / craftCount[goal.petalRarity - 1] : 0) +
             (goal.petalRarity >= 2 ?
             detail![goal.petalRarity - 1]![goal.petalId]
             / craftCount[goal.petalRarity - 1]
             / craftCount[goal.petalRarity - 2]: 0)) / goal.goal * 100).toFixed(1)}}%
        </span>
        <GoalProgress :value1="detail![goal.petalRarity]![goal.petalId] / goal.goal * 100"
                      :value2="goal.petalRarity >= 1 ?
                               (detail![goal.petalRarity - 1]![goal.petalId]
                               / craftCount[goal.petalRarity - 1]) / goal.goal * 100 : 0"
                      :value3="goal.petalRarity >= 2 ?
                               (detail![goal.petalRarity - 1]![goal.petalId]
                               / craftCount[goal.petalRarity - 1]
                               / craftCount[goal.petalRarity - 2]) / goal.goal * 100 : 0"
                      :colors="[rarityColor[goal.petalRarity],
                                rarityColor[Math.max(goal.petalRarity - 1, 0)],
                                rarityColor[Math.max(goal.petalRarity - 2, 0)]]"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
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
  text-align: center;
  flex: 1;
}

.icon-box {
  width: calc(var(--unit) * 4);
  height: calc(var(--unit) * 4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.goal {
  display: flex;
  margin-left: calc(var(--unit) * 1);
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
  font-size: 0.8em;
}
</style>