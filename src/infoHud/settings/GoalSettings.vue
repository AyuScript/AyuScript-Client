<script setup lang="ts">
import {goals} from "@/storage/globals.ts";

const rarityColor = ['#7EEF6D', '#FFE65D', '#4D52E3', '#861FDE', '#DE1F1F', '#1FDBDE', '#FF2B75', '#2BFFA3', '#555555'];

const addItem = () => {
  goals.value.push({ petalId: 1, petalRarity: 0, goal: 1 })
}

const deleteItem = (index: number) => {
  goals.value.splice(index, 1)
}

function darkenHexColor(hex: string, percent: number): string {
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
  percent = clamp(percent, 0, 100);

  hex = hex.replace(/^#/, '');

  let r: number, g: number, b: number;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error('Invalid hex color');
  }

  r = Math.round(r * (1 - percent / 100));
  g = Math.round(g * (1 - percent / 100));
  b = Math.round(b * (1 - percent / 100));

  const toHex = (c: number) => c.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

</script>

<template>
  <div>
    <h3>{{$t('settings.goals')}}</h3>
    <table>
      <tbody>
        <tr v-for="(goal, index) in goals" :key="index">
          <td>
            <select v-model.number="goal.petalId">
              <option
                  v-for="i in 106"
                  :key="i"
                  :value="i"
              >
                {{$t(`petal.${i}`)}}
              </option>
            </select>
          </td>
          <td>
            <select v-model.number="goal.petalRarity">
              <option
                  v-for="i in 9"
                  :key="i - 1"
                  :value="i - 1"
                  :style="{backgroundColor: darkenHexColor(rarityColor[i - 1], 30)}"
              >
                {{$t(`rarity.${i - 1}`)}}
              </option>
            </select>
          </td>
          <td class="grow"><input type="number" v-model.number="goal.goal"
                                  @keydown.stop
                                  @keypress.stop
                                  @keyup.stop/></td>
          <td><button @click="deleteItem(index)">{{$t('settings.delete')}}</button></td>
        </tr>
      </tbody>
    </table>
    <button @click="addItem">+</button>
  </div>
</template>

<style>
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

td {
  vertical-align: top;
}

td.grow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

td input {
  width: 100%;
  box-sizing: border-box;
}

tbody {
  display: flex;
  width: 100%;
  flex-direction: column;
}
select, input, button {
  background-color: #ffffff33;
  border: none;
  border-radius: calc(var(--unit) * 0.5);
  color: #ffffff;
  outline: none;
  font-size: 1em;
  white-space: nowrap;
}
option {
  background-color: #555555;
  color: white;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.grow {
  flex-grow: 1;
}
</style>