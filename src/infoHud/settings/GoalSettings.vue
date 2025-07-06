<script setup lang="ts">
import {goals} from "@/storage/globals.ts";

const addItem = () => {
  goals.value.push({ petalId: 1, petalRarity: 0, goal: 1 })
}

const deleteItem = (index: number) => {
  goals.value.splice(index, 1)
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
              >
                {{$t(`rarity.${i - 1}`)}}
              </option>
            </select>
          </td>
          <td class="grow"><input type="number" v-model.number="goal.goal" /></td>
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