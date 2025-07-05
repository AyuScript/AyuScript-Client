<script setup lang="ts">
import WarnBanner from "./WarnBanner.vue";
import { banners } from "./warnBanner.ts";
</script>

<template>
  <transition-group name="slide-x" tag="div">
    <WarnBanner
        v-for="banner in banners"
        :key="banner.id"
        :banner="banner"
    />
  </transition-group>
</template>

<style scoped>
.slide-x-enter-active,
.slide-x-leave-active {
  transition: all 1s ease;
}
.slide-x-enter-from {
  transform: translateX(300px);
}
.slide-x-enter-to {
  transform: translateX(0);
}
.slide-x-leave-from {
  transform: translateX(0);
}
.slide-x-leave-to {
  transform: translateX(300px);
}
</style>
