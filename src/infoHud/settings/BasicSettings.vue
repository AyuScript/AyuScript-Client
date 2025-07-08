<script setup lang="ts">

import {information} from "@/storage/globals.ts";
</script>

<template>
  <div>
    <h3>{{$t('settings.basic.title')}}</h3>
    <span>
      {{$t('settings.basic.information')}}
    </span>
    <select v-model="information">
      <option
          v-for="i in ['fps', 'ping']"
          :key="i"
          :value="i"
      >
        {{$t(`summary.info.${i}`)}}
      </option>
    </select>
  </div>
</template>

<style scoped>

</style>